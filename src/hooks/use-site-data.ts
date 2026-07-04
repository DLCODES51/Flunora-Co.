"use client";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getPublicProducts } from "@/functions/products";
import { getPublicCollections, getPublicGallery } from "@/functions/catalog";
import { getPublicCms, getPublicSettings } from "@/functions/content";
import { categoryBg, type Product, type Category } from "@/data/products";

export function usePublicProducts() {
  const fn = useServerFn(getPublicProducts);
  return useQuery({
    queryKey: ["public-products"],
    queryFn: async () => {
      const data = await fn();
      return Array.isArray(data) ? data.map(mapDbProduct) : [];
    },
    staleTime: 60_000,
  });
}

export function usePublicCms() {
  const fn = useServerFn(getPublicCms);
  return useQuery({
    queryKey: ["public-cms"],
    queryFn: () => fn(),
    staleTime: 60_000,
  });
}

export function usePublicSettings() {
  const fn = useServerFn(getPublicSettings);
  return useQuery({
    queryKey: ["public-settings"],
    queryFn: () => fn(),
    staleTime: 60_000,
  });
}

export function usePublicCollections() {
  const fn = useServerFn(getPublicCollections);
  return useQuery({
    queryKey: ["public-collections"],
    queryFn: () => fn(),
    staleTime: 60_000,
  });
}

export function usePublicGallery() {
  const fn = useServerFn(getPublicGallery);
  return useQuery({
    queryKey: ["public-gallery"],
    queryFn: () => fn(),
    staleTime: 60_000,
  });
}

export function getCmsSection<T extends Record<string, unknown>>(
  cms: { key: string; content: Record<string, unknown> }[] | null | undefined,
  key: string,
  fallback: T,
): T {
  const found = cms?.find((c) => c.key === key)?.content as T | undefined;
  return found ? { ...fallback, ...found } : fallback;
}

function mapDbProduct(p: {
  id: string;
  name: string;
  price: number;
  description: string | null;
  shortDescription: string | null;
  thumbnailUrl: string | null;
  meeshoUrl: string | null;
  featured: boolean | null;
  badge: "new" | "bestseller" | "limited_edition" | "coming_soon" | null;
  stockStatus: "in_stock" | "out_of_stock" | "low_stock" | null;
  category: { name: string } | null;
  images: { url: string; isThumbnail: boolean }[];
}): Product {
  const categoryName = (p.category?.name ?? "Keychains") as Category;
  const isComingSoon = p.badge === "coming_soon";
  const image =
    p.thumbnailUrl ??
    p.images.find((i) => i.isThumbnail)?.url ??
    p.images[0]?.url ??
    "";

  return {
    id: p.id,
    name: p.name,
    price: p.price,
    description: p.shortDescription ?? p.description ?? "",
    image,
    category: isComingSoon ? "Seasonal" : normalizeCategory(categoryName),
    meeshoUrl: p.meeshoUrl ?? "https://www.meesho.com",
    featured: p.featured ?? false,
    badge: p.badge ?? null,
    stockStatus: p.stockStatus ?? "in_stock",
  };
}

function normalizeCategory(name: string): Product["category"] {
  const map: Record<string, Product["category"]> = {
    Keychains: "Keychains",
    "Crochet Keychains": "Keychains",
    Plushies: "Plushies",
    "Crochet Plushies": "Plushies",
    Flowers: "Flowers",
    "Crochet Flowers": "Flowers",
    "Home Decor": "Home Decor",
    Seasonal: "Seasonal",
    "Gift Collection": "Seasonal",
    "Coming Soon": "Seasonal",
  };
  return map[name] ?? "Keychains";
}

export { categoryBg };
