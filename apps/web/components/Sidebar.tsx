"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import Logo from "./Logo";
import { navigation } from "@/util/navigvation";
import { useLogout } from "@/hooks/useLogout";
import { useMe } from "@/hooks/useme";

function Sidebar() {
  const router = useRouter();
  const logoutMutation = useLogout();
  const { data: user, isLoading, isError } = useMe();

  console.log("SIDEBAR USER:", user);
  console.log("SIDEBAR ERROR:", isError);

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Logged out successfully");

        setTimeout(() => {
          router.replace("/signup");
        }, 500);
      },

      onError: (error) => {
        toast.error(
          error instanceof Error ? error.message : "Could not logout",
        );
      },
    });
  };

  return (
    <main className="fixed top-0 bottom-0 hidden w-50 flex-col justify-between bg-[#131313] p-5 text-white lg:flex">
      {/* TOP */}
      <div>
        <Logo />

        <div className="mt-6 flex flex-col space-y-4">
          {navigation.map((route, index) => (
            <Link href={route.path} key={index}>
              <div className="flex cursor-pointer items-center gap-x-2">
                <Image
                  src={route.img}
                  alt={route.name}
                  width={21}
                  height={24}
                />

                <p className="text-sm font-bold text-white">{route.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* BOTTOM */}
      <div className="space-y-4">
        {/* PROFILE */}
        <Link
          href="/profile"
          className="flex items-center gap-3 rounded-lg p-2 transition hover:bg-white/5 text-white">
          <Link href="/profile">
            {isLoading ? (
              <div className="h-8 w-8 animate-pulse rounded-full bg-white/10" />
            ) : user?.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt={user.name}
                width={32}
                height={32}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : null}
          </Link>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{user?.name}</p>

            <p className="truncate text-[11px] text-gray-400">{user?.email}</p>
          </div>
        </Link>

        {/* LOGOUT */}
        <button
          type="button"
          disabled={logoutMutation.isPending}
          onClick={handleLogout}
          className={`flex w-full items-center gap-2 cursor-pointer transition-opacity ${
            logoutMutation.isPending ? "pointer-events-none opacity-60" : ""
          }`}>
          <Image
            src="/logut.svg"
            alt="Logout"
            width={21}
            height={24}
            className="h-6 w-[21px]"
          />

          <p className="text-sm font-bold text-white">
            {logoutMutation.isPending ? "Logging out..." : "Logout"}
          </p>
        </button>
      </div>
    </main>
  );
}

export default Sidebar;
