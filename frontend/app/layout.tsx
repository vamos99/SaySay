import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./styles/index.css";
import { Header } from "@/components/Header";
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
      <body className="app-root-body">
        <AuthProvider>
          <UserTypeProvider>
            <RouteGuard>
              <Header />
              {children}
            </RouteGuard>
          </UserTypeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
