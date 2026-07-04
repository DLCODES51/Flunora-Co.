"use client";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { handleSmoothScroll } from "@/lib/smooth-scroll";
import { Ribbon, Sparkle } from "./Doodles";
import { usePublicCollections } from "@/hooks/use-site-data";

export function Collections() {
  const { data: collectionList = [] } = usePublicCollections();
  const collections = collectionList.map((collection, index) => ({
    id: collection.id,
    title: collection.name,
    copy: collection.description ?? "A curated collection from the studio.",
    image: collection.thumbnailUrl ?? collection.bannerUrl ?? "",
    bg: collection.accentColor ?? "var(--pink)",
    tag: String(index + 1).padStart(2, "0"),
    soon: collection.featured,
  }));

  return (
    <section id="collections" className="relative bg-cream py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="mb-14 flex flex-col items-start gap-4 md:items-center md:text-center">
          <span className="script text-2xl text-pink-deep">our little</span>
          <h2 className="display text-balance text-5xl font-bold leading-[0.95] md:text-7xl">
            Collections you'll
            <br />
            want to hug <Sparkle className="inline-block align-middle" color="#EC8DB1" size={36} />
          </h2>
        </div>

        <div className="flex flex-col gap-10">
          {collections.length ? collections.map((c, i) => {
            const reverse = i % 2 === 1;
            return (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className={`grid grid-cols-1 items-center gap-6 overflow-hidden rounded-[40px] p-6 md:grid-cols-2 md:p-10 ${
                  reverse ? "md:[&>div:first-child]:order-2" : ""
                }`}
                style={{
                  background: c.bg,
                  border: "1.5px solid #111",
                  boxShadow: "8px 8px 0 #111",
                }}
              >
                <div className="relative">
                  <div
                    className="relative aspect-[5/4] overflow-hidden rounded-[28px]"
                    style={{ border: "1.5px solid #111" }}
                  >
                    <img
                      src={c.image}
                      alt={c.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out hover:scale-105"
                    />
                  </div>
                  {c.soon && (
                    <div className="absolute -top-3 -right-3 rotate-6">
                      <Ribbon label="Coming Soon" color="#FFE89A" />
                    </div>
                  )}
                </div>

                <div className="px-2 md:px-6">
                  <span
                    className="inline-block rounded-full bg-cream px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-ink"
                    style={{ border: "1.5px solid #111" }}
                  >
                    {c.tag} · Collection
                  </span>
                  <h3 className="display mt-4 text-4xl font-bold leading-[1] md:text-6xl">
                    {c.title}
                  </h3>
                  <p className="mt-4 max-w-md text-base text-ink/80 md:text-lg">{c.copy}</p>
                  <motion.a
                    href="#shop"
                    onClick={handleSmoothScroll}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] text-white"
                    style={{ border: "1.5px solid #111", boxShadow: "4px 4px 0 #111" }}
                  >
                    Explore <ArrowUpRight className="h-4 w-4" />
                  </motion.a>
                </div>
              </motion.div>
            );
          }) : (
            <p className="text-center text-ink/60">Collections will appear here as soon as they’re published.</p>
          )}
        </div>
      </div>
    </section>
  );
}