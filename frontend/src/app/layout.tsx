import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "VetBot",
  description:
    "Easily submit an appointment request to your vet, and chat with our AI vet assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className} antialiased bg-gray-50 text-gray-600`}
      >
        <div className="max-h-screen grid grid-cols-[auto_1fr] grid-rows-[auto_1fr] ">
          <div className="col-start-1 row-span-2">
            <Sidebar />
          </div>
          <div className="col-start-2">
            <Header />
          </div>
          <main className="col-start-2 pt-8 overflow-y-scroll">{children}</main>
        </div>
      </body>
    </html>
  );
}
