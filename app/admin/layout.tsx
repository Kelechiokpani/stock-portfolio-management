"use client";
import React, { useEffect, useState } from "react";
import Admin_Header from "@/components/Layout/Admin/Admin_Header";
import Admin_Sidebar from "@/components/Layout/Admin/Admin_Sidebar";
import { useGetMeQuery } from "../services/features/auth/authApi";
import { AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import GlobalLoader from "@/components/GlobalLoader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Hook 1: useState (isMounted)
  // Hook 2: useGetMeQuery
  const { data, isLoading, error } = useGetMeQuery(undefined, {
    refetchOnMountOrArgChange: false,
    skip: !isMounted,
  });

  // Hook 3: useEffect (Mount check)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Hook 4: useEffect (Redirect logic)
  useEffect(() => {
    if (isMounted && !isLoading && data?.user) {
      if (error || !data?.user) {
        router.push("/login");
        return;
      }

      if (data.user.role !== "admin") {
        router.push("/dashboard");
      }
    }
  }, [data, isLoading, router, isMounted]);

  // --- ALL CONDITIONAL RETURNS MUST GO BELOW THIS LINE ---

  if (!isMounted || isLoading) {
    return <GlobalLoader />;
  }

  return (
    <div className="h-screen flex overflow-hidden bg-background ">
      {/* Sidebar (fixed height, no scroll with page) */}
      <Admin_Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {/* Main Area */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        {/* Header (fixed) */}
        <Admin_Header onMenuClick={() => setSidebarOpen(true)} />

        {/* Scrollable Content Only */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
