"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X } from "lucide-react";
import { Sparkle } from "./Doodles";
import { usePublicGallery } from "@/hooks/use-site-data";

export function Gallery() {
  const [open, setOpen] = useState<string | null>(null);
  const { data: galleryItems = [] } = usePublicGallery();
  const items = galleryItems.map((item) => ({
    id: item.id,
    src: item.url,
    span: item.span ?? "",
    bg: item.bgColor ?? "var(--butter)",
  }));

  return (
    <section id="gallery" className="relative bg-cream py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="mb-14 text-center">
          <span className="script text-2xl text-pink-deep">from the basket</span>
          <h2 className="display text-balance text-5xl font-bold leading-[0.95] md:text-7xl">
            Moments from the
            <br />
            studio <Sparkle className="inline-block align-middle" color="#EC8DB1" size={36} />
          </h2>
        </div>

        <div className="grid auto-rows-[150px] grid-cols-2 gap-4 md:auto-rows-[210px] md:grid-cols-4 md:gap-6">
          {items.length ? items.map((it, i) => (
            <motion.button
              key={it.id}
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.06 }}
              whileHover={{ y: -4, rotate: i % 2 === 0 ? -1.5 : 1.5 }}
              onClick={() => setOpen(it.src)}
              className={`group relative overflow-hidden rounded-[28px] ${it.span}`}
              style={{
                background: it.bg,
                border: "1.5px solid #111",
                boxShadow: "5px 5px 0 #111",
              }}
            >
              <img
                src={it.src}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[1000ms] ease-out group-hover:scale-110"
              />
            </motion.button>
          )) : (
            <p className="col-span-full text-center text-ink/60">Gallery images will appear here once they’re published.</p>
          )}
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/85 p-6 backdrop-blur"
          >
            <button
              onClick={() => setOpen(null)}
              className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-full bg-pink text-ink"
              style={{ border: "1.5px solid #111" }}
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.35 }}
              src={open}
              alt=""
              className="max-h-[85vh] max-w-[90vw] rounded-[28px] object-contain"
              style={{ border: "2px solid #111", boxShadow: "10px 10px 0 #F5B3CB" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
