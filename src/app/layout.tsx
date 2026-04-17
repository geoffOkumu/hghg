import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";

export const metadata: Metadata = {
  title: "Holy Ghost House of God",
  description:
    "Stay connected with Holy Ghost House of God. Subscribe to our newsletter for spiritual content, articles, and church updates.",
  keywords: ["church", "newsletter", "Holy Ghost House of God", "spiritual", "articles"],
  openGraph: {
    title: "Holy Ghost House of God",
    description: "Stay connected with Holy Ghost House of God",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50 text-gray-900">
        <ToastProvider />
        {children}
      </body>
    </html>
  );
}
