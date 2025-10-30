export function formatDate(dateString) {
  if (!dateString) return "";

  try {
    const s = String(dateString).trim();

    // Prefer extracting date components directly to avoid timezone shifts
    // Pattern: YYYY-MM-DD (allowing / . - separators)
    const isoMatch = s.match(/^(\d{4})[\/.\-](\d{1,2})[\/.\-](\d{1,2})/);
    if (isoMatch) {
      const y = isoMatch[1];
      const m = isoMatch[2].padStart(2, "0");
      const d = isoMatch[3].padStart(2, "0");
      return `${d}/${m}/${y}`;
    }

    // Pattern: DMY or MDY with separators (default to DMY for display)
    const sepMatch = s.match(/^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{2,4})$/);
    if (sepMatch) {
      const a = sepMatch[1].padStart(2, "0");
      const b = sepMatch[2].padStart(2, "0");
      const y = sepMatch[3].length === 2 ? `20${sepMatch[3]}` : sepMatch[3];
      // Assume DMY for display (common in en-GB contexts)
      return `${a}/${b}/${y}`;
    }

    // Fallback: native Date parsing, but use local date parts to avoid UTC off-by-one
    const date = new Date(s);
    if (isNaN(date.getTime())) return "";
    
    // Use local date parts to avoid timezone shifting that can cause off-by-one day issues
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear().toString();

    return `${month}/${day}/${year}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
}

export function formatDate2(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  const day = date.getUTCDate();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = monthNames[date.getUTCMonth()];
  const year = date.getUTCFullYear();

  const daySuffix = (day) => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  return `${day}${daySuffix(day)} ${month} ${year}`;
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

export function calculatePercentage(part, whole) {
  const p = Number(part);
  const w = Number(whole);
  if (!Number.isFinite(p) || !Number.isFinite(w) || w <= 0) return 0;
  return (p / w) * 100;
}

export function extractEmail(inputString) {
  console.log(inputString);
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const match = inputString.match(emailRegex);
  return match ? match[0] : null;
}
