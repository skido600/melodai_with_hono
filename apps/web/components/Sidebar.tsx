import Link from "next/link";

import Logo from "./Logo";
import Image from "next/image";

import { navigation } from "@/util/navigvation";
import { useLogout } from "@/hooks/useLogout";
import toast from "react-hot-toast";

function Sidebar() {
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
    <main className="fixed hidden   text-white md:bg-[#131313]  w-50 top-0 bottom-0 p-5 lg:flex flex-col justify-between">
      <div>
        <Logo />

        <div className="flex flex-col space-y-4  mt-6">
          {menuItems.map((route, index) => (
            <Link href={route.path} key={index}>
              <div className="flex gap-x-2  items-center   cursor-pointer">
                <Image
                  src={route.img}
                  alt={route.name}
                  height={20}
                  width={20}
                  className="w-[21.33px] h-6"
                />
                <p className="  text-white font-bold text-sm ">{route.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="grid gap-2 items-center space-y-2">
        <div
          role="button"
          aria-disabled={logoutMutation.isPending}
          onClick={() => {
            if (!logoutMutation.isPending) {
              handleLogout();
            }
          }}
          className={`md:flex items-center cursor-pointer transition-opacity ${
            logoutMutation.isPending ? "pointer-events-none opacity-60" : ""
          }`}>
          <Image
            src={logout.img}
            alt={logout.name}
            height={20}
            width={20}
            className={`w-[21.33px] h-6 transition-all duration-300 ${
              logoutMutation.isPending
                ? "scale-75 opacity-50"
                : "scale-100 opacity-100"
            }`}
          />

          <p className="text-white font-bold text-sm md:block">
            {logoutMutation.isPending ? "Logging out..." : "Logout"}
          </p>
        </div>
      </div>
    </main>
  );
}

export default Sidebar;
