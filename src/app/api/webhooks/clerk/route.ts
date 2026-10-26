import { verifyWebhook } from "@clerk/nextjs/webhooks";
import type { NextRequest } from "next/server";
import { upsertProfile } from "@/lib/profile";

// Clerk Dashboard → Webhooks → endpoint /api/webhooks/clerk, événements user.created / user.updated.
// Nécessite CLERK_WEBHOOK_SIGNING_SECRET dans .env.local.
export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);
    if (evt.type === "user.created" || evt.type === "user.updated") {
      const u = evt.data;
      const email =
        u.email_addresses.find((e) => e.id === u.primary_email_address_id)?.email_address ??
        u.email_addresses[0]?.email_address;
      await upsertProfile({ clerkUserId: u.id, firstName: u.first_name, lastName: u.last_name, email });
    }
    return new Response("ok");
  } catch (err) {
    console.error("[webhook clerk]", err);
    return new Response("Webhook invalide", { status: 400 });
  }
}
