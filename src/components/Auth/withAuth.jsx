"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function withAuth(Component) {
  return function ProtectedRoute(props) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.replace("/auth/login");
      }
    }, [loading, user, router]);

    // Show loading state while checking authentication
    if (loading) {
      return (
        <div className="h-screen w-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      );
    }

    // Don't render anything if not authenticated
    if (!user) {
      return null;
    }

    // Render the protected component if authenticated
    return <Component {...props} />;
  };
}
