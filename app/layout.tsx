import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AGRINOVA",
  description:
    "Intelligent agricultural management and farmer-buyer connection platform.",
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