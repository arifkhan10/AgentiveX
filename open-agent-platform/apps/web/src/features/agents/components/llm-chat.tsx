"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

/** ---------------- Types & options ---------------- */
type Provider = "openai" | "anthropic" | "google";

const PROVIDERS: { label: string; value: Provider }[] = [
  { label: "OpenAI", value: "openai" },
  { label: "Claude (Anthropic)", value: "anthropic" },
  { label: "Google Gemini", value: "google" },
];

const MODELS: Record<Provider, { label: string; value: string }[]> = {
  openai: [
    { label: "GPT-4o mini", value: "gpt-4o-mini" },
    { label: "GPT-4o", value: "gpt-4o" },
    { label: "o4-mini", value: "o4-mini" },
  ],
  anthropic: [
    { label: "Claude 3.7 Sonnet", value: "claude-3-7-sonnet-latest" },
    { label: "Claude 3.5 Sonnet", value: "claude-3-5-sonnet-latest" },
  ],
  google: [
    { label: "Gemini 1.5 Pro", value: "gemini-1.5-pro" },
    { label: "Gemini 2.0 Flash", value: "gemini-2.0-flash" },
  ],
};

type Msg = { role: "user" | "assistant"; content: string };

/** ---------------- Component ---------------- */
export default function LlmChat() {
  const [provider, setProvider] = useState<Provider>("openai");
  const [model, setModel] = useState<string>(MODELS.openai[0].value);
  const [apiKey, setApiKey] = useState<string>("");
  const [remember, setRemember] = useState<boolean>(false);
  const [showApiKey, setShowApiKey] = useState<boolean>(false);

  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hi! Choose a provider, paste your API key, and ask me anything." },
  ]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    // load from sessionStorage if present
    const saved = sessionStorage.getItem("llm_tmp_cfg");
    if (saved) {
      try {
        const cfg = JSON.parse(saved);
        if (cfg.provider) setProvider(cfg.provider);
        if (cfg.model) setModel(cfg.model);
        if (cfg.apiKey) setApiKey(cfg.apiKey);
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (remember) {
      sessionStorage.setItem("llm_tmp_cfg", JSON.stringify({ provider, model, apiKey }));
    } else {
      sessionStorage.removeItem("llm_tmp_cfg");
    }
  }, [remember, provider, model, apiKey]);

  useEffect(() => {
    setModel(MODELS[provider][0].value);
  }, [provider]);

  const canSend = useMemo(
    () => apiKey.trim().length > 10 && input.trim().length > 0 && !loading,
    [apiKey, input, loading]
  );

  async function sendMessage() {
    const userMsg: Msg = { role: "user", content: input.trim() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      let reply = "";
      if (provider === "openai") {
        reply = await callOpenAI(apiKey, model, [...messages, userMsg]);
      } else if (provider === "anthropic") {
        reply = await callAnthropic(apiKey, model, [...messages, userMsg]);
      } else {
        reply = await callGemini(apiKey, model, [...messages, userMsg]);
      }
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch (err: any) {
      const msg =
        err?.message?.includes("CORS") || err?.message?.includes("blocked")
          ? "Request blocked by CORS. For OpenAI/Anthropic you may need a tiny proxy."
          : err?.message || "Something went wrong.";
      setMessages((m) => [...m, { role: "assistant", content: `⚠️ ${msg}` }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl p-4 space-y-4">
      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="md:col-span-1">
          <label className="text-sm font-medium">Provider</label>
          <select
            className="mt-1 w-full rounded-lg border p-2"
            value={provider}
            onChange={(e) => setProvider(e.target.value as Provider)}
          >
            {PROVIDERS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-1">
          <label className="text-sm font-medium">Model</label>
          <select
            className="mt-1 w-full rounded-lg border p-2"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          >
            {MODELS[provider].map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-medium">API Key</label>
          <div className="relative">
            <input
              className="mt-1 w-full rounded-lg border p-2 pr-10"
              type={showApiKey ? "text" : "password"}
              placeholder={
                provider === "openai"
                  ? "sk-..."
                  : provider === "anthropic"
                  ? "sk-ant-..."
                  : "AIza..."
              }
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowApiKey((prev) => !prev)}
              className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-800"
              aria-label={showApiKey ? "Hide API key" : "Show API key"}
              tabIndex={-1}
            >
              {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="mt-1 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              id="remember"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <label htmlFor="remember">Remember key for this tab (sessionStorage)</label>
          </div>
        </div>
      </div>

      {/* Chat window */}
      <div className="rounded-xl border p-3 h-[420px] overflow-auto bg-white">
        {messages.map((m, i) => (
          <div key={i} className={`mb-3 ${m.role === "user" ? "text-right" : "text-left"}`}>
            <div
              className={`inline-block rounded-2xl px-3 py-2 ${
                m.role === "user" ? "bg-gray-900 text-white" : "bg-gray-100"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
      </div>

      {/* Composer */}
      <div className="flex gap-2">
        <textarea
          ref={textareaRef}
          className="flex-1 rounded-lg border p-2 h-20"
          placeholder="Type your message…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className={`px-4 py-2 rounded-lg text-white ${canSend ? "bg-black" : "bg-gray-400"}`}
          disabled={!canSend}
          onClick={sendMessage}
        >
          {loading ? "Sending…" : "Send"}
        </button>
      </div>

      {/* <p className="text-xs text-gray-500">
        Frontend-only demo. Keys are held in memory (or sessionStorage if you tick remember). For production,
        use a server proxy.
      </p> */}
    </div>
  );
}

/** ---------------- Provider callers ---------------- */

async function callOpenAI(
  apiKey: string,
  model: string,
  messages: Msg[]
): Promise<string> {
  // Browser note: OpenAI may block cross-origin calls depending on environment.
  // If so, route via a tiny proxy later.
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    const t = await safeText(res);
    throw new Error(`OpenAI error: ${res.status} ${t}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

async function callAnthropic(
  apiKey: string,
  model: string,
  messages: Msg[]
): Promise<string> {
  // Anthropic API requires headers and a specific message format.
  // CORS can block direct browser requests. Use a proxy if needed.
  const sys = (messages as any).findLast?.(
    (m: Msg) => m.role === "assistant" && m.content.startsWith("system:")
  )
    ? (messages as any).findLast((m: Msg) => m.role === "assistant")!.content.replace(/^system:\s*/, "")
    : undefined;

  const userTurns = messages
    .filter((m) => m.role !== "assistant" || !m.content.startsWith("system:"))
    .map((m) => (m.role === "user" ? { role: "user", content: m.content } : { role: "assistant", content: m.content }));

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      system: sys,
      messages: userTurns.map((m) =>
        m.role === "user"
          ? { role: "user", content: [{ type: "text", text: m.content }] }
          : { role: "assistant", content: m.content }
      ),
      max_tokens: 1024,
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    const t = await safeText(res);
    throw new Error(`Anthropic error: ${res.status} ${t}`);
  }
  const data = await res.json();
  const text = data?.content?.[0]?.text ?? "";
  return text;
}

async function callGemini(
  apiKey: string,
  model: string,
  messages: Msg[]
): Promise<string> {
  // Gemini's REST works from browser with key in query string.
  // We convert chat history into a single prompt for simplicity.
  const history = messages
    .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
    .join("\n");

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    model
  )}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: history + `\nUser: ${messages.at(-1)?.content || ""}` }] }],
      generationConfig: { temperature: 0.7 },
    }),
  });

  if (!res.ok) {
    const t = await safeText(res);
    throw new Error(`Gemini error: ${res.status} ${t}`);
  }
  const data = await res.json();
  const text =
    data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join("") ??
    data?.candidates?.[0]?.content?.parts?.[0]?.text ??
    "";
  return text;
}

/** Utility */
async function safeText(res: Response) {
  try {
    return await res.text();
  } catch {
    return "";
  }
}
