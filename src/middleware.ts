import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Public : landing, connexion, inscription, webhooks.
// Tout le reste exige une session ; les gardes de rôle/statut sont faites
// côté serveur (layouts) avec la base comme source de vérité.
const isAuthPage = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // Déjà connecté : pas de retour sur connexion/inscription → aiguillage
  // (/dashboard envoie les comptes PENDING vers /onboarding).
  if (isAuthPage(req)) {
    const { userId } = await auth();
    if (userId) return NextResponse.redirect(new URL("/dashboard", req.url));
  }
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
