import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Custom Form Builder",
  description: "Custom Form Builder for creating dynamic forms",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
