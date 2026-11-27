import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LotteryLab | Lottery statistics, made transparent",
  description:
    "Explore historical lottery data with transparent statistics and honest backtesting."
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
