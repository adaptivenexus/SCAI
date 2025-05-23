"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  storeTokens,
  getStoredTokens,
  clearTokens,
  isAuthenticated,
  authFetch,
} from "@/utils/auth";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscriptions, setSubscriptions] = useState([]);
  const [subscription, setSubscription] = useState({});
  const [previousSubscriptions, setPreviousSubscriptions] = useState([]);
  const [subscriptionDetails, setSubscriptionDetails] = useState({});

  const getSubscriptions = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SWAGGER_URL}/subscription_plan/list/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch subscription");
      }

      const data = await response.json();
      setSubscriptions(data);
    } catch (error) {
      console.error("Error fetching subscription:", error);
    }
  };

  const getSubscription = async () => {
    try {
      const response = await authFetch(
        `${process.env.NEXT_PUBLIC_SWAGGER_URL}/agency_subscription/subscriptions/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
        refreshTokenFn
      );

      if (!response.ok) {
        throw new Error("Failed to fetch subscription");
      }

      const data = await response.json();

      const agency = await localStorage.getItem("userData");

      let subscriptionData = data.find((item) => {
        return item.agency === JSON.parse(agency).id && item.is_active;
      });

      if (!subscriptionData) {
        const newPlan = {
          is_active: true,
          expires_on: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .slice(0, 10), // Extracts the date in "YYYY-MM-DD" format
          plan: 1,
          used_scans: 0,
          registered_users_count: 1,
          used_storage: 0,
          agency: user.id,
        };

        await authFetch(
          `${process.env.NEXT_PUBLIC_SWAGGER_URL}/agency_subscription/add/`,
          {
            method: "POST",
            body: JSON.stringify(newPlan),
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          },
          refreshTokenFn
        );

        return getSubscription();
      }

      setSubscription(subscriptionData || {});

      let previousSubscriptionData = data
        .filter((item) => item.agency === JSON.parse(agency).id)
        .sort((a, b) => new Date(b.subscribed_on) - new Date(a.subscribed_on));

      setPreviousSubscriptions(previousSubscriptionData);
    } catch (error) {
      console.error("Error fetching subscription:", error);
    }
  };

  const getSubscriptionDetails = async (id) => {
    try {
      const response = subscriptions.find((item) => item.id === id);

      if (!response) {
        throw new Error("Failed to fetch subscription");
      }

      setSubscriptionDetails(response);
    } catch (error) {
      console.error("Error fetching subscription:", error);
    }
  };

  useEffect(() => {
    // Check for stored tokens on mount
    const { userData } = getStoredTokens();
    if (userData) {
      setUser(userData);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    getSubscriptions();

    if (isAuthenticated() && user) {
      getSubscription();
    }
  }, [user]);

  useEffect(() => {
    if (subscription && subscription.plan && user) {
      getSubscriptionDetails(subscription.plan);
    }
  }, [subscription, user]);

  const login = async (email, password, isReg = false) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SWAGGER_URL}/agency/login/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        toast.error("Invalid email or password");
        return;
      }

      const { tokens, agency } = await response.json();

      // Store tokens and user data
      storeTokens(tokens.access, tokens.refresh, agency);
      setUser(agency);
      localStorage.setItem("lastLogin", new Date().toISOString());

      if (!isReg) {
        // Get redirect path from URL or default to dashboard

        const params = new URLSearchParams(window.location.search);
        const redirectPath = params.get("redirect") || "/dashboard/overview";

        // Redirect to the intended destination
        router.push(redirectPath);
        return true;
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    clearTokens();
    setUser(null);
    router.push("/auth/login");
  };

  const refreshTokenFn = async () => {
    const { refreshToken } = getStoredTokens();
    if (!refreshToken) {
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SWAGGER_URL}/agency/token/refresh/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh: refreshToken }),
        }
      );

      if (!response.ok) {
        logout();
        return;
      }

      const { access, refresh } = await response.json();
      storeTokens(access, refresh);
      return { accessToken: access, refreshToken: refresh };
    } catch (error) {
      console.error("Token refresh error:", error);
      logout();
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: isAuthenticated(),
    refreshTokenFn,
    subscriptions,
    subscription,
    previousSubscriptions,
    subscriptionDetails,
    getSubscription,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
