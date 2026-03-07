import ResetPassword from "@/components/ResetPassword";
import { Suspense } from "react";

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <p>Loading security context...</p>
        </div>
      }
    >
      <ResetPassword />
    </Suspense>
  );
}
