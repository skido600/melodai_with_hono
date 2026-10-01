"use client";

import { MusicPlayer } from "@/components/MusicPay";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import LoaderLove from "@/helper/loaderLove";

import { useMobile } from "@/hooks/MobileContext";
import { MusicProvider } from "@/hooks/MusicProvider";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/util/music-api";

export default function DashboardClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { open } = useMobile();
  const router = useRouter();

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    retry: false,
  });

  if (isLoading) {
    return <LoaderLove />;
  }

  if (isError || !user) {
    router.replace("/");
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
