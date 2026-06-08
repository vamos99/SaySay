"use client";

import { getPublicEnv } from "@/utils/env";

function isPlaceholder(value: string | undefined): boolean {
  if (!value) return true;
  return value.includes("your-project") || value.includes("your_supabase");
}

function getMissingConfig(): string[] {
  const missing: string[] = [];

  if (isPlaceholder(getPublicEnv("NEXT_PUBLIC_SUPABASE_URL"))) {
    missing.push("NEXT_PUBLIC_SUPABASE_URL");
  }

  if (isPlaceholder(getPublicEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"))) {
    missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  if (!getPublicEnv("NEXT_PUBLIC_BACKEND_URL") && !getPublicEnv("NEXT_PUBLIC_API_URL")) {
    missing.push("NEXT_PUBLIC_BACKEND_URL");
  }

  return missing;
}

export function EnvStatusBanner() {
  const missing = getMissingConfig();

  if (missing.length === 0) {
    return null;
  }

  return (
    <div
      role="status"
      style={{
        width: "100%",
        background: "#fff7ed",
        borderBottom: "1px solid #fed7aa",
        color: "#7c2d12",
        fontSize: 13,
        lineHeight: 1.5,
        padding: "10px 18px",
        textAlign: "center",
      }}
    >
      Yerel/demo yapılandırması eksik: {missing.join(", ")}. Portal ve oyun
      verileri sınırlı çalışabilir.
    </div>
  );
}
