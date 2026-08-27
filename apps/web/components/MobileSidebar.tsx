"use client";

import Link from "next/link";
import Image from "next/image";
import { navigation } from "@/util/navigvation";
import toast from "react-hot-toast";
import { useLogout } from "@/hooks/useLogout";
import Logo from "./Logo";
function MobileSidebar() {
  const menuItems = navigation;
  const logoutMutation = useLogout();
  const logout = {
    name: "Logout",

    img: "logut.svg",
  };
  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Logged out successfully");

        setTimeout(() => {
          window.location.href = "/signup";
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
        lg:hidden
        bg-[#101010]
        z-50
      ">
      <div className="flex  flex-col space-y-4 mt-6">
        {" "}
        <Logo h={40} w={40} />
        {menuItems.map((route, index) => (
          <Link href={route.path} key={index}>
            <div className="flex gap-x-2 ml-2 items-center cursor-pointer">
              <Image
                src={route.img}
                alt={route.name}
                height={20}
                width={20}
                className="w-[21.33px] h-6"
              />
            </div>
          </Link>
        ))}
      </div>

      {/* Logout */}
      {/* Logout */}
      <div className="mt-auto pb-6 ml-2">
        <div
          role="button"
          aria-disabled={logoutMutation.isPending}
          onClick={() => {
            if (!logoutMutation.isPending) {
              handleLogout();
            }
          }}
          className={`flex items-center cursor-pointer transition-opacity ${
            logoutMutation.isPending ? "pointer-events-none opacity-60" : ""
          }`}>
          <Image
            src={logout.img}
            alt={logout.name}
            height={20}
            width={20}
            className={`w-[21.33px] h-6 transition-all duration-300 ${
              logoutMutation.isPending
                ? "scale-75 opacity-40 animate-pulse"
                : "scale-100 opacity-100"
            }`}
          />
        </div>
      </div>
    </main>
  );
}

export default MobileSidebar;
