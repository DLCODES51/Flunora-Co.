"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { YarnBall } from "./Doodles";

const CIRCLE_R = 80;
const CIRCUMFERENCE = 2 * Math.PI * CIRCLE_R;
const BALL_SIZE = 36;
const CONTAINER_PX = 176;
const SCALE = CONTAINER_PX / 200;
const ORBIT_R = CIRCLE_R * SCALE;

/**
 * Custom Flunora loader: a yarn ball rolls around a stitched circle
 * drawing the thread; on completion it fades into the page.
 */
export function Loader({ duration = 2200 }: { duration?: number }) {
  const [visible, setVisible] = useState(true);
  const animDuration = useMemo(() => (duration - 500) / 1000, [duration]);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(t);
  }, [duration]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-cream"
        >
          <div className="relative flex flex-col items-center gap-6">
            <div className="relative h-44 w-44">
              {/* Stitched dashed circle + progress thread */}
              <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full -rotate-90">
                <circle
                  cx="100"
                  cy="100"
                  r={CIRCLE_R}
                  fill="none"
                  stroke="#111"
                  strokeWidth="2"
                  strokeDasharray="6 6"
                  opacity="0.25"
                />
                <motion.circle
                  cx="100"
                  cy="100"
                  r={CIRCLE_R}
                  fill="none"
                  stroke="#F5B3CB"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={CIRCUMFERENCE}
                  initial={{ strokeDashoffset: CIRCUMFERENCE }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{ duration: animDuration, ease: "linear" }}
                />
              </svg>

              {/* Orbit arm — ball locked to the leading edge of the progress arc */}
              <motion.div
                className="absolute left-1/2 top-1/2 h-0 w-0"
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{
                  duration: animDuration,
                  ease: "linear",
                }}
              >
                <motion.div
                  className="absolute"
                  style={{
                    width: BALL_SIZE,
                    height: BALL_SIZE,
                    left: -BALL_SIZE / 2,
                    top: -ORBIT_R - BALL_SIZE / 2,
                  }}
                  initial={{ rotate: 0 }}
                  animate={{ rotate: -360 }}
                  transition={{
                    duration: animDuration,
                    ease: "linear",
                  }}
                >
                  <YarnBall size={BALL_SIZE} animated={false} />
                </motion.div>
              </motion.div>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="script text-3xl text-ink"
            >
              Flunora<span className="text-pink-deep">.</span>
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 0.5 }}
              className="display text-xs uppercase tracking-[0.4em] text-ink/60"
            >
              Stitching things up…
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
