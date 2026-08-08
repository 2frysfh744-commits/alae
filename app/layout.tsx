import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "A Tiny Question For You 🖤",
  description: "A cute little question from someone who adores you.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
