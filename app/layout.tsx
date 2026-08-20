import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Just One Question 🖤",
  description: "A very serious question with only one correct answer.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
