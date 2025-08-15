"use client";

import { useEffect, useState } from "react";

export default function AgentmanWidget() {
  const [error, setError] = useState<string>("");

  useEffect(() => {
    (async () => {
      const token =
        process.env.NEXT_PUBLIC_AGENTMAN_ACCESS_TOKEN ||
        process.env.NEXT_PUBLIC_AGENTMAN_TOKEN;

      if (!token) {
        setError("Missing NEXT_PUBLIC_AGENTMAN_ACCESS_TOKEN in .env.local (then rebuild).");
        return;
      }

      // 1) Try as browser ESM (bypass Next/Webpack)
      const esmCandidates = [
        "https://cdn.jsdelivr.net/npm/@agentman/chat-widget@5.2.0/+esm",
        "https://esm.sh/@agentman/chat-widget@5.2.0?bundle",
      ];

      let ChatWidget: any | undefined;
      for (const src of esmCandidates) {
        try {
        
          const mod: any = await import(/* webpackIgnore: true */ src);
          ChatWidget = mod?.ChatWidget ?? mod?.default;
          if (ChatWidget) break;
        } catch (e) {
          // continue
        }
      }

      // 2) If ESM failed, try a UMD-ish global
      if (!ChatWidget) {
        await new Promise<void>((resolve) => {
          const s = document.createElement("script");
          // guess common UMD filenames
          s.src =
            "https://unpkg.com/@agentman/chat-widget@5.2.0/dist/index.umd.js";
          s.async = true;
          s.onload = () => resolve();
          s.onerror = () => resolve(); // resolve anyway; we'll check globals
          document.head.appendChild(s);
        });

        const w: any = window as any;
        ChatWidget =
          w["@agentman/chat-widget"]?.ChatWidget ||
          w.Agentman?.ChatWidget ||
          w.ChatWidget;
      }

      if (!ChatWidget) {
        setError("Failed to load Agentman widget from all sources.");
        return;
      }

      // 3) Construct with the fewest possible options
      //    (SDKs sometimes blow up if unknown keys are passed)
      let widget: any;
      try {
        // Start with a floating bubble so it’s visible even if inline CSS conflicts
        widget = new ChatWidget({
          // MOST MINIMAL: just the token
          accessToken: token,   // new builds
          agentToken: token,    // older builds (kept for compatibility)
        });

        // If you prefer inline later, swap to:
        // widget = new ChatWidget({ accessToken: token, containerId: "agentman-inline-chat" });

      } catch (e: any) {
        setError(e?.message || String(e));
        return;
      }

      return () => {
        try { widget?.destroy?.(); } catch {}
      };
    })();
  }, []);

  return (
    <div className="w-full">
      {/* If you switch to inline later, add the container: */}
      {/* <div id="agentman-inline-chat" className="w-full h-[560px] rounded-xl border" /> */}
      {error && (
        <div className="mt-3 text-sm text-red-600 break-words">{error}</div>
      )}
    </div>
  );
}
