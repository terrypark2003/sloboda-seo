"use client";

import { useState } from "react";

export default function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      setTimeout(() => setDone(false), 1400);
    } catch {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch {}
      document.body.removeChild(ta);
      setDone(true);
      setTimeout(() => setDone(false), 1400);
    }
  };
  return (
    <button onClick={onClick} className={`btn ${done ? "btn-primary" : "btn-outline"}`}>
      {done ? "복사됨" : "복사"}
    </button>
  );
}
