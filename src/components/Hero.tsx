"use client";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useEffect } from "react";
import { Sparkle, YarnBall, Cloud, HeartDoodle, Ribbon, CurvedArrow } from "./Doodles";
import { handleSmoothScroll } from "@/lib/smooth-scroll";
import keychain from "@/assets/product-keychain.jpg";
import whale from "@/assets/product-whale.jpg";
import turtle from "@/assets/product-turtle.jpg";
import flowers from "@/assets/product-flowers.jpg";
import tulip from "@/assets/product-tulip.jpg";

export function Hero() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      mx.set(x);
      my.set(y);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  const tx1 = useTransform(sx, (v) => v * 18);
  const ty1 = useTransform(sy, (v) => v * 18);
  const tx2 = useTransform(sx, (v) => v * -22);
  const ty2 = useTransform(sy, (v) => v * -14);

  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden pt-28 md:pt-32"
      style={{
        background:
          "radial-gradient(60% 50% at 50% 25%, #FFE89A 0%, transparent 60%), radial-gradient(60% 60% at 80% 70%, #DDF4FF 0%, transparent 60%), radial-gradient(60% 60% at 15% 80%, #FFD7BF 0%, transparent 60%), #FFFDFC",
      }}
    >
      {/* Sparkles */}
      <div className="pointer-events-none absolute inset-0">
        {Array.from({ length: 18 }).map((_, i) => (
          <Sparkle
            key={i}
            className="absolute animate-sparkle"
            color={["#111", "#EC8DB1", "#F5B3CB"][i % 3]}
            size={10 + (i % 4) * 4}
            style={{
              top: `${(i * 53) % 95}%`,
              left: `${(i * 37) % 95}%`,
              animationDelay: `${(i % 6) * 0.4}s`,
            }}
          />
        ))}
      </div>

      {/* Clouds */}
      <Cloud className="pointer-events-none absolute left-[6%] top-[14%] animate-float opacity-80" size={110} />
      <Cloud className="pointer-events-none absolute right-[8%] top-[22%] animate-float opacity-70" size={80} style={{ animationDelay: "1.5s" }} />

      {/* Floating crochet pieces peeking from edges */}
      <motion.div
        style={{ x: tx1, y: ty1 }}
        className="pointer-events-none absolute -left-10 top-[28%] hidden md:block"
      >
        <div className="animate-float" style={{ animationDelay: "0.4s" }}>
          <FloatingPlushie src={whale} rotate={-12} size={170} />
        </div>
      </motion.div>

      <motion.div
        style={{ x: tx2, y: ty2 }}
        className="pointer-events-none absolute -right-12 top-[20%] hidden md:block"
      >
        <div className="animate-float" style={{ animationDelay: "0.9s" }}>
          <FloatingPlushie src={flowers} rotate={10} size={190} />
        </div>
      </motion.div>

      <motion.div
        style={{ x: tx1, y: ty2 }}
        className="pointer-events-none absolute -left-8 bottom-[8%] hidden md:block"
      >
        <div className="animate-float" style={{ animationDelay: "1.3s" }}>
          <FloatingPlushie src={turtle} rotate={8} size={160} />
        </div>
      </motion.div>

      <motion.div
        style={{ x: tx2, y: ty1 }}
        className="pointer-events-none absolute -right-10 bottom-[10%] hidden md:block"
      >
        <div className="animate-float" style={{ animationDelay: "0.2s" }}>
          <FloatingPlushie src={tulip} rotate={-8} size={170} />
        </div>
      </motion.div>

      {/* Decorative ribbon tags */}
      <div className="pointer-events-none absolute left-[12%] top-[34%] hidden md:block animate-wiggle">
        <Ribbon label="Handmade" color="#F5B3CB" />
      </div>
      <div className="pointer-events-none absolute right-[14%] bottom-[24%] hidden md:block animate-wiggle" style={{ animationDelay: "1.2s" }}>
        <Ribbon label="Made with Love" color="#FFE89A" />
      </div>

      {/* yarn ball */}
      <YarnBall
        className="pointer-events-none absolute left-[8%] bottom-[28%] hidden lg:block"
        color="#DDF4FF"
        size={70}
      />
      <YarnBall
        className="pointer-events-none absolute right-[6%] top-[42%] hidden lg:block"
        color="#D9F4D7"
        size={56}
      />

      {/* Centered hero */}
      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 pb-28 pt-10 text-center md:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full bg-cream px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-ink"
          style={{ border: "1.5px solid #111", boxShadow: "3px 3px 0 #111" }}
        >
          <HeartDoodle size={14} /> New stitches every week
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="display text-balance text-[clamp(2.6rem,8vw,6.5rem)] font-bold leading-[0.95] text-ink"
        >
          <span className="script font-normal text-pink-deep text-[0.55em] align-middle mr-2">handmade</span>
          Crochet
          <br />
          Creations
          <span className="ml-2 inline-block align-middle">
            <YarnBall size={56} color="#F5B3CB" />
          </span>
          <br />
          <span className="text-ink/85">Made with Love,</span>{" "}
          <span className="script text-pink-deep font-normal text-[0.75em]">
            one stitch at a time.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-6 max-w-xl text-base text-ink/70 md:text-lg"
        >
          A tiny studio of soft cottons, slow afternoons, and little living things
          you can hold in your palm.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-4"
        >
          <BouncyButton href="#shop" variant="ink">
            Shop Collection <ArrowUpRight className="h-4 w-4" />
          </BouncyButton>
          <BouncyButton href="#collections" variant="pink">
            Explore <ArrowDown className="h-4 w-4" />
          </BouncyButton>

          {/* Keychain peek next to buttons */}
          <div className="hidden lg:block relative -ml-1 animate-wiggle">
            <img
              src={keychain}
              alt=""
              className="h-16 w-16 rounded-full object-cover"
              style={{ border: "1.5px solid #111", boxShadow: "3px 3px 0 #111" }}
            />
          </div>
        </motion.div>
      </div>

      {/* Marquee strip */}
      <div
        className="relative z-10 mt-4 overflow-hidden bg-ink py-3 text-cream"
        style={{ borderTop: "1.5px solid #111", borderBottom: "1.5px solid #111" }}
      >
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap pr-10">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex items-center gap-10 pr-10">
              {[
                "Made with love",
                "Hand stitched",
                "Cotton yarn",
                "Tiny batches",
                "Shipped from India",
                "New drops weekly",
              ].map((t, i) => (
                <span key={i} className="inline-flex items-center gap-4">
                  <span className="flex h-[1.125rem] w-[1.125rem] shrink-0 items-center justify-center">
                    <Sparkle color="#FFE89A" size={14} />
                  </span>
                  <span className="display text-lg leading-[1.125rem]">{t}</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FloatingPlushie({ src, rotate, size }: { src: string; rotate: number; size: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        transform: `rotate(${rotate}deg)`,
        border: "1.5px solid #111",
        boxShadow: "6px 6px 0 #111",
        borderRadius: "9999px",
        overflow: "hidden",
        background: "#fff",
      }}
    >
      <img src={src} alt="" className="h-full w-full object-cover" />
    </div>
  );
}

function BouncyButton({
  href,
  children,
  variant,
}: {
  href: string;
  children: React.ReactNode;
  variant: "ink" | "pink";
}) {
  const ink = variant === "ink";
  return (
    <motion.a
      href={href}
      onClick={handleSmoothScroll}
      whileHover={{ y: -3, scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 380, damping: 14 }}
      className={`inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold ${
        ink ? "bg-ink text-white" : "bg-pink text-ink"
      }`}
      style={{ border: "1.5px solid #111", boxShadow: "4px 4px 0 #111" }}
    >
      {children}
    </motion.a>
  );
}
