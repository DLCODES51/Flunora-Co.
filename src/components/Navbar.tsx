"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Instagram, ArrowUpRight } from "lucide-react";
import { handleSmoothScroll } from "@/lib/smooth-scroll";

const links = [
  { href: "#home", label: "Home" },
  { href: "#shop", label: "Shop" },
  { href: "#collections", label: "Collections" },
  { href: "#about", label: "About" },
  { href: "#gallery", label: "Gallery" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-3 z-50 px-3 md:top-5 md:px-6"
      >
        <nav
          className={`mx-auto flex max-w-6xl items-center justify-between rounded-full px-3 py-2 md:px-5 md:py-2.5 transition-all ${
            scrolled ? "bg-pink/95 backdrop-blur-md" : "bg-pink/90 backdrop-blur"
          }`}
          style={{ border: "1.5px solid #111", boxShadow: "4px 4px 0 #111" }}
        >
          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-cream"
            style={{ border: "1.5px solid #111" }}
          >
            <Menu className="h-5 w-5 text-ink" />
          </button>

          <a href="#home" onClick={handleSmoothScroll} className="flex items-center gap-1 leading-none">
            <span className="script text-3xl md:text-4xl text-ink">Flunora</span>
            <span className="display text-2xl md:text-3xl font-bold text-ink">&amp; Co.</span>
          </a>

          <a
            href="#shop"
            onClick={handleSmoothScroll}
            className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
            style={{ border: "1.5px solid #111", boxShadow: "3px 3px 0 #FFE89A" }}
          >
            Shop now <ArrowUpRight className="h-4 w-4" />
          </a>
          <a
            href="https://instagram.com/co.flunora"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="md:hidden flex h-11 w-11 items-center justify-center rounded-full bg-cream"
            style={{ border: "1.5px solid #111" }}
          >
            <Instagram className="h-5 w-5 text-ink" />
          </a>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[60] bg-ink/30 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 32 }}
              className="fixed left-0 top-0 z-[70] flex h-full w-[88%] max-w-md flex-col bg-cream p-7 md:p-10"
              style={{
                borderRight: "1.5px solid #111",
                borderRadius: "0 32px 32px 0",
              }}
            >
              <div className="flex items-center justify-between">
                <span className="script text-3xl text-ink">Flunora.</span>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-pink"
                  style={{ border: "1.5px solid #111" }}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <ul className="mt-10 flex flex-col gap-2">
                {links.map((l, i) => (
                  <motion.li
                    key={l.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + i * 0.05 }}
                  >
                    <a
                      href={l.href}
                      onClick={(e) => {
                        handleSmoothScroll(e);
                        setOpen(false);
                      }}
                      className="display group flex items-center justify-between rounded-2xl px-4 py-4 text-3xl font-semibold text-ink transition-colors hover:bg-pink/40"
                    >
                      <span>{l.label}</span>
                      <ArrowUpRight className="h-6 w-6 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1" />
                    </a>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-auto flex items-center gap-3 pt-8">
                <a
                  href="https://instagram.com/co.flunora"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-butter px-5 py-2.5 text-sm font-semibold text-ink"
                  style={{ border: "1.5px solid #111", boxShadow: "3px 3px 0 #111" }}
                >
                  <Instagram className="h-4 w-4" />
                  @co.flunora
                </a>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
