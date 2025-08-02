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
          plan: 5, // Default to Free plan
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

    if (isAuthenticated() && user?.role === "admin") {
      getSubscription();
    }
  }, [user]);

  useEffect(() => {
    if (
      subscription &&
      subscription.plan &&
      user?.role === "admin" &&
      Array.isArray(subscriptions) &&
      subscriptions.length > 0
    ) {
      getSubscriptionDetails(subscription.plan);
    }
  }, [subscription, user, subscriptions]);

  const login = async (
    email,
    password,
    otp = undefined,
    isReg = false,
    isMember = false
  ) => {
    try {
      // Prepare endpoint and request body
      const endpoint = isMember
        ? `${process.env.NEXT_PUBLIC_SWAGGER_URL}/agency-member/login/`
        : `${process.env.NEXT_PUBLIC_SWAGGER_URL}/agency/login/`;
      // const body = otp
      //   ? JSON.stringify({ email, password, otp })
      //   : JSON.stringify({ email, password });
      const body = JSON.stringify({ email, password });

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        cache: "no-store",
      });

      if (!response.ok) {
        // toast.error("Invalid email or password");
        return response;
      }

      // For agency_member, or for agency with OTP provided, process tokens and user info
      if (isMember || !otp) {
        // temporarily changed to !otp for agency login without OTP
        const { tokens, agency_member, agency } = await response.json();
        // For agency_member login
        if (isMember) {
          storeTokens(tokens.access, tokens.refresh, {
            id: agency_member.id,
            name: agency_member.member_name,
            email: agency_member.email,
            // is_verified: agency_member.is_verified,
            phone_number: agency_member.phone_number,
            role: "member",
            agency: agency_member.agency,
          });
          setUser({
            id: agency_member.id,
            name: agency_member.member_name,
            email: agency_member.email,
            // is_verified: agency_member.is_verified,
            phone_number: agency_member.phone_number,
            role: "member",
            agency: agency_member.agency,
          });
        } else {
          // For agency login with OTP
          storeTokens(tokens.access, tokens.refresh, {
            id: agency.id,
            name: agency.agency_name,
            email: agency.email,
            is_verified: agency.is_verified,
            phone_number: agency.phone_number,
            role: "admin",
          });
          setUser({
            id: agency.id,
            name: agency.agency_name,
            email: agency.email,
            is_verified: agency.is_verified,
            phone_number: agency.phone_number,
            role: "admin",
          });
        }
        localStorage.setItem("lastLogin", new Date().toISOString());
        if (!isReg) {
          const params = new URLSearchParams(window.location.search);
          const redirectPath = params.get("redirect") || "/dashboard/overview";
          router.push(redirectPath);
          return true;
        }
      }
      // For agency login first step (no OTP), just return the response
      if (otp && !isMember) {
        return response;
      }
    } catch (error) {
      // console.error("Login error:", error);
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
