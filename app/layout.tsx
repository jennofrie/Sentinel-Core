import type { Metadata } from "next";
import "@fontsource/rajdhani/400.css";
import "@fontsource/rajdhani/500.css";
import "@fontsource/rajdhani/600.css";
import "@fontsource/rajdhani/700.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "./globals.css";
import { SystemLogProvider } from "@/context/SystemLogContext";

export const metadata: Metadata = {
  title: "Sentinel - Blue Team Threat Intelligence Dashboard",
  description: "Single-Pane-of-Glass dashboard for Cybersecurity Analysts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <SystemLogProvider>
          {children}
        </SystemLogProvider>
      </body>
    </html>
  );
}

