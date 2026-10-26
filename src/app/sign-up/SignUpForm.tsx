"use client";

import { useSignUp } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { syncProfileAfterSignUp } from "./actions";

const inputBase =
  "mt-1 w-full rounded-xl border border-noe-line bg-white px-3 py-2.5 text-sm text-noe-navy outline-none focus:border-noe-gold focus:ring-2 focus:ring-noe-gold/30";

function FieldErr({ msg }: { msg?: string | null }) {
  return msg ? <p className="mt-1 text-xs text-red-600">{msg}</p> : null;
}

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
      </svg>
    );
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  );
}

function PasswordField({
  name,
  label,
  show,
  onToggle,
  error,
}: {
  name: string;
  label: string;
  show: boolean;
  onToggle: () => void;
  error?: string | null;
}) {
  return (
    <label className="block text-sm font-medium text-noe-navy">
      {label}
      <span className="relative mt-1 block">
        <input
          name={name}
          type={show ? "text" : "password"}
          required
          minLength={8}
          autoComplete="new-password"
          className={`${inputBase} pr-11`}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-noe-muted transition hover:text-noe-navy"
          aria-label={show ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          aria-pressed={show}
        >
          <EyeIcon open={show} />
        </button>
      </span>
      <FieldErr msg={error} />
    </label>
  );
}

export function SignUpForm() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const router = useRouter();
  const [step, setStep] = useState<"form" | "verify">("form");
  const [localError, setLocalError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const busy = fetchStatus === "fetching";

  async function finish() {
    await signUp.finalize({
      navigate: async ({ session, decorateUrl }) => {
        if (session?.currentTask) return;
        try {
          await syncProfileAfterSignUp();
        } catch {
          // le profil sera synchronisé à l'arrivée sur /onboarding
        }
        const url = decorateUrl("/onboarding");
        if (url.startsWith("http")) window.location.href = url;
        else router.push(url);
      },
    });
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLocalError(null);
    const fd = new FormData(e.currentTarget);
    const password = String(fd.get("password") ?? "");
    if (password !== String(fd.get("confirm") ?? "")) {
      setLocalError("Les mots de passe ne correspondent pas.");
      return;
    }
    const { error } = await signUp.password({
      lastName: String(fd.get("lastName") ?? "").trim(),
      firstName: String(fd.get("firstName") ?? "").trim(),
      emailAddress: String(fd.get("email") ?? "").trim(),
      password,
      unsafeMetadata: { onboarding: "pending" },
    });
    if (error) return;

    if (signUp.status === "complete") return finish();
    if (signUp.unverifiedFields.includes("email_address")) {
      const res = await signUp.verifications.sendEmailCode();
      if (!res.error) setStep("verify");
    }
  }

  async function onVerify(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const code = String(new FormData(e.currentTarget).get("code") ?? "").trim();
    const { error } = await signUp.verifications.verifyEmailCode({ code });
    if (error) return;
    if (signUp.status === "complete") await finish();
    else setLocalError("Inscription incomplète. Réessayez ou contactez l’administration.");
  }

  const global = localError ?? errors.global?.[0]?.message ?? null;

  return (
    <div className="w-full max-w-md rounded-3xl border border-noe-line bg-white p-8 shadow-sm">
      <div className="text-center">
        <Image src="/logo-noe-work-bank.jpeg" alt="NOE Work Bank" width={72} height={72} className="mx-auto h-18 w-18 rounded-full" />
        <h1 className="mt-4 text-2xl font-semibold text-noe-navy">
          {step === "form" ? "Créer un compte" : "Vérifiez votre email"}
        </h1>
        <p className="mt-1 text-sm text-noe-muted">
          {step === "form"
            ? "Inscrivez-vous sur NOEWork Bank. Votre compte sera validé par un administrateur."
            : "Saisissez le code reçu par email."}
        </p>
      </div>

      {step === "form" ? (
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm font-medium text-noe-navy">
              Nom
              <input name="lastName" required autoComplete="family-name" className={inputBase} />
              <FieldErr msg={errors.fields.lastName?.message} />
            </label>
            <label className="block text-sm font-medium text-noe-navy">
              Prénoms
              <input name="firstName" required autoComplete="given-name" className={inputBase} />
              <FieldErr msg={errors.fields.firstName?.message} />
            </label>
          </div>
          <label className="block text-sm font-medium text-noe-navy">
            Email
            <input name="email" type="email" required autoComplete="email" className={inputBase} />
            <FieldErr msg={errors.fields.emailAddress?.message} />
          </label>
          <PasswordField
            name="password"
            label="Mot de passe"
            show={showPassword}
            onToggle={() => setShowPassword((v) => !v)}
            error={errors.fields.password?.message}
          />
          <PasswordField
            name="confirm"
            label="Confirmer le mot de passe"
            show={showConfirm}
            onToggle={() => setShowConfirm((v) => !v)}
          />
          <div id="clerk-captcha" />
          {global && <p className="rounded-lg bg-red-50 p-2 text-sm text-red-700">{global}</p>}
          <button disabled={busy} className="w-full rounded-full bg-noe-gold py-2.5 font-medium text-noe-navy-deep transition hover:brightness-110 disabled:opacity-60">
            {busy ? "Patientez…" : "S’inscrire"}
          </button>
          <p className="text-center text-sm text-noe-muted">
            Déjà inscrit ? <Link href="/sign-in" className="font-medium text-noe-blue hover:underline">Connexion</Link>
          </p>
        </form>
      ) : (
        <form onSubmit={onVerify} className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-noe-navy">
            Code de vérification
            <input name="code" inputMode="numeric" required autoComplete="one-time-code" className={`${inputBase} text-center tracking-[0.4em]`} />
            <FieldErr msg={errors.fields.code?.message} />
          </label>
          {global && <p className="rounded-lg bg-red-50 p-2 text-sm text-red-700">{global}</p>}
          <button disabled={busy} className="w-full rounded-full bg-noe-navy py-2.5 font-medium text-white disabled:opacity-60">
            {busy ? "Vérification…" : "Valider"}
          </button>
          <button type="button" onClick={() => signUp.verifications.sendEmailCode()} className="w-full text-sm text-noe-blue hover:underline">
            Renvoyer le code
          </button>
        </form>
      )}
    </div>
  );
}
