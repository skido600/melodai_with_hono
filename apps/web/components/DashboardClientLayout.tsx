"use client";

import { MusicPlayer } from "@/components/MusicPay";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";

import { useMobile } from "@/hooks/MobileContext";
import { MusicProvider } from "@/hooks/MusicProvider";

export default function DashboardClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { open } = useMobile();

  return (
    <MusicProvider>
      <div className="min-h-screen bg-background">
        <Sidebar />

        <div
          className={`lg:pl-60 transition-all duration-300 ${
            open ? "ml-16 lg:ml-0" : "ml-0"
          }`}>
          <TopNav />

          <main className="px-2 mb-17 py-6">{children}</main>
        </div>

        <div
          className={`lg:pl-60 8 transition-all duration-300 ${
            open ? "ml-16 lg:ml-0" : "w-full"
          }`}>
          <MusicPlayer />
        </div>
      </div>
    </MusicProvider>
  );
}
