"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Telescope } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Nieuws" },
  { href: "/stats", label: "Statistieken" },
  { href: "/about", label: "Over ons" },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <Telescope className="w-4.5 h-4.5 text-white" size={18} />
          </div>
          <div className="leading-tight">
            <span className="font-serif font-semibold text-ink text-[0.95rem] block leading-none">
              OnlyFacts
            </span>
            <span className="text-ink-muted text-[0.68rem] block">
              Nieuws zonder ruis
            </span>
          </div>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                pathname === link.href
                  ? "bg-accent-light text-accent"
                  : "text-ink-secondary hover:text-ink hover:bg-canvas-dark"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
