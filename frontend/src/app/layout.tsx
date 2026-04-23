import type { Metadata } from "next";
import "./globals.css";
import { ColdStart } from "@/components/ColdStart";

export const metadata: Metadata = {
  title: "EventFlow — Event Management Platform",
  description: "Create, manage, and share events with ease. A modern event management platform for organizers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ColdStart />
        {children}
      </body>
    </html>
  );
}
