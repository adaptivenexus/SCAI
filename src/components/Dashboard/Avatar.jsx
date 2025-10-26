import Image from "next/image";
import { useState, useEffect } from "react";

const Avatar = ({
  src,
  name,
  size = 48,
  className = "",
  showStatus = false,
  isActive = false,
  fallbackBg = "bg-gradient-to-br from-blue-500 to-purple-600",
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted on client side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Function to get initials from name
  const getInitials = (name) => {
    if (!name) return "?";

    // Handle cases where name might be "Business Name (email@domain.com)"
    const cleanName = name.split("(")[0].trim();

    const words = cleanName.split(" ").filter((word) => word.length > 0);
    if (words.length === 0) return "?";

    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }

    return (
      words[0].charAt(0) + words[words.length - 1].charAt(0)
    ).toUpperCase();
  };

  const initials = getInitials(name);
  const hasValidImage = mounted && src && src !== "" && !src.includes("placeholder") && !imageError;

  return (
    <div className="relative">
      {hasValidImage ? (
        <Image
          className="rounded-full"
          src={src || "/images/avatar.png"}
          alt={name ? `${name}'s avatar` : "User avatar"}
          width={size}
          height={size}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageError(true);
            setImageLoaded(false);
          }}
        />
      ) : null}

      {/* Fallback initial letter avatar */}
      <div
        className={`${
          hasValidImage ? "hidden" : "flex"
        } items-center justify-center aspect-square rounded-full ring-2 ring-white shadow-md text-white font-bold ${fallbackBg} ${className}`}
        style={{ width: size, height: size, fontSize: size * 0.4 }}
      >
        {initials}
      </div>

      {/* Status indicator */}
      {showStatus && (
        <div
          className={`absolute -bottom-1 -right-1 w-4 h-4 ${
            isActive ? "bg-green-500" : "bg-gray-400"
          } rounded-full border-2 border-white shadow-sm`}
        />
      )}
    </div>
  );
};

export default Avatar;
