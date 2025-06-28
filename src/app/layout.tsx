import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./styles/globals.css";
import { ThemeProvider } from "./components/ui/ThemeProvider";
import { AuthProvider } from "./context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ISummarize - Knowledge Unleashed",
  description: "AI-Powered Book Summaries & Reviews for Accelerated Learning.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}