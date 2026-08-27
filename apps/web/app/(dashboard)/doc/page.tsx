"use client";

import ApiKeyGenerator from "@/components/ApiKeyGenerator";
import DeveloperPage from "@/components/DeveloperPage";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
function CodeBlock({ children }: { children: string }) {
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

export default function DocPage() {
  return (
    <main className=" py-12 text-white ">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <header className="border-b border-white/10 pb-10">
          <p className="mb-3 text-sm font-medium text-[#83DAA1]">
            MELODIA DEVELOPER API
          </p>

          <h1 className="text-xl font-bold tracking-tight sm:text-5xl">
            Build with Melodia
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-8 text-white/50">
            Use the Melodia API to build your own music applications. Developers
            can generate an API key and access Melodia music through a simple
            REST API.
          </p>
        </header>
        {/* Authentication */}
        <section className="mt-16">
          <h2 className="text-xl font-bold">Authentication</h2>

          <p className="mt-3 leading-7 text-sm text-white/50">
            The developer Music API is protected using an API key. After
            generating a key from your Melodia account, send it with every Music
            API request using the{" "}
            <code className="rounded bg-white/10 px-2 py-1 text-[#83DAA1]">
              x-api-key
            </code>{" "}
            header.
          </p>

          <CodeBlock>{`x-api-key: your_api_key_here`}</CodeBlock>

          <div className="mt-5 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-5">
            <h3 className="font-semibold text-yellow-400">
              Keep your API key private
            </h3>

            <p className="mt-2 text-sm leading-6 text-white/50">
              Never expose your API key in frontend code, public repositories,
              or other places where users can access it. Store it in an
              environment variable on your server.
            </p>
          </div>
        </section>
        {/* Generate API Key */}
        <section className="mt-16">
          <h2 className="mt-4 text-xl font-bold">Generate an API Key</h2>

          <p className="mt-3 text-sm mb-4 leading-7 text-white/50">
            Generate a unique API key for your application. The API key is
            returned when it is created, so make sure you save it securely.
          </p>

          <ApiKeyGenerator />
          <DeveloperPage />
        </section>

        {/* Music API */}
        <section className="mt-16">
          <div className="flex items-center gap-3">
            <span className="rounded-md bg-blue-500/10 px-2 py-1 text-xs font-bold text-blue-400">
              GET
            </span>

            <code className="text-sm">/api/v1/music</code>
          </div>

          <h2 className="mt-4 text-2xl font-bold">Music API</h2>

          <p className="mt-3 leading-7 text-white/50">
            Fetch music from Melodia for your own application. This endpoint
            requires a valid API key.
          </p>

          <div className="mt-6 rounded-xl border border-[#83DAA1]/20 bg-[#83DAA1]/5 p-5">
            <p className="font-medium text-[#83DAA1]">
              Maximum: 20 songs per request
            </p>

            <p className="mt-2 text-sm text-white/50">
              The developer API currently provides up to 20 songs in a single
              request.
            </p>
          </div>

          <h3 className="mt-8 font-semibold">Request</h3>

          <CodeBlock>{`
Headers:
x-api-key: your_api_key_here`}</CodeBlock>

          <h3 className="mt-8 font-semibold">cURL</h3>

          <CodeBlock>{` ${API_URL}/api/v1/music 
  "x-api-key: your_api_key_here"`}</CodeBlock>

          <h3 className="mt-8 font-semibold">Example response</h3>

          <CodeBlock>{`{
  "success": true,
  "message": "Music fetched successfully",
  "count": 20,
  "data": [
    {
      "id": 1,
      "title": "HEAVEN",
      "artist": "EMINEM",
      "year": 2024,
      "album": "HEAVEN - (Single)",
      "duration": 172.251,
      "audioUrl": null,
      "year": 2024,
      "audioUrl": "https://...",
      "coverUrl": "https://...",
    
    }
  ]
}`}</CodeBlock>
        </section>
        {/* Response fields */}
        {/* JavaScript */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold">JavaScript Example</h2>

          <p className="mt-3 text-white/50">
            Example of fetching Melodia music from a backend application.
          </p>

          <CodeBlock>{`const response = await fetch(
  "${API_URL}/api/v1/music",
  {
    headers: {
      "x-api-key": process.env.MELODIA_API_KEY,
    },
  }
);

const result = await response.json();

console.log(result.data);`}</CodeBlock>
        </section>
        {/* Errors */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold">API Errors</h2>

          <p className="mt-3 text-white/50">
            If a request fails, the API returns a consistent error format.
          </p>

          <CodeBlock>{`{
  "success": false,
  "message": "API key is required",
  "data": null
}`}</CodeBlock>

          <div className="mt-6 space-y-3">
            <div className="rounded-lg border border-white/10 p-4">
              <span className="font-mono text-yellow-400">401</span>
              <span className="ml-4 text-white/60">
                API key is missing or invalid.
              </span>
            </div>

            <div className="rounded-lg border border-white/10 p-4">
              <span className="font-mono text-red-400">500</span>
              <span className="ml-4 text-white/60">
                Something went wrong on the server.
              </span>
            </div>
          </div>
        </section>
        {/* Footer */}
        <footer className="mt-20 border-t border-white/10 py-10 text-center">
          <p className="text-sm text-white/30">Melodia Developer API</p>

          <p className="mt-2 text-xs text-white/20">
            Build something great with Melodia.
          </p>
        </footer>
      </div>
    </main>
  );
}
