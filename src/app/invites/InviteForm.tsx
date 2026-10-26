"use client";

import { useState, useTransition, type FormEvent } from "react";
import { createInvite, type CreateInviteResult } from "./actions";

const input =
  "mt-1 w-full rounded-xl border border-noe-line bg-white px-3 py-2.5 text-sm text-noe-navy outline-none focus:border-noe-gold focus:ring-2 focus:ring-noe-gold/30";

export function InviteForm() {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Extract<CreateInviteResult, { ok: true }> | null>(null);
  const [copied, setCopied] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setResult(null);
    const fd = new FormData(e.currentTarget);
    start(async () => {
      const res = await createInvite(fd);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setResult(res);
      (e.target as HTMLFormElement).reset();
      // restore defaults
      const emailCb = document.getElementById("viaEmail") as HTMLInputElement | null;
      const waCb = document.getElementById("viaWhatsapp") as HTMLInputElement | null;
      if (emailCb) emailCb.checked = true;
      if (waCb) waCb.checked = true;
    });
  }

  async function copyLink() {
    if (!result?.link) return;
    await navigator.clipboard.writeText(result.link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-4">
      <form onSubmit={onSubmit} className="rounded-2xl border border-noe-line bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-noe-navy">Nouvelle invitation</h2>
        <p className="mt-1 text-sm text-noe-muted">
          La personne reçoit un lien vers la page d’inscription. Son compte restera à valider par un
          administrateur.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="block text-sm font-medium text-noe-navy sm:col-span-2">
            Email de la personne *
            <input name="email" type="email" required autoComplete="email" className={input} />
          </label>
          <label className="block text-sm font-medium text-noe-navy">
            Nom (optionnel)
            <input name="lastName" autoComplete="family-name" className={input} />
          </label>
          <label className="block text-sm font-medium text-noe-navy">
            Prénoms (optionnel)
            <input name="firstName" autoComplete="given-name" className={input} />
          </label>
        </div>
        <fieldset className="mt-4">
          <legend className="text-sm font-medium text-noe-navy">Envoyer via</legend>
          <div className="mt-2 flex flex-wrap gap-4 text-sm text-noe-navy">
            <label className="inline-flex items-center gap-2">
              <input id="viaEmail" name="viaEmail" type="checkbox" value="true" defaultChecked className="accent-noe-gold" />
              Email
            </label>
            <label className="inline-flex items-center gap-2">
              <input id="viaWhatsapp" name="viaWhatsapp" type="checkbox" value="true" defaultChecked className="accent-noe-gold" />
              WhatsApp
            </label>
          </div>
        </fieldset>
        {error && <p className="mt-3 rounded-lg bg-red-50 p-2 text-sm text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="mt-4 rounded-full bg-noe-gold px-5 py-2.5 text-sm font-medium text-noe-navy-deep transition hover:brightness-110 disabled:opacity-60"
        >
          {pending ? "Création…" : "Créer l’invitation"}
        </button>
      </form>

      {result && (
        <div className="rounded-2xl border border-noe-gold/40 bg-noe-gold-soft/40 p-6">
          <h3 className="font-semibold text-noe-navy">Invitation prête</h3>
          {result.emailSent && (
            <p className="mt-1 text-sm text-green-800">Email envoyé avec succès.</p>
          )}
          {result.emailNote && <p className="mt-1 text-sm text-noe-muted">{result.emailNote}</p>}
          <p className="mt-3 break-all rounded-xl bg-white px-3 py-2 font-mono text-xs text-noe-navy">
            {result.link}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={copyLink}
              className="rounded-full border border-noe-line bg-white px-4 py-2 text-sm font-medium text-noe-navy hover:bg-zinc-50"
            >
              {copied ? "Copié !" : "Copier le lien"}
            </button>
            {result.mailtoUrl && (
              <a
                href={result.mailtoUrl}
                className="rounded-full bg-noe-navy px-4 py-2 text-sm font-medium text-white hover:brightness-110"
              >
                Ouvrir l’email
              </a>
            )}
            {result.whatsappUrl && (
              <a
                href={result.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-[#25D366] px-4 py-2 text-sm font-medium text-white hover:brightness-110"
              >
                Ouvrir WhatsApp
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
