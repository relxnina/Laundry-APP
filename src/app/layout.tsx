import "./globals.css";
import type { Metadata } from "next";
// import { AuthProvider } from "firebase/auth";
import { AuthProvider } from "@/context/AuthContext";
//import AuthGuard from "@/components/AuthGuard";//

export const metadata: Metadata = {
  title: "Laundry App",
  description: "Laundry management app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}