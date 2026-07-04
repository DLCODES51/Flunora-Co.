"use client";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { Search, ArrowUpRight } from "lucide-react";
import { categoryBg, type Category } from "@/data/products";
import { usePublicProducts } from "@/hooks/use-site-data";
import { HeartDoodle, Sparkle } from "./Doodles";

const filters: ("All" | Category | "Featured")[] = [
  "All",
  "Featured",
  "Keychains",
  "Plushies",
  "Flowers",
  "Home Decor",
];

export function Products() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [query, setQuery] = useState("");
  const { data: productList = [] } = usePublicProducts();

  const visible = useMemo(() => {
    return productList.filter((p) => {
      if (filter === "Featured" && !p.featured) return false;
      if (filter !== "All" && filter !== "Featured" && p.category !== filter) return false;
      if (query && !p.name.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [filter, query, productList]);

  return (
    <section id="shop" className="relative bg-cream py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="flex flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
          <div className="relative">
            <span className="script text-2xl text-pink-deep">this week's</span>
            <h2 className="display text-balance text-5xl font-bold leading-[0.95] md:text-7xl">
              Sweet little
              <br />
              stitches <Sparkle className="inline-block align-middle ml-1" color="#EC8DB1" size={36} />
            </h2>
          </div>
          <div
            className="flex items-center gap-2 rounded-full bg-cream px-4 py-2.5"
            style={{ border: "1.5px solid #111", boxShadow: "3px 3px 0 #111" }}
          >
            <Search className="h-4 w-4 text-ink" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search keepsakes…"
              className="w-52 bg-transparent text-sm text-ink placeholder:text-ink/50 focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-2.5">
          {filters.map((f) => (
            <motion.button
              key={f}
              whileTap={{ scale: 0.94 }}
              onClick={() => setFilter(f)}
              className={`rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-[0.15em] transition-all ${
                filter === f ? "bg-ink text-white" : "bg-cream text-ink hover:bg-pink/40"
              }`}
              style={{
                border: "1.5px solid #111",
                boxShadow: filter === f ? "3px 3px 0 #FFE89A" : "3px 3px 0 #111",
              }}
            >
              {f}
            </motion.button>
          ))}
        </div>

        <div className="mt-14 grid grid-cols-1 items-stretch gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((p, i) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: Math.floor(i / 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
              className="group relative flex h-full flex-col overflow-hidden rounded-[32px]"
              style={{
                background: categoryBg[p.category],
                border: "1.5px solid #111",
                boxShadow: "6px 6px 0 #111",
              }}
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <span
                  className="absolute left-4 top-4 rounded-full bg-cream px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-ink"
                  style={{ border: "1.5px solid #111" }}
                >
                  {p.category}
                </span>
                {p.featured && (
                  <span
                    className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-ink px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-cream"
                    style={{ border: "1.5px solid #111" }}
                  >
                    <HeartDoodle size={10} color="#F5B3CB" /> Loved
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col gap-3 p-6">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="display text-2xl font-bold leading-tight text-ink">
                    {p.name}
                  </h3>
                  <span
                    className="shrink-0 rounded-full bg-cream px-3 py-1 display text-base font-bold text-ink"
                    style={{ border: "1.5px solid #111" }}
                  >
                    ₹{p.price}
                  </span>
                </div>
                <p className="text-sm text-ink/75">{p.description}</p>

                {p.badge === "coming_soon" ? (
                  <div className="mt-auto inline-flex items-center justify-center rounded-full bg-cream px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-ink"
                    style={{ border: "1.5px solid #111", boxShadow: "3px 3px 0 #111" }}>
                    Coming Soon
                  </div>
                ) : (
                  <motion.a
                    href={p.meeshoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    className="mt-auto inline-flex items-center justify-center gap-1.5 rounded-full bg-ink px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white"
                    style={{ border: "1.5px solid #111", boxShadow: "3px 3px 0 #111" }}
                  >
                    Buy on Meesho <ArrowUpRight className="h-3.5 w-3.5" />
                  </motion.a>
                )}
              </div>
            </motion.article>
          ))}
        </div>

        {visible.length === 0 && (
          <p className="mt-20 text-center text-ink/60">
            Nothing matches that search — try another stitch.
          </p>
        )}
      </div>
    </section>
  );
}
