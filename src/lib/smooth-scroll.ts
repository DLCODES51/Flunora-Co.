import type { MouseEvent } from "react";

const DEFAULT_DURATION = 900;

let activeScrollFrame: number | null = null;

function getScrollOffset() {
  if (typeof window === "undefined") return 96;
  const padding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop);
  return Number.isFinite(padding) ? padding : 96;
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** Premium eased scroll — more reliable than native smooth scroll alone. */
export function smoothScrollTo(targetY: number, duration = DEFAULT_DURATION) {
  if (typeof window === "undefined") return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) {
    window.scrollTo(0, targetY);
    return;
  }

  const startY = window.scrollY;
  const distance = targetY - startY;
  if (Math.abs(distance) < 1) return;

  const startTime = performance.now();

  if (activeScrollFrame !== null) {
    cancelAnimationFrame(activeScrollFrame);
    activeScrollFrame = null;
  }

  function step(currentTime: number) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    window.scrollTo(0, startY + distance * easeInOutCubic(progress));
    if (progress < 1) {
      activeScrollFrame = requestAnimationFrame(step);
    } else {
      activeScrollFrame = null;
    }
  }

  activeScrollFrame = requestAnimationFrame(step);
}

/** Smooth-scroll to an in-page section (hash anchor). */
export function scrollToSection(hash: string) {
  if (typeof window === "undefined" || !hash.startsWith("#") || hash === "#") return;
  const target = document.querySelector(hash);
  if (!target) return;

  const offset = getScrollOffset();
  const targetY = window.scrollY + target.getBoundingClientRect().top - offset;
  smoothScrollTo(Math.max(0, targetY));
  window.history.pushState(null, "", hash);
}

/** Smooth-scroll back to the top of the page. */
export function scrollToTop(duration = DEFAULT_DURATION) {
  smoothScrollTo(0, duration);
}

/** Attach to `<a href="#section">` clicks for reliable smooth scrolling. */
export function handleSmoothScroll(e: MouseEvent<HTMLAnchorElement>) {
  const href = e.currentTarget.getAttribute("href");
  if (!href?.startsWith("#") || href === "#") return;
  e.preventDefault();
  scrollToSection(href);
}

/** Capture internal anchor clicks anywhere on the page. */
export function bindSmoothScrollAnchors() {
  if (typeof window === "undefined") return () => {};

  const onClick = (event: globalThis.MouseEvent) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const anchor = target.closest('a[href^="#"]');
    if (!(anchor instanceof HTMLAnchorElement)) return;

    const href = anchor.getAttribute("href");
    if (!href || href === "#") return;

    event.preventDefault();
    scrollToSection(href);
  };

  document.addEventListener("click", onClick);
  return () => document.removeEventListener("click", onClick);
}
