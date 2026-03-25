"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Layout/User/Sidebar";
import Header from "@/components/Layout/User/Header";
import { useGetMeQuery } from "../services/features/auth/authApi";
import GlobalLoader from "@/components/GlobalLoader";
import { useRouter } from "next/navigation";
import SupportTerminal from "@/components/support/SupportTerminal";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data, isLoading, isError } = useGetMeQuery(undefined, {
    // skip: typeof window === "undefined", // Skip on server-side
  });

  // --- ALL CONDITIONAL RETURNS MUST GO BELOW THIS LINE ---

  if (isLoading) {
    return <GlobalLoader />;
  }

  return (
    <div className="h-screen flex overflow-hidden bg-background ">
      {/* Sidebar (fixed height, no scroll with page) */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {/* Main Area */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        {/* Header (fixed) */}
        <Header onMenuClick={() => setSidebarOpen(true)} />

        {/* Scrollable Content Only */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
        <SupportTerminal />
      </div>
    </div>
  );
}
