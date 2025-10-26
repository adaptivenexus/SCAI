export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const fileUrl = searchParams.get("url");
    const rawFilename = searchParams.get("filename") || "download";

    if (!fileUrl) {
      return new Response(JSON.stringify({ error: "Missing 'url' query parameter" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Basic filename sanitization to prevent header injection
    const safeFilename = rawFilename.replace(/[^a-zA-Z0-9._-]/g, "_");

    // Fetch the remote file server-side (same-origin response back to browser)
    const upstream = await fetch(fileUrl, {
      method: "GET",
      redirect: "follow",
      cache: "no-store",
    });

    if (!upstream.ok || !upstream.body) {
      return new Response(JSON.stringify({
        error: "Failed to fetch upstream file",
        status: upstream.status,
      }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      });
    }

    const contentType = upstream.headers.get("content-type") || "application/octet-stream";
    const contentLength = upstream.headers.get("content-length");

    const headers = new Headers();
    headers.set("Content-Type", contentType);
    headers.set("Content-Disposition", `attachment; filename="${safeFilename}"`);
    if (contentLength) headers.set("Content-Length", contentLength);
    headers.set("Cache-Control", "no-store");

    // Stream the response body directly to the client
    return new Response(upstream.body, { headers });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal error", details: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}