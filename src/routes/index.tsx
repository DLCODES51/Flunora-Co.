import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { bindSmoothScrollAnchors } from "@/lib/smooth-scroll";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Products } from "@/components/Products";
import { Collections } from "@/components/Collections";
import { About } from "@/components/About";
import { Gallery } from "@/components/Gallery";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Loader } from "@/components/Loader";
import { CursorFollower } from "@/components/CursorFollower";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Flunora & Co. — Cute Handmade Crochet Creations" },
      {
        name: "description",
        content:
          "Adorable handmade crochet keychains, plushies, flowers and home decor from Flunora & Co. — made with love, one stitch at a time.",
      },
      { property: "og:title", content: "Flunora & Co. — Handmade Crochet" },
      {
        property: "og:description",
        content: "Cute, soft, hand-stitched keepsakes for the people you love.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  useEffect(() => bindSmoothScrollAnchors(), []);

  return (
    <>
      <Loader />
      <CursorFollower />
      <main className="bg-background text-foreground overflow-x-hidden">
        <Navbar />
        <Hero />
        <Products />
        <Collections />
        <About />
        <Gallery />
        <Contact />
        <Footer />
      </main>
    </>
  );
}
