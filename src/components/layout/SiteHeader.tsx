"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/adopt", label: "Adopt" },
  { href: "/care-guides", label: "Care guides" },
  { href: "/stories", label: "Stories" },
  { href: "/get-involved", label: "Get involved" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-4 z-40 mx-auto w-full max-w-[1280px] px-4 sm:px-14">
      <div className="glass flex items-center justify-between rounded-full px-4 py-2.5 sm:px-6">
        <Link href="/" className="font-display text-xl font-bold text-ink">
          Save Any Pets
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm font-bold text-ink-2 transition-colors hover:bg-white/60 hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href="/favorites"
            aria-label="Favourites"
            className="flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-white/60"
          >
            <Heart className="h-5 w-5" strokeWidth={1.8} />
          </Link>
          <Button href="/get-involved#donate">Donate</Button>
        </div>

        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-white/60 lg:hidden"
        >
          {menuOpen ? (
            <X className="h-6 w-6" strokeWidth={1.8} />
          ) : (
            <Menu className="h-6 w-6" strokeWidth={1.8} />
          )}
        </button>
      </div>

      <div
        className={cn(
          "glass-strong mt-3 flex flex-col gap-1 rounded-[28px] p-4 lg:hidden",
          menuOpen ? "block" : "hidden",
        )}
      >
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            className="rounded-[14px] px-4 py-3 text-base font-bold text-ink-2 transition-colors hover:bg-white/60 hover:text-ink"
          >
            {link.label}
          </Link>
        ))}
        <div className="mt-2 flex items-center gap-2 border-t border-ink/10 pt-3">
          <Link
            href="/favorites"
            onClick={() => setMenuOpen(false)}
            className="flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-white/60"
            aria-label="Favourites"
          >
            <Heart className="h-5 w-5" strokeWidth={1.8} />
          </Link>
          <Button
            href="/get-involved#donate"
            onClick={() => setMenuOpen(false)}
            className="flex-1 justify-center"
          >
            Donate
          </Button>
        </div>
      </div>
    </header>
  );
}
