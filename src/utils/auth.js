// Token storage keys
const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_DATA_KEY = "userData";

// Check if we're in browser environment
const isBrowser = typeof window !== "undefined";

// Cookie options
const COOKIE_OPTIONS = {
  path: "/",
  maxAge: 30 * 24 * 60 * 60, // 30 days
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
};

// Store tokens and user data
export const storeTokens = (accessToken, refreshToken, userData) => {
  if (!isBrowser) return;

  // Store in localStorage
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));

  // Store access token in cookie for server-side auth
  document.cookie = `sessionid=${accessToken}; path=${
    COOKIE_OPTIONS.path
  }; max-age=${COOKIE_OPTIONS.maxAge}${
    COOKIE_OPTIONS.secure ? "; secure" : ""
  }; samesite=${COOKIE_OPTIONS.sameSite}`;
};

// Get stored tokens and user data
export const getStoredTokens = () => {
  if (!isBrowser) {
    return {
      accessToken: null,
      refreshToken: null,
      userData: null,
    };
  }
  return {
    accessToken: localStorage.getItem(ACCESS_TOKEN_KEY),
    refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY),
    userData: JSON.parse(localStorage.getItem(USER_DATA_KEY) || "null"),
  };
};

// Clear stored tokens and user data
export const clearTokens = () => {
  if (!isBrowser) return;

  // Clear localStorage
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_DATA_KEY);

  // Clear cookie
  document.cookie = `${ACCESS_TOKEN_KEY}=; path=${COOKIE_OPTIONS.path}; max-age=0`;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  if (!isBrowser) return false;
  return !!localStorage.getItem(ACCESS_TOKEN_KEY);
};
