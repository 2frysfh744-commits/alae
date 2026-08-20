import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Just One Question 🖤",
  description: "A very serious question with only one correct answer.",
};

export default function LoveQuestionLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
