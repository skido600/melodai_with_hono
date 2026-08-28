import DashboardClientLayout from "@/components/DashboardClientLayout";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL!;

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();

  const res = await fetch(`${backendUrl}/auth/me`, {
    method: "GET",
    headers: {
      Cookie: cookieStore.toString(),
    },
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    console.log("Protected route error:", data);
    redirect("/");
  }

  return <DashboardClientLayout>{children}</DashboardClientLayout>;
}
