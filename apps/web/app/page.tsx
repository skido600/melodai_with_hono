import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <main className="min-h-screen bg-black">
      <section className="flex min-h-screen w-[80%] flex-col items-center justify-center md:w-[32%] lg:w-[20%] mx-auto">
        <div className="text-white">
          <div className="flex justify-center mb-6">
            <Image
              src="/melodias logo.svg"
              width={200}
              height={200}
              alt="Melodia Logo"
              className="h-16 w-16 rounded-xl bg-[#061417] p-2"
            />
          </div>
          <div className="mt-8 text-center text-white">
            <h1 className="text-3xl font-bold">Welcome to Melodias</h1>

            <p className="mt-3 text-sm leading-6 text-gray-400">
              Discover, listen and enjoy your favorite music. Find new sounds,
              create your collection, and let the music match your mood.
            </p>
          </div>
          {/* Get Started */}
          <div className="mt-8 w-full">
            <Link
              href="/signup"
              className="block w-full rounded-full bg-green-600 py-3 text-center font-medium text-white transition hover:bg-green-500">
              Get started
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
