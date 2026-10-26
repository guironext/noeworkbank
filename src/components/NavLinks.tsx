"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/lib/roles";

export function NavLinks({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const root = items[0]?.href;
  return (
    <nav className="flex gap-1 overflow-x-auto px-2 pb-3 md:flex-col md:pb-6">
      {items.map((item) => {
        const active =
          item.href === root ? pathname === root : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm transition ${
              active
                ? "bg-noe-gold font-medium text-noe-navy-deep"
                : "text-white/75 hover:bg-white/10 hover:text-white"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
