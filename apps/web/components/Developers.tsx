import Image from "next/image";
import React from "react";

function Developers() {
  const role = [
    {
      name: "Leowave",
      role: "Developer",
      connect: "mailto:ebisieonard@gmail.com",
      img: "/leowave.jpg",
    },
    {
      name: "Swag",
      role: "Designer",
      connect: "mailto:codcoderblip@gmail.com",
      img: "/melodias logo.svg",
    },
  ];
  return (
    <>
      <section className="text-white">
        <h1 className="font-bold text-white text-[24px] mb-4">Developers</h1>

        <main className="flex gap-x-4  overflow-x-auto hide-scrollbar gap-3 overflow-y-hidden  py-4">
          {role.map((item, index) => (
            <article
              key={index}
              className="flex  shrink-0 w-[300px] items-center gap-3 ">
              <Image
                src={item.img}
                alt={item.name}
                width={200}
                height={200}
                className="rounded-full"
              />
              <div>
                <h1 className="font-bold text-xl t">{item.name}</h1>
                <p className="text-xs mt-2">{item.role}</p>
                <a
                  href={item.connect}
                  className="inline-block mt-2 text-sm py-1 px-2 bg-green-400 text-white rounded-lg hover:bg-green-500 transition">
                  Connect
                </a>
              </div>
            </article>
          ))}
        </main>
      </section>
    </>
  );
}

export default Developers;
