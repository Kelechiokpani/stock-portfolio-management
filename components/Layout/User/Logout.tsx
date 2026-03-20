"use client";

import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { logout } from "@/app/services/features/auth/authSlice";
import { toast } from "sonner";
import { apiSlice } from "@/app/services/api"; // Updated to the consolidated slice
import { useLogoutMutation } from "@/app/services/features/auth/authApi";
import Cookies from "js-cookie";

export const useLogout = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [triggerLogoutServer] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      // 1. Optional: Tell the server to invalidate the session
      // We don't "await" this if we want the UI to feel instant,
      // but it's good practice to trigger it.
      triggerLogoutServer();

      // 2. Clear Local Storage & Cookies
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      Cookies.remove("token");

      // 3. Clear Redux Auth State
      dispatch(logout());

      // 4. CRITICAL: Reset the entire RTK Query cache
      // This prevents the next user from seeing the previous user's data.
      dispatch(apiSlice.util.resetApiState());

      // 5. Redirect and Notify
      router.push("/login");
      toast.success("Logged out successfully");
    } catch (error) {
      // Even if the server call fails, we still clear local data
      router.push("/login");
    }
  };

  return handleLogout;
};
