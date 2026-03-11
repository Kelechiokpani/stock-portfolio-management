// app/providers.tsx (or similar)
"use client";

import { ReduxProvider } from "./services/Provider/Providers";
import { CartProvider } from "./services/Provider/CartProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <CartProvider>{children}</CartProvider>
    </ReduxProvider>
  );
}
