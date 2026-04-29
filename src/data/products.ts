import santoriniImg from "@/assets/santorini.png";
import redeemedImg from "@/assets/redeemed.jpg";
import oHolyNightImg from "@/assets/o-holy-night.jpg";
import shatteredImg from "@/assets/shattered1.png";

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  availability: string;
}

export const products: Product[] = [
  {
    id: "santorini",
    name: "Santorini",
    slug: "santorini",
    description: "Cobalt, azure, and mirrored glass reflect the Mediterranean's brilliant blues and coastal beauty. Inspired by Santorini's Three Bells church, this cross will bring light and life to any room. Custom engraving available.",
    image: santoriniImg,
    availability: 'Available in 24", 20", and 14" sizes.',
  },
  {
    id: "the-redeemed",
    name: "The Redeemed",
    slug: "the-redeemed",
    description: "Frosted, iridescent, mirrored, and shattered tempered glass float against a luminous white background in a testament to the joy and glory of redemption. Each hand-placed element reflects light, a radiant reminder of the hope found in being reconciled to Jesus Christ.",
    image: redeemedImg,
    availability: 'Available in 24", 20", and 14" sizes.',
  },
  {
    id: "shattered-but-not-broken",
    name: "Shattered But Not Broken",
    slug: "shattered-but-not-broken",
    description: "Beautiful hand-placed shattered tempered glass illustrates how we may be shattered, but never broken thanks to the love of the Lord.",
    image: shatteredImg,
    availability: 'Available in 24", 20", and 14" sizes.',
  },
  {
    id: "o-holy-night",
    name: "O Holy Night",
    slug: "o-holy-night",
    description: "Engraved wood preserves the sacred silence of the first Christmas night. The timeless silhouette depicts the Nativity: the Holy Family, shepherds, and magi under a starlit Bethlehem sky. A beautiful celebration of the true \"reason for the season.\"",
    image: oHolyNightImg,
    availability: 'Available in 14".',
  },
];

export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find(p => p.slug === slug);
};
