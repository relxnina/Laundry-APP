import "./globals.css";
import type { Metadata } from "next";
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
          {children}
      </body>
    </html>
  );
}