import santoriniImg from "@/assets/santorini.png";
import redeemedImg from "@/assets/redeemed.jpg";
import oHolyNightImg from "@/assets/o-holy-night.jpg";
import shatteredImg from "@/assets/shattered1.png";

export interface ProductSize {
  size: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  sizes: ProductSize[];
}

export const products: Product[] = [
  {
    id: "santorini",
    name: "Santorini",
    slug: "santorini",
    description: "Cobalt, azure, and mirrored glass reflect the Mediterranean's brilliant blues and coastal beauty. Inspired by Santorini's Three Bells church, this cross will bring light and life to any room. Custom engraving available.",
    image: santoriniImg,
    sizes: [
      { size: '24"', price: 350 },
      { size: '18"', price: 275 },
      { size: '14"', price: 200 },
    ],
  },
  {
    id: "the-redeemed",
    name: "The Redeemed",
    slug: "the-redeemed",
    description: "Frosted, iridescent, mirrored, and shattered tempered glass float against a luminous white sanded background, a testament to the joy and glory of redemption. Each carefully placed element reflects light, a radiant testament to transformation and the hope found in being reconciled to Jesus Christ.",
    image: redeemedImg,
    sizes: [
      { size: '24"', price: 375 },
      { size: '18"', price: 300 },
      { size: '14"', price: 200 },
    ],
  },
  {
    id: "o-holy-night",
    name: "O Holy Night",
    slug: "o-holy-night",
    description: "Engraved wood preserves the sacred silence of the first Christmas night. The timeless silhouette depicts the Nativity—the Holy Family, shepherds, and magi—under a starlit Bethlehem sky. A reverent heirloom that celebrates the heart of the season, bringing enduring faith and polished grace to your home.",
    image: oHolyNightImg,
    sizes: [
      { size: '14"', price: 50 },
    ],
  },
  {
    id: "shattered-but-not-broken",
    name: "Shattered But Not Broken",
    slug: "shattered-but-not-broken",
    description: "Beautiful hand-placed shattered tempered glass illustrating how we may be shattered but never broken thanks to the love of the Lord.",
    image: shatteredImg,
    sizes: [
      { size: '14"', price: 200 },
    ],
  },
];

export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find(p => p.slug === slug);
};
