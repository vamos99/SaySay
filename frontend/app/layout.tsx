import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./styles/index.css";
import { Header } from "@/components/Header";
import { AuthProvider } from './utils/AuthContext';
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SaySay",
  description: "Çocuğunuzun sesini duyun, gelişimini destekleyin!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const isPortal = pathname.startsWith('/portal');
  return (
    <html lang="tr">
      <body className={isPortal ? "app-root-body app-portal-root" : "app-root-body"}>
        <AuthProvider>
          <Header />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
