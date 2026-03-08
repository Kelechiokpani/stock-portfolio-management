"use client";

import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { logout } from "@/app/services/features/auth/authSlice";
import { toast } from "sonner";

export const useLogout = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    // 1. Trigger the Redux reducer (Clears State, LocalStorage, and Cookies)
    dispatch(logout());

    // 2. Notify the user
    toast.success("Logged out successfully");

    // 3. Redirect to login
    router.push("/login");
  };

  return handleLogout;
};
