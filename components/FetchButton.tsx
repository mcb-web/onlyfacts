"use client";

import { useState } from "react";
import { RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FetchButton() {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleFetch() {
    setState("loading");
    setMessage("Nieuws ophalen…");
    try {
      const res = await fetch("/api/fetch");
      const data = await res.json();
      if (!res.ok) {
        setState("error");
        setMessage(data.error ?? "Onbekende fout");
      } else {
        setState("done");
        setMessage(data.message ?? "Klaar");
        // Reload the page after a short delay to show new articles
        setTimeout(() => window.location.reload(), 1800);
      }
    } catch {
      setState("error");
      setMessage("Netwerkfout — probeer opnieuw");
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleFetch}
        disabled={state === "loading"}
        className={cn(
          "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
          state === "loading"
            ? "bg-canvas-dark text-ink-muted cursor-not-allowed"
            : "bg-accent text-white hover:bg-accent/90"
        )}
      >
        <RefreshCw
          size={14}
          className={state === "loading" ? "animate-spin" : ""}
        />
        {state === "loading" ? "Bezig…" : "Ververs nieuws"}
      </button>

      {message && state !== "idle" && (
        <span
          className={cn(
            "flex items-center gap-1.5 text-sm",
            state === "error" ? "text-sensation-high" : "text-ink-secondary"
          )}
        >
          {state === "done" && <CheckCircle size={14} className="text-sensation-low" />}
          {state === "error" && <AlertCircle size={14} />}
          {message}
        </span>
      )}
    </div>
  );
}
