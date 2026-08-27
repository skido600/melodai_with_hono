"use client";

import { useMyApiKeys } from "@/hooks/useMyApiKeys";
import { useDeleteApiKey } from "@/hooks/useDeleteApiKey";
import { Copy, KeyRound, Check, ShieldCheck, Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function DeveloperPage() {
  const { data: keys = [], isLoading, isError } = useMyApiKeys();
  const deleteMutation = useDeleteApiKey();

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [deleteKey, setDeleteKey] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const copyKey = async (id: string, apiKey: string) => {
    try {
      await navigator.clipboard.writeText(apiKey);

      setCopiedId(id);

      setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    } catch {
      toast.error("Could not copy API key");
    }
  };

  const handleDelete = () => {
    if (!deleteKey) return;

    deleteMutation.mutate(deleteKey.id, {
      onSuccess: () => {
        toast.success("API key deleted");
        setDeleteKey(null);
      },

      onError: (error) => {
        toast.error(
          error instanceof Error ? error.message : "Could not delete API key",
        );
      },
    });
  };

  if (isLoading) {
    return (
      <section className="mt-8 animate-pulse">
        <div className="h-8 w-48 rounded bg-white/10" />

        <div className="mt-3 h-4 w-96 max-w-full rounded bg-white/10" />

        <div className="mt-8 space-y-4">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="h-32 rounded-2xl border border-white/10 bg-white/3"
            />
          ))}
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
        <p className="text-sm text-red-400">Failed to load your API keys.</p>
      </section>
    );
  }

  return (
    <>
      <section className="mt-8 max-w-4xl text-white">
        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5">
              <KeyRound size={20} />
            </div>

            <h1 className="text-3xl font-semibold tracking-tight">API Keys</h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-white/45">
              Create and manage API keys for applications that connect to the
              Melodia developer API.
            </p>
          </div>
        </div>

        {/* Security notice */}
        <div className="mt-8 flex gap-4 rounded-2xl border border-white/10 bg-white/3 p-5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-400">
            <ShieldCheck size={18} />
          </div>

          <div>
            <h2 className="text-sm font-medium">Keep your API keys private</h2>

            <p className="mt-1 text-xs leading-5 text-white/40">
              API keys give applications access to the Melodia API. Never expose
              them in client-side code or public repositories.
            </p>
          </div>
        </div>

        {/* Keys */}
        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-medium text-white/80">Your API keys</h2>

            <span className="text-xs text-white/30">
              {keys.length} {keys.length === 1 ? "key" : "keys"}
            </span>
          </div>

          {/* Empty */}
          {keys.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-white/2 px-6 py-14 text-center">
              <KeyRound size={28} className="mx-auto text-white/20" />

              <h3 className="mt-4 text-sm font-medium">No API keys yet</h3>

              <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-white/35">
                Create an API key to start building applications with the
                Melodia API.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {keys.map((key) => (
                <div
                  key={key.id}
                  className="group rounded-2xl border border-white/10 bg-white/3 p-5 transition hover:border-white/20 hover:bg-white/4.5">
                  <div className="flex flex-col gap-5">
                    {/* Top */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-black/20">
                          <KeyRound size={17} className="text-white/60" />
                        </div>

                        <div>
                          <h3 className="text-sm font-medium">{key.name}</h3>

                          <p className="mt-1 text-xs text-white/30">
                            Created{" "}
                            {new Date(key.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] ${
                          key.active
                            ? "bg-emerald-400/10 text-emerald-400"
                            : "bg-red-400/10 text-red-400"
                        }`}>
                        {key.active ? "Active" : "Revoked"}
                      </span>
                    </div>

                    {/* Key */}
                    <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/30 p-3">
                      <code className="min-w-0 flex-1 truncate text-xs text-white/55">
                        {key.apiKey}
                      </code>

                      <button
                        type="button"
                        onClick={() => copyKey(key.id, key.apiKey)}
                        className="flex shrink-0 items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-white/60 transition hover:bg-white/10 hover:text-white">
                        {copiedId === key.id ? (
                          <>
                            <Check size={14} />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy size={14} />
                            Copy
                          </>
                        )}
                      </button>
                    </div>

                    {/* Bottom */}
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-3 text-xs text-white/30">
                        <span>
                          Last used:{" "}
                          {key.lastUsedAt
                            ? new Date(key.lastUsedAt).toLocaleDateString()
                            : "Never"}
                        </span>

                        <span>•</span>

                        <span>{key.active ? "Ready to use" : "Disabled"}</span>
                      </div>

                      {/* Delete */}
                      <button
                        type="button"
                        disabled={deleteMutation.isPending}
                        onClick={() =>
                          setDeleteKey({
                            id: key.id,
                            name: key.name,
                          })
                        }
                        className="flex items-center gap-2 rounded-lg border border-red-500/10 px-3 py-2 text-xs text-red-400/70 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50">
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Delete confirmation modal */}
      {deleteKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#151515] p-6 shadow-2xl">
            {/* Icon */}
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
              <Trash2 size={20} />
            </div>

            {/* Content */}
            <h2 className="mt-5 text-lg font-semibold text-white">
              Delete API key?
            </h2>

            <p className="mt-2 text-sm leading-6 text-white/45">
              Are you sure you want to delete{" "}
              <span className="font-medium text-white/80">
                "{deleteKey.name}"
              </span>
              ? This key will immediately stop working and cannot be recovered.
            </p>

            {/* Actions */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={deleteMutation.isPending}
                onClick={() => setDeleteKey(null)}
                className="rounded-lg border border-white/10 px-4 py-2.5 text-sm text-white/60 transition hover:bg-white/5 hover:text-white disabled:opacity-50">
                Cancel
              </button>

              <button
                type="button"
                disabled={deleteMutation.isPending}
                onClick={handleDelete}
                className="rounded-lg bg-red-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50">
                {deleteMutation.isPending ? "Deleting..." : "Delete key"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
