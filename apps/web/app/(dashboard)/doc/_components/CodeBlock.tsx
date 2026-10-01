"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
export function CodeBlock({ children }: { children: string }) {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);

    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="relative mt-4 overflow-hidden rounded-xl border border-white/10 bg-[#0b0b0b]">
      <button
        onClick={copyCode}
        className="absolute right-3 top-3 rounded-md border border-white/10 p-2 text-white/50 hover:bg-white/10 hover:text-white">
        {copied ? <Check size={16} /> : <Copy size={16} />}
      </button>

      <pre className="overflow-x-auto p-5 pr-14 text-sm leading-7 text-white/70">
        <code>{children}</code>
      </pre>
    </div>
  );
}
