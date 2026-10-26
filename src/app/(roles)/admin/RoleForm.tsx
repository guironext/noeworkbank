import { ROLE_CODES, ROLE_LABELS } from "@/lib/roles";
import { suspendAccount, validateRegistration } from "./actions";

export function RoleForm({ profileId, current, submitLabel }: { profileId: string; current?: string | null; submitLabel: string }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <form action={validateRegistration} className="flex items-center gap-2">
        <input type="hidden" name="profileId" value={profileId} />
        <select
          name="role"
          defaultValue={current ?? "APPRENANT"}
          className="rounded-lg border border-noe-line bg-white px-2 py-1.5 text-sm"
        >
          {ROLE_CODES.map((c) => (
            <option key={c} value={c}>{ROLE_LABELS[c]}</option>
          ))}
        </select>
        <button className="rounded-lg bg-noe-navy px-3 py-1.5 text-sm font-medium text-white hover:bg-noe-blue">
          {submitLabel}
        </button>
      </form>
      <form action={suspendAccount}>
        <input type="hidden" name="profileId" value={profileId} />
        <button className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50">
          Refuser / suspendre
        </button>
      </form>
    </div>
  );
}
