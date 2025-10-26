export function formatDate(dateString) {
  if (!dateString) return "";
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear();

    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
}

export function formatDate2(dateString) {
  const date = new Date(dateString);
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
  return (part / whole) * 100;
}

export function extractEmail(inputString) {
  console.log(inputString);
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const match = inputString.match(emailRegex);
  return match ? match[0] : null;
}
