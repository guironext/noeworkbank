import { SignIn } from "@clerk/nextjs";
import { Suspense } from "react";

export default function SignInPage() {
  return (
    <div className="flex justify-center px-4 py-16">
      <Suspense fallback={<p className="text-sm text-zinc-500">Chargement…</p>}>
        <SignIn fallbackRedirectUrl="/dashboard" signUpUrl="/sign-up" signUpFallbackRedirectUrl="/onboarding" />
      </Suspense>
    </div>
  );
}
