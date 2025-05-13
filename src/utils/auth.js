// Token storage keys
const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_DATA_KEY = "userData";

// Check if we're in browser environment
const isBrowser = typeof window !== "undefined";

// Store tokens and user data
export const storeTokens = (accessToken, refreshToken, userData) => {
  if (!isBrowser) return;

  // Store in localStorage
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  if (userData) {
    // Store user data in localStorage
    // alter user data to add hardcoded agency id
    userData.id = 6; // for temporary testing

    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
  }

  // Store in cookie
  document.cookie = `${ACCESS_TOKEN_KEY}=${accessToken}; path=/; max-age=3600`;
  document.cookie = `${REFRESH_TOKEN_KEY}=${refreshToken}; path=/; max-age=604800`;
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

  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  const accessTokenCookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${ACCESS_TOKEN_KEY}=`));
  const refreshTokenCookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${REFRESH_TOKEN_KEY}=`));

  if (
    (!accessTokenCookie && accessToken) ||
    (!refreshTokenCookie && refreshToken) ||
    (!accessToken && accessTokenCookie) ||
    (!refreshToken && refreshTokenCookie)
  ) {
    storeTokens(
      accessToken || accessTokenCookie.split("=")[1],
      refreshToken || refreshTokenCookie.split("=")[1]
    );
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
  document.cookie = `${ACCESS_TOKEN_KEY}=; path=/; max-age=0`;
  document.cookie = `${REFRESH_TOKEN_KEY}=; path=/; max-age=0`;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  if (!isBrowser) return false;
  // check access token and refresh token from cookies and local storage
  const { accessToken, refreshToken } = getStoredTokens();

  return !!accessToken || !!refreshToken;
};

let refreshTokenPromise = null;

export const authFetch = async (url, options = {}, refreshTokenFn) => {
  const headers = {
    ...options.headers,
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch(url, { ...options, headers });

    if (response.status === 401 || response.status === 403) {
      if (!refreshTokenPromise) {
        refreshTokenPromise = refreshTokenFn().finally(() => {
          refreshTokenPromise = null;
        });
      }

      const data = await refreshTokenPromise;
      const newAccessToken = data.accessToken;

      if (newAccessToken) {
        headers.Authorization = `Bearer ${newAccessToken}`;
        return fetch(url, { ...options, headers });
      } else {
        throw new Error("Unable to refresh token");
      }
    }

    return response;
  } catch (error) {
    console.error("authFetch error:", error);
    throw error;
  }
};
