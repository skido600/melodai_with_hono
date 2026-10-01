"use client";

import Link from "next/link";
import Image from "next/image";
import { navigation } from "@/util/navigvation";
import toast from "react-hot-toast";
import { useLogout } from "@/hooks/useLogout";
import { useRouter } from "next/navigation";
import { useMe } from "@/hooks/useme";
import Logo from "./Logo";

function MobileSidebar() {
  const menuItems = navigation;
  const logoutMutation = useLogout();
  const router = useRouter();

  const { data: user, isLoading } = useMe();

  const logout = {
    name: "Logout",
    img: "logut.svg",
  };

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Logged out successfully");

        setTimeout(() => {
          router.push("/signup");
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
    <main
      className="
        fixed
        inset-y-0
        left-0
        flex
        w-12
        flex-col
        bg-[#101010]
        lg:hidden
        z-50
      ">
      {/* TOP */}
      <div className="mt-6 flex flex-col space-y-4">
        <Logo h={40} w={40} />

        {menuItems.map((route, index) => (
          <Link href={route.path} key={index}>
            <div className="ml-3 flex cursor-pointer items-center">
              <Image
                src={route.img}
                alt={route.name}
                height={20}
                width={20}
                className="h-6 w-[21.33px]"
              />
            </div>
          </Link>
        ))}
      </div>

      {/* BOTTOM */}
      <div className="mt-auto flex flex-col items-center gap-5 pb-6">
        {/* PROFILE IMAGE */}
        <Link href="/profile">
          {isLoading ? (
            <div className="h-8 w-8 animate-pulse rounded-full bg-white/10" />
          ) : user?.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt={user.name || "User"}
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-700 text-xs font-bold text-white">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
          )}
        </Link>

        {/* LOGOUT */}
        <button
          type="button"
          disabled={logoutMutation.isPending}
          onClick={handleLogout}
          className={`cursor-pointer transition-opacity ${
            logoutMutation.isPending ? "pointer-events-none opacity-60" : ""
          }`}>
          <Image
            src={logout.img}
            alt={logout.name}
            height={20}
            width={20}
            className="h-6 w-[21.33px]"
          />
        </button>
      </div>
    </main>
  );
}

export default MobileSidebar;
