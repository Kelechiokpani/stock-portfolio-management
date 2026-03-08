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

  // 2. SET TO TRUE ON MOUNT
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { data, isLoading, error } = useGetMeQuery(undefined, {
    refetchOnMountOrArgChange: false,
    skip: !isMounted, // 3. SKIP THE QUERY UNTIL MOUNTED
  });

  useEffect(() => {
    if (!isLoading && data?.user) {
      if (data.user.role !== "admin") {
        router.push("/dashboard");
      }
    }
  }, [data, isLoading, router]);

  if (!isMounted) return <GlobalLoader />;

  if (isLoading) return <GlobalLoader />;

  const errorMessage =
    error && "data" in error
      ? (error.data as any)?.message || "Unauthorized Access"
      : "An unexpected error occurred";

  if (error) {
    return (
      <div className="h-[60vh] flex items-center justify-center p-6">
        <Card className="max-w-md border-red-200 bg-red-50 dark:bg-red-950/20">
          <CardContent className="pt-6 text-center space-y-4">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
            <div className="space-y-2">
              <h3 className="font-bold text-red-900 dark:text-red-400">
                Access Denied
              </h3>
              <p className="text-sm text-red-700 dark:text-red-500/80">
                {errorMessage}
              </p>
            </div>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
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
