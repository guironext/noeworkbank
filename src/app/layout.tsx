import type { Metadata } from "next";
import {
  ClerkProvider,
  Show,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NOEWork Bank — Formation & accompagnement entrepreneurial",
  description:
    "Plateforme NOE POLYTECHNIQUE / NOE ADN BIG 4 : intelligence financière, IA, foncière et immobilière en Côte d’Ivoire.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ClerkProvider>
          <header className="sticky top-0 z-40 border-b border-white/10 bg-noe-navy/95 text-white backdrop-blur-md">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
              <Link href="/" className="flex items-center gap-3">
                <Image
                  src="/logo-noe-work-bank.jpeg"
                  alt="NOE Work Bank"
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-full bg-white ring-1 ring-white/20"
                  priority
                />
                <div className="leading-tight">
                  <span className="block text-sm font-semibold tracking-tight">
                    NOEWork Bank
                  </span>
                  <span className="hidden text-[11px] text-white/65 sm:block">
                    NOE POLYTECHNIQUE · ADN BIG 4
                  </span>
                </div>
              </Link>
              <nav className="flex items-center gap-2 text-sm sm:gap-3">
                <Link
                  href="/#programmes"
                  className="hidden text-white/75 hover:text-white sm:inline"
                >
                  Programmes
                </Link>
                <Link
                  href="/#packs"
                  className="hidden text-white/75 hover:text-white sm:inline"
                >
                  Packs
                </Link>
                <Link
                  href="/dashboard"
                  className="text-white/75 hover:text-white"
                >
                  Espace
                </Link>
                <Suspense
                  fallback={
                    <span
                      className="inline-block h-8 w-24 rounded-full bg-white/10"
                      aria-hidden
                    />
                  }
                >
                  <Show when="signed-out">
                    <SignInButton mode="modal" fallbackRedirectUrl="/dashboard" signUpFallbackRedirectUrl="/onboarding">
                      <button className="rounded-full bg-noe-gold px-3.5 py-1.5 font-medium text-noe-navy-deep transition hover:brightness-110">
                        Connexion
                      </button>
                    </SignInButton>
                  </Show>
                  <Show when="signed-in">
                    <UserButton />
                  </Show>
                </Suspense>
              </nav>
            </div>
          </header>
          <main className="flex-1">{children}</main>
        </ClerkProvider>
      </body>
    </html>
  );
}
