import "./globals.css";
import Providers from "./providers";
import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-[#0f0f17]">
      <body className="bg-[#0f0f17] text-white min-h-screen m-0 p-0">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}