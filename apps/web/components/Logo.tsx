import Image from "next/image";

function Logo({ w = 60, h = 60 }: { w?: number; h?: number }) {
  return (
    <Image
      src="/melodias logo.svg"
      width={w}
      height={h}
      alt="Melodia Logo"
      className="rounded-xl bg-[#061417] p-2"
    />
  );
}

export default Logo;
