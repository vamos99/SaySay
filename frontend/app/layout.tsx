import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./styles/index.css";
import { ModernHeader } from "@/components/layout/ModernHeader";
import { AuthProvider } from './utils/AuthContext';
import { UserTypeProvider } from './utils/UserTypeContext';
import { RouteGuard } from './components/RouteGuard';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SaySay",
  description: "Çocuğunuzun sesini duyun, gelişimini destekleyin!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <AuthProvider>
          <UserTypeProvider>
            <RouteGuard>
              <ModernHeader />
              {children}
            </RouteGuard>
          </UserTypeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
