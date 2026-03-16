"use client";

import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { logout } from "@/app/services/features/auth/authSlice";
import { toast } from "sonner";
import { baseApi } from "@/app/services/api";

export const useLogout = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    // 1. Trigger the Redux reducer (Clears State, LocalStorage, and Cookies)
    dispatch(logout());
    localStorage.removeItem("token");

    // 2. CRITICAL: Reset the entire RTK Query cache
    dispatch(baseApi.util.resetApiState());

    // Redirect to login
    router.push("/login");
    // 2. Notify the user
    toast.success("Logged out successfully");
  };

  return handleLogout;
};
