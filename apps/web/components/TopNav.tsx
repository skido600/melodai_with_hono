import Link from "next/link";
import { Menu, X } from "lucide-react";

import MobileSidebar from "./MobileSidebar";
import { useMobile } from "@/hooks/MobileContext";

function TopNav() {
  const list = [
    { name: "Explore", path: "/search" },
    { name: "Recommended", path: "/dashboard" },
  ];
  const { open, setOpen } = useMobile();
  return (
    <>
      <nav className="pt-4 z-50 px-2 text-white fixed bg-[#101010] right-0 left-0  lg:left-60">
        <div
          className={`flex transition-all duration-300 items-center gap-6   ${
            open ? "ml-16 lg:ml-0" : "w-full"
          }`}>
          {/* Desktop */}
          <div className=" items-center  gap-6 flex">
            {list.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className="group relative text pb-2">
                {item.name}

                <span className="absolute bottom-0 left-1/2 h-1 w-1/2 -translate-x-1/2 rounded-full bg-[#83DAA1] opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setOpen(!open)} className="ml-auto lg:hidden">
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>
      {open && <MobileSidebar />}
    </>
  );
}

export default TopNav;
