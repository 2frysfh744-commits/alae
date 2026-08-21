import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Happy Birthday, Hoda! 🎂",
  description: "Make a wish and blow out the candles.",
};

export default function BirthdayLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}

