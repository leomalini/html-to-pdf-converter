import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HTML -> PDF",
  description: "Converta HTML para PDF",
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
