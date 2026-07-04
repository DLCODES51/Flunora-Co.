import keychain from "@/assets/product-keychain.jpg";
import flowers from "@/assets/product-flowers.jpg";
import whale from "@/assets/product-whale.jpg";
import turtle from "@/assets/product-turtle.jpg";
import coaster from "@/assets/product-coaster.jpg";
import tulip from "@/assets/product-tulip.jpg";

export type Category =
  | "Keychains"
  | "Plushies"
  | "Flowers"
  | "Home Decor"
  | "Seasonal";

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: Category;
  meeshoUrl: string;
  featured?: boolean;
  badge?: "new" | "bestseller" | "limited_edition" | "coming_soon" | null;
  stockStatus?: "in_stock" | "out_of_stock" | "low_stock";
}

/** Pastel background per category for product/collection cards. */
export const categoryBg: Record<Category, string> = {
  Keychains: "var(--pink)",
  Plushies: "var(--sky)",
  Flowers: "var(--butter)",
  "Home Decor": "var(--mint)",
  Seasonal: "var(--peach)",
};

export const products: Product[] = [
  {
    id: "p1",
    name: "Petal Bear Keychain",
    price: 249,
    description: "A tiny pocket-friend stitched in blush cotton.",
    image: keychain,
    category: "Keychains",
    meeshoUrl: "https://www.meesho.com",
    featured: true,
  },
  {
    id: "p2",
    name: "Bloom Bouquet",
    price: 899,
    description: "A forever bouquet of soft pastel blossoms.",
    image: flowers,
    category: "Flowers",
    meeshoUrl: "https://www.meesho.com",
    featured: true,
  },
  {
    id: "p3",
    name: "Tide the Whale",
    price: 549,
    description: "A squishy little whale, hand-stitched with love.",
    image: whale,
    category: "Plushies",
    meeshoUrl: "https://www.meesho.com",
    featured: true,
  },
  {
    id: "p4",
    name: "Mossy the Turtle",
    price: 599,
    description: "A sage-green shell buddy for shelves and naps.",
    image: turtle,
    category: "Plushies",
    meeshoUrl: "https://www.meesho.com",
    featured: true,
  },
  {
    id: "p5",
    name: "Daisy Coaster Set",
    price: 449,
    description: "Four ivory daisies for the cosiest cups.",
    image: coaster,
    category: "Home Decor",
    meeshoUrl: "https://www.meesho.com",
  },
  {
    id: "p6",
    name: "Tulip Posy",
    price: 749,
    description: "A wrapped posy of crochet tulips — always sweet.",
    image: tulip,
    category: "Flowers",
    meeshoUrl: "https://www.meesho.com",
  },
];
