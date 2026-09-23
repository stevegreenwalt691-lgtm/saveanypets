"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PawPrint,
  ClipboardList,
  CalendarCheck,
  Heart,
  BookOpen,
  Users,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { signOut } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/pets", label: "Pets", icon: PawPrint },
  { href: "/admin/applications", label: "Applications", icon: ClipboardList },
  { href: "/admin/meet-greets", label: "Meet-and-greets", icon: CalendarCheck },
  { href: "/admin/stories", label: "Stories", icon: Heart },
  { href: "/admin/guides", label: "Guides", icon: BookOpen },
  { href: "/admin/people", label: "People", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

function isLinkActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="flex flex-1 flex-col gap-1" aria-label="Admin">
      {NAV_LINKS.map((link) => {
        const active = isLinkActive(pathname, link.href);
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-[14px] px-4 py-3 text-sm font-bold transition-colors",
              active ? "bg-ink text-white" : "text-ink-2 hover:bg-white/60 hover:text-ink",
            )}
          >
            <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.8} />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarFooter({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex flex-col gap-1 border-t border-ink/10 pt-3">
      <Link
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        onClick={onNavigate}
        className="flex items-center gap-3 rounded-[14px] px-4 py-3 text-sm font-bold text-ink-2 transition-colors hover:bg-white/60 hover:text-ink"
      >
        <ExternalLink className="h-[18px] w-[18px] shrink-0" strokeWidth={1.8} />
        View website
      </Link>
      <form action={signOut}>
        <button
          type="submit"
          className="flex w-full items-center gap-3 rounded-[14px] px-4 py-3 text-left text-sm font-bold text-ink-2 transition-colors hover:bg-white/60 hover:text-ink"
        >
          <LogOut className="h-[18px] w-[18px] shrink-0" strokeWidth={1.8} />
          Sign out
        </button>
      </form>
    </div>
  );
}

interface AdminSidebarProps {
  staffName: string;
}

export function AdminSidebar({ staffName }: AdminSidebarProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <aside className="glass sticky top-4 hidden h-[calc(100vh-2rem)] w-[240px] shrink-0 flex-col gap-4 rounded-[28px] p-4 lg:flex">
        <div className="px-2 pb-2">
          <p className="font-display text-xl font-bold text-ink">Save Any Pets</p>
          <p className="mt-1 truncate text-sm text-ink-3">{staffName}</p>
        </div>
        <NavLinks pathname={pathname} />
        <SidebarFooter />
      </aside>

      <div className="glass sticky top-4 z-40 mx-4 mt-4 flex items-center justify-between rounded-full px-4 py-2.5 lg:hidden">
        <div>
          <p className="font-display text-lg font-bold text-ink">Save Any Pets</p>
          <p className="text-xs text-ink-3">{staffName}</p>
        </div>
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-white/60"
        >
          {menuOpen ? <X className="h-6 w-6" strokeWidth={1.8} /> : <Menu className="h-6 w-6" strokeWidth={1.8} />}
        </button>
      </div>

      {menuOpen ? (
        <div className="glass-strong mx-4 mt-3 flex flex-col gap-4 rounded-[28px] p-4 lg:hidden">
          <NavLinks pathname={pathname} onNavigate={() => setMenuOpen(false)} />
          <SidebarFooter onNavigate={() => setMenuOpen(false)} />
        </div>
      ) : null}
    </>
  );
}
