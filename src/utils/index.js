export function formatDate(dateString) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const date = new Date(dateString);
  const day = date.getUTCDate();
  const month = months[date.getUTCMonth()];
  const year = date.getUTCFullYear();

  return `${day} ${month} ${year}`;
}

export function extractFilenameFromUrl(url) {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname; // /documents/documents/Ledger%20Works/Ledger%20Client/temp1.pdf
    const decodedPath = decodeURIComponent(pathname);
    const segments = decodedPath.split("/");
    return segments[segments.length - 1]; // temp1.pdf
  } catch (error) {
    console.error("Invalid URL:", error);
    return null;
  }
}
