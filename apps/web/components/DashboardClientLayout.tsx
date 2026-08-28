"use client";

import { MusicPlayer } from "@/components/MusicPay";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import LoaderLove from "@/helper/loaderLove";

import { useMobile } from "@/hooks/MobileContext";
import { MusicProvider } from "@/hooks/MusicProvider";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL!;
export default function DashboardClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { open } = useMobile();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${backendUrl}/auth/me`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          console.log("Not authenticated:", data);
          router.push("/");
          return;
        }
        console.log("User authenticated:", data);
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);
  if (loading) {
    return <LoaderLove />;
  }
  return (
    <MusicProvider>
      <div className="min-h-screen bg-background">
        <Sidebar />

        <div
          className={`lg:pl-60 transition-all duration-300 ${
            open ? "ml-16 lg:ml-0" : "ml-0"
          }`}>
          <TopNav />

          <main className="px-3 mb-17 py-6">{children}</main>
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
