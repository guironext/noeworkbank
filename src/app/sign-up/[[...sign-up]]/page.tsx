import { Suspense } from "react";
import { SignUpForm } from "../SignUpForm";

export default function SignUpPage() {
  return (
    <div className="flex justify-center px-4 py-16">
      <Suspense fallback={<p className="text-sm text-zinc-500">Chargement…</p>}>
        <SignUpForm />
      </Suspense>
    </div>
  );
}
