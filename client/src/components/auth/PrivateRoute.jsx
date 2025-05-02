"use client";
import React, { useEffect, useState } from "react";
import PreLoginLayout from "../layout/PreLoginLayout";
import PostLoginLayout from "../layout/PostLoginLayout";
import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";

const publicRoutes = ["/login", "/signup"];
const knownRoutes = ["/", ...publicRoutes];

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (loading) return;

    const isPublic = publicRoutes.includes(pathname);
    const isKnown = knownRoutes.includes(pathname);

    if (isAuthenticated && !isKnown) {
      setRedirecting(true);
      router.replace("/");
      return;
    }

    if (!isAuthenticated && !isPublic) {
      setRedirecting(true);
      router.replace("/login");
      return;
    }

    if (isAuthenticated && isPublic) {
      setRedirecting(true);
      router.replace("/");
      return;
    }
    setRedirecting(false); // safe to render content
  }, [isAuthenticated, loading, pathname, router]);

  // Show loading state if auth state is still being determined
  if (loading || redirecting) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated && publicRoutes.includes(pathname)) {
    return <PreLoginLayout>{children}</PreLoginLayout>;
  }

  if (isAuthenticated) {
    return <PostLoginLayout>{children}</PostLoginLayout>;
  }

  // Return null to prevent flashing if conditions above haven't resolved
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
    </div>
  );
};

export default PrivateRoute;
