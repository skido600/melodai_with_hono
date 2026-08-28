import DashboardClientLayout from "@/components/DashboardClientLayout";
// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL!;
console.log("text env", backendUrl);
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const cookieStore = await cookies();

  const res = await fetch(`${backendUrl}/auth/me`, {
    method: "GET",
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    console.log(data, "error from protected");
    // redirect("/");
  }

  return <DashboardClientLayout>{children}</DashboardClientLayout>;
}
