"use client";
import { motion } from "framer-motion";
import hands from "@/assets/about-hands.jpg";
import yarn from "@/assets/about-yarn.jpg";
import { Ribbon, HeartDoodle, YarnBall } from "./Doodles";

export function About() {
  return (
    <section
      id="about"
      className="relative overflow-hidden py-24 md:py-32"
      style={{ background: "var(--mint)" }}
    >
      <YarnBall className="pointer-events-none absolute -left-10 top-10 opacity-70" size={120} color="#FFE89A" />
      <YarnBall className="pointer-events-none absolute -right-12 bottom-10 opacity-70" size={150} color="#F5B3CB" />

      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-20">
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, y: 30, rotate: -3 }}
              whileInView={{ opacity: 1, y: 0, rotate: -3 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="overflow-hidden rounded-[36px]"
              style={{ border: "1.5px solid #111", boxShadow: "8px 8px 0 #111" }}
            >
              <img
                src={hands}
                alt="Hands crocheting in soft afternoon light"
                loading="lazy"
                className="aspect-[4/5] w-full object-cover"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30, rotate: 6 }}
              whileInView={{ opacity: 1, y: 0, rotate: 6 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="absolute -bottom-8 -right-4 hidden w-1/2 overflow-hidden rounded-[28px] md:block"
              style={{ border: "1.5px solid #111", boxShadow: "6px 6px 0 #111" }}
            >
              <img
                src={yarn}
                alt="Flat lay of pastel yarn balls"
                loading="lazy"
                className="aspect-square w-full object-cover"
              />
            </motion.div>
            <div className="absolute -top-4 -left-2 rotate-[-8deg]">
              <Ribbon label="made with love" color="#F5B3CB" />
            </div>
          </div>

          <div>
            <span className="script text-2xl text-pink-deep">our story</span>
            <h2 className="display text-balance text-5xl font-bold leading-[0.95] md:text-6xl">
              A tiny studio that
              <br />
              believes in <span className="text-pink-deep">slow.</span>
            </h2>
            <p className="mt-6 text-lg text-ink/80 leading-relaxed">
              Flunora &amp; Co. began at a kitchen table, with a single ball of
              cream cotton and the quiet that asks to be filled. Every keychain,
              bouquet and tiny creature is still made the same way — one stitch,
              then the next, until something soft is born.
            </p>
            <p className="mt-4 text-base text-ink/70 leading-relaxed">
              No machines. No rush. Just hands, yarn, and a long love for the
              small things that make a room feel like home.
            </p>

            <dl className="mt-10 grid grid-cols-3 gap-4">
              {[
                { k: "100%", v: "Handmade" },
                { k: "120+", v: "Pieces stitched" },
                { k: "1", v: "Pair of hands" },
              ].map((s) => (
                <div
                  key={s.v}
                  className="rounded-3xl bg-cream p-5 text-center"
                  style={{ border: "1.5px solid #111", boxShadow: "4px 4px 0 #111" }}
                >
                  <dt className="display text-3xl font-bold text-ink">{s.k}</dt>
                  <dd className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/70">
                    {s.v}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 inline-flex items-center gap-2 text-sm text-ink/80">
              <HeartDoodle size={20} /> Stitched in small batches from India.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
