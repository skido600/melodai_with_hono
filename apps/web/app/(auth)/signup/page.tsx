"use client";

import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../../../lib/api";
import toast from "react-hot-toast";

export default function SignUp() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);

    const result = await login();
    console.log(result);
    if (result.success && result.url) {
      router.push(result.url);
    } else {
      console.log(result.error);
      toast.error(result.error as string);
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center text-center bg-black px-6">
      <section>
        <div className="text-white">
          <div className="flex justify-center mb-6">
            <Image
              src="/melodias logo.svg"
              width={200}
              height={200}
              alt="Melodia Logo"
              className="h-16 w-16 rounded-xl  p-2"
            />
          </div>

          <h1 className="text-2xl font-bold">Welcome to Melodia</h1>

          <p className="mt-2 text-xs text-gray-400">
            Continue with your Google account to start listening.
          </p>

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl border border-[#1f2937] bg-[#111827] py-2 text-xs text-white transition hover:bg-[#1f2937] disabled:opacity-50">
            <FcGoogle size={24} />
            {loading ? "Redirecting..." : "Continue with Google"}
          </button>
        </div>
      </section>
    </main>
  );
}
