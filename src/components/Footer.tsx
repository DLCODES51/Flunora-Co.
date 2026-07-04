"use client";
import { Instagram, Mail, MessageCircle, ArrowUp } from "lucide-react";
import { HeartDoodle } from "./Doodles";
import { handleSmoothScroll, scrollToTop } from "@/lib/smooth-scroll";

export function Footer() {
  const scrollTop = () => {
    scrollToTop();
  };
  return (
    <footer
      className="relative mx-3 mb-3 mt-6 overflow-hidden rounded-[40px] md:mx-6 md:mb-6"
      style={{
        background: "var(--pink)",
        border: "1.5px solid #111",
        boxShadow: "6px 6px 0 #111",
      }}
    >
      <div className="px-7 py-14 md:px-12 md:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="flex items-center gap-2 leading-none">
              <span className="script text-5xl text-ink">Flunora</span>
              <span className="display text-3xl font-bold text-ink">&amp; Co.</span>
            </p>
            <p className="mt-5 max-w-sm text-base text-ink/80">
              Handmade crochet, stitched slowly with cotton and care.
            </p>
            <p className="mt-3 inline-flex items-center gap-2 text-sm text-ink/70">
              <HeartDoodle size={16} color="#FFFDFC" /> Made in India
            </p>
          </div>

          <div>
            <p className="display text-xs font-bold uppercase tracking-[0.22em] text-ink">
              Explore
            </p>
            <ul className="mt-5 space-y-3 text-base font-semibold">
              {["Shop", "Collections", "About", "Gallery", "Contact"].map((l) => (
                <li key={l}>
                  <a
                    href={`#${l.toLowerCase()}`}
                    onClick={handleSmoothScroll}
                    className="text-ink/85 transition hover:text-ink hover:underline"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="display text-xs font-bold uppercase tracking-[0.22em] text-ink">
              Find us
            </p>
            <div className="mt-5 flex items-center gap-3">
              {[
                { href: "https://instagram.com/co.flunora", icon: Instagram, label: "Instagram" },
                { href: "mailto:flunora.co@gmail.com", icon: Mail, label: "Email" },
                { href: "https://wa.me/918200217521", icon: MessageCircle, label: "WhatsApp" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-cream text-ink transition hover:-translate-y-0.5"
                  style={{ border: "1.5px solid #111", boxShadow: "3px 3px 0 #111" }}
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>

            <button
              onClick={scrollTop}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-cream px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-ink"
              style={{ border: "1.5px solid #111", boxShadow: "3px 3px 0 #111" }}
            >
              <ArrowUp className="h-3.5 w-3.5" /> Back to top
            </button>
          </div>
        </div>

        <div
          className="mt-12 flex flex-col items-center justify-between gap-3 pt-6 text-xs font-semibold text-ink/80 md:flex-row"
          style={{ borderTop: "1.5px dashed #111" }}
        >
          <p>© {new Date().getFullYear()} Flunora &amp; Co. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#contact" onClick={handleSmoothScroll} className="hover:underline">
              Privacy Policy
            </a>
            <a href="#contact" onClick={handleSmoothScroll} className="hover:underline">
              Terms &amp; Conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}