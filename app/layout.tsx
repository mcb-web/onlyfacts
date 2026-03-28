import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: "OnlyFacts",
  description:
    "Objectief Nederlands nieuws: feiten uit meerdere bronnen gedestilleerd, bias transparant gemaakt.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl">
      <body>
        <Navigation />
        <main className="min-h-screen">{children}</main>
        <footer className="border-t border-border mt-16 py-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
            <p className="text-sm text-ink-muted">
              OnlyFacts · Nieuws zonder ruis ·{" "}
              <span className="italic">
                Feiten eerst, perspectief altijd transparant
              </span>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
