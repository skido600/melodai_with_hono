"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Copy, KeyRound } from "lucide-react";
import { useGenerateApiKey } from "@/hooks/useGenerateApiKey";

export default function ApiKeyGenerator() {
  const [name, setName] = useState("");
  const [generatedKey, setGeneratedKey] = useState("");

  const generateApiKey = useGenerateApiKey();

  const handleGenerate = () => {
    if (!name.trim()) {
      toast.error("Enter a name for your API key");
      return;
    }

    generateApiKey.mutate(name, {
      onSuccess: (data) => {
        setGeneratedKey(data.apiKey);
        toast.success("API key generated");
        setName("");
      },
      onError: (error) => {
        toast.error(
          error instanceof Error ? error.message : "Could not generate API key",
        );
      },
    });
  };

  const copyKey = async () => {
    if (!generatedKey) return;

    await navigator.clipboard.writeText(generatedKey);
    toast.success("API key copied");
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-white">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#83DAA1]/10 text-[#83DAA1]">
          <KeyRound size={20} />
        </div>

        <div>
          <h2 className="font-semibold">Create API Key</h2>
          <p className="text-sm text-white/40">
            Create a key for your application
          </p>
        </div>
      </div>

      <div className="mt-6">
        <label className="text-sm text-white/60">API key name</label>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. My React App"
          className="mt-2 w-full rounded-lg border border-white/10 bg-transparent px-4 py-3 outline-none placeholder:text-white/30 focus:border-[#83DAA1]"
        />
      </div>

      <button
        type="button"
        onClick={handleGenerate}
        disabled={generateApiKey.isPending}
        className="mt-4 rounded-lg bg-[#83DAA1] px-5 py-3 font-medium text-black transition hover:opacity-90 disabled:opacity-50">
        {generateApiKey.isPending ? "Generating..." : "Generate API Key"}
      </button>

      {generatedKey && (
        <div className="mt-6 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4">
          <p className="text-sm font-medium text-yellow-400">
            Save your API key
          </p>

          <p className="mt-1 text-xs text-white/40">
            You will only see the full key after generation.
          </p>

          <div className="mt-3 flex gap-2">
            <input
              readOnly
              value={generatedKey}
              className="min-w-0 flex-1 rounded-lg border border-white/10 bg-black/30 px-3 py-3 text-sm text-white/70 outline-none"
            />

            <button
              type="button"
              onClick={copyKey}
              className="flex shrink-0 items-center gap-2 rounded-lg border border-white/10 px-4 hover:bg-white/10">
              <Copy size={16} />
              Copy
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
