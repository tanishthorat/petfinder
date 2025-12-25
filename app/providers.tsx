"use client";

import { NextUIProvider } from "@nextui-org/react";
import { SupabaseAuthProvider } from "@/lib/supabase/auth-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SupabaseAuthProvider>
      <NextUIProvider>
        {children}
      </NextUIProvider>
    </SupabaseAuthProvider>
  );
}
