"use client";

import { useState } from "react";

export function CopyLinkButton({ link }: { link: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="rounded-full border border-noe-line px-3 py-1.5 text-xs font-medium text-noe-navy hover:bg-zinc-50"
    >
      {copied ? "Copié !" : "Copier le lien"}
    </button>
  );
}
