"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Home" },
  { href: "/dashboard/approvals", label: "Approvals" },
  { href: "/dashboard/agents", label: "Agents" },
  { href: "/dashboard/integrations", label: "Integrations" },
  { href: "/dashboard/briefings", label: "Briefings" },
  { href: "/dashboard/memory", label: "Memory" },
];

export function DashboardNav({
  user,
}: {
  user: { name?: string | null; image?: string | null };
}) {
  const pathname = usePathname();

  return (
    <header className="border-b border-surface bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="font-display text-lg text-foreground">
            Assist
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                    isActive
                      ? "bg-surface text-foreground font-medium"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {user.image && (
            <img
              src={user.image}
              alt=""
              className="w-7 h-7 rounded-full"
            />
          )}
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
