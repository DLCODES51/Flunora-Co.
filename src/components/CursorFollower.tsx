"use client";
import { motion, useMotionValue, useSpring, useTransform, useVelocity } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Soft cursor dot with lag, hover scale, and subtle velocity stretch.
 * Hidden on touch / coarse-pointer devices.
 */
export function CursorFollower() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const spring = { damping: 28, stiffness: 320, mass: 0.45 };
  const x = useSpring(cursorX, spring);
  const y = useSpring(cursorY, spring);

  const vx = useVelocity(x);
  const vy = useVelocity(y);

  const stretchX = useTransform([vx, vy], ([latestVx, latestVy]) => {
    const speed = Math.hypot(latestVx as number, latestVy as number);
    return 1 + Math.min(speed * 0.0025, 0.35);
  });
  const stretchY = useTransform([vx, vy], ([latestVx, latestVy]) => {
    const speed = Math.hypot(latestVx as number, latestVy as number);
    return 1 - Math.min(speed * 0.0012, 0.18);
  });
  const rotate = useTransform([vx, vy], ([latestVx, latestVy]) =>
    Math.atan2(latestVy as number, latestVx as number) * (180 / Math.PI),
  );

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    if (!mq.matches) return;

    setEnabled(true);

    const onMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      setHovering(
        !!target?.closest("a, button, [role='button'], input, textarea, select, label"),
      );
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
    };
  }, [cursorX, cursorY]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[300] hidden md:block"
      style={{ x, y }}
    >
      <motion.div
        animate={{ scale: hovering ? 1.75 : 1 }}
        transition={{ type: "spring", stiffness: 420, damping: 22, mass: 0.35 }}
      >
        <motion.div
          className="rounded-full border border-ink/15 bg-pink/55 backdrop-blur-[1px]"
          style={{
            width: 12,
            height: 12,
            marginLeft: -6,
            marginTop: -6,
            rotate,
            scaleX: stretchX,
            scaleY: stretchY,
          }}
        />
      </motion.div>
    </motion.div>
  );
}
