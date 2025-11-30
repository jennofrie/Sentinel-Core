import type { Metadata } from "next";
import "@fontsource/rajdhani/400.css";
import "@fontsource/rajdhani/500.css";
import "@fontsource/rajdhani/600.css";
import "@fontsource/rajdhani/700.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "./globals.css";
import { SystemLogProvider } from "@/context/SystemLogContext";
import { AuthProvider } from "@/context/AuthContext";
import PWARegister from "@/components/pwa/PWARegister";

export const metadata: Metadata = {
  title: "Sentinel - Blue Team Threat Intelligence Dashboard",
  description: "Single-Pane-of-Glass dashboard for Cybersecurity Analysts",
  manifest: "/manifest.json",
  themeColor: "#00F0FF",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Sentinel",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="application-name" content="Sentinel" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Sentinel" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-TileColor" content="#00F0FF" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className="font-sans antialiased">
        <PWARegister />
        <AuthProvider>
          <SystemLogProvider>
            {children}
          </SystemLogProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

