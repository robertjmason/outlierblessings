import santoriniImg from "@/assets/santorini.png";
import redeemedImg from "@/assets/redeemed.jpg";
import oHolyNightImg from "@/assets/o-holy-night.jpg";
import shatteredImg from "@/assets/shattered1.png";
import shatteredCedarSatinImg from "@/assets/shattered_not_broken_satin.webp";

import walkingFrontImg from "@/assets/walking_on_water-front.webp";
import walkingVar1Img from "@/assets/walking_on_water-variant1.webp";
import walkingBackImg from "@/assets/walking_on_water-back.webp";
import walkingCedarImg from "@/assets/walking_on_water-western_red_cedar.webp";
import walkingCedarBackImg from "@/assets/walking_on_water-western_red_cedar-back.webp";

import howGreatThouArtImg from "@/assets/how_great_thou_art.webp";
import mightierFrontImg from "@/assets/mightier_than_the_waves-satin.webp";
import deepWatersFrontImg from "@/assets/deep_waters-satin.webp";
import deepWatersBackImg from "@/assets/mightier_than_the_waves-back.webp";
import deepWatersVar1Img from "@/assets/deep_waters-satin-variant1.webp";

export interface ProductImageVariant {
  src: string;
  alt?: string;
  title?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  availability: string;
  images?: Array<string | ProductImageVariant>;
  useSlideshow?: boolean;
  verse?: string;
}

export const products: Product[] = [
  {
    id: "how-great-thou-art",
    name: "How Great Thou Art",
    slug: "how-great-thou-art",
    verse: "“I often think of the heavens your hands have made, and of the moon and stars you put in place.” Psalm 8:3",
    description: `Look up on a clear night and the math stops making sense. Billions of stars. Distances too large to hold in your head. Light you're seeing that left its source before you were born.

That's what this cross holds. The universe itself, swirled into resin, sitting quiet in your hands.

David wrote that looking up with nothing but his own eyes. No telescopes. No photos from space. Just the night sky doing what it's always done, reminding a person how small they are and how big God is, both at the same time.

That's the whole point of a piece like this. Not to make you feel insignificant. To make you feel amazed. Insignificant says you don't matter. Amazed says you get to look at something this vast and still be loved by the One who made it.

Every swirl in this resin is different. No two came out the same, same as no two nights of stars ever look exactly alike.

How great Thou art.`,
    image: howGreatThouArtImg,
    availability: 'Available in 20" and 14" sizes.',
  },
  {
    id: "mightier-than-the-waves",
    name: "Mightier than the Waves",
    slug: "mightier-than-the-waves",
    verse: '"Mightier than the thunder of the great waters, mightier than the breakers of the sea, the LORD on high is mighty." Psalm 93:4',
    description: `The ocean doesn't ask permission either. It rises, it crashes, it breaks against whatever's in its path. Anyone who's stood at the edge of a real storm knows that sound, water hitting rock like it means to win.

This cross holds that moment. Waves underneath, resin still moving. Glass shattered across the top, catching light the way sea spray does right before it falls.

The sea is loud. Relentless. It can look unstoppable from where you're standing. But the psalmist isn't impressed by it. He's seen something louder.

Like every cross I make, this one carries a mustard seed on the back, set just beneath the verse, a reminder that a little faith is enough to stand in any storm.

That's the whole message here. Your storm might be real. It might be crashing right now. But it's not the loudest thing in the room.

He is.`,
    image: mightierFrontImg,
    availability: 'Available in 20" and 14" sizes.',
  },
  {
    id: "deep-waters",
    name: "Deep Waters",
    slug: "deep-waters",
    verse: '"When you pass through the waters, I will be with you; and when you pass through the rivers, they will not sweep over you." Isaiah 43:2',
    description: `Some storms don't stay at the edges. They cover everything, top to bottom, until there's nowhere you can stand that isn't wet.

This cross is poured with ocean waves from end to end, deep blue at the top rolling down into the turquoise of the shore. That's what life felt like for me for a long time: deep water with no dry ground in sight.

But God never promised we'd go around the water. He promised we'd go through it, and that we wouldn't go alone.

"When you pass through the waters, I will be with you; and when you pass through the rivers, they will not sweep over you." Isaiah 43:2

Like every cross I make, this one carries a mustard seed on the back, set just beneath the verse, a reminder that even the smallest faith holds when the water is deep.

The waters may be deep. He is deeper still.`,
    image: deepWatersFrontImg,
    availability: 'Available in 20" and 14" sizes.',
    useSlideshow: true,
    images: [
      {
        src: deepWatersFrontImg,
        title: "Example 1",
        alt: "Deep Waters Cross - Example 1",
      },
      {
        src: deepWatersBackImg,
        title: "Example 1 (back)",
        alt: "Deep Waters Cross - Example 1 (back)",
      },
      {
        src: deepWatersVar1Img,
        title: "Example 2",
        alt: "Deep Waters Cross - Example 2",
      },
    ],
  },
  {
    id: "walking-on-water",
    name: "Walking on Water",
    slug: "walking-on-water",
    verse: "“He stilled the storm to a whisper; the waves of the sea were hushed.” Psalm 107:29",
    description: `Fix Your Eyes Above the Waves

Some storms don't ask permission. They just arrive.

This cross holds that moment, the water still moving, still unsettled, caught somewhere between chaos and calm. Look closely and you can see it: the pull of the current, the churn beneath the surface. That's not decoration. That's the storm.

Peter knew that feeling. He stepped out of the boat and walked on water, right up until he looked down. The moment his eyes dropped to the waves instead of staying fixed above them, he started to sink. Not because the storm got stronger. Because his focus did.

That's the whole lesson in one image. The waves don't have to disappear for you to stay standing. You just have to stop staring at them.

I know what it's like to be in water that won't sit still. To feel the pull trying to take you under while everything around you says drown. But the storm was never the thing that determined whether I made it through. Where I was looking was.

That's the promise. Not that the sea goes flat before you trust Him. That He is steady even when it doesn't.

Fix your eyes above the waves. Not on them. That's how you keep walking.`,
    image: walkingFrontImg,
    availability: 'Available in 20" and 14" sizes.',
    useSlideshow: true,
    images: [
      {
        src: walkingFrontImg,
        title: "Front-engraved",
        alt: "Walking on Water Cross - Front-engraved",
      },
      {
        src: walkingVar1Img,
        title: "Back-engraved",
        alt: "Walking on Water Cross - Back-engraved",
      },
      {
        src: walkingBackImg,
        title: "Back-engraved (back)",
        alt: "Walking on Water Cross - Back-engraved (back)",
      },
      {
        src: walkingCedarImg,
        title: "Western Red Cedar Backing",
        alt: "Walking on Water Cross - Western Red Cedar Backing",
      },
      {
        src: walkingCedarBackImg,
        title: "Western Red Cedar Backing (back)",
        alt: "Walking on Water Cross - Western Red Cedar Backing (back)",
      },
    ],
  },
  {
    id: "santorini",
    name: "Santorini",
    slug: "santorini",
    description: "Cobalt, azure, and mirrored glass reflect the Mediterranean's brilliant blues and coastal beauty. Inspired by Santorini's Three Bells church, this cross will bring light and life to any room. Custom engraving available.",
    image: santoriniImg,
    availability: 'Available in 20" and 14" sizes.',
  },
  {
    id: "the-redeemed",
    name: "The Redeemed",
    slug: "the-redeemed",
    description: "Frosted, iridescent, mirrored, and shattered tempered glass float against a luminous white background in a testament to the joy and glory of redemption. Each hand-placed element reflects light, a radiant reminder of the hope found in being reconciled to Jesus Christ.",
    image: redeemedImg,
    availability: 'Available in 20" and 14" sizes.',
  },
  {
    id: "shattered-but-not-broken",
    name: "Shattered But Not Broken",
    slug: "shattered-but-not-broken",
    description: "Beautiful hand-placed shattered tempered glass illustrates how we may be shattered, but never broken thanks to the love of the Lord.",
    image: shatteredImg,
    availability: 'Available in 20" and 14" sizes.',
    useSlideshow: true,
    images: [
      {
        src: shatteredImg,
        title: "Full shattered glass",
        alt: "Shattered But Not Broken Cross - Full shattered glass",
      },
      {
        src: shatteredCedarSatinImg,
        title: "Front engraving, Western Red Cedar backing",
        alt: "Shattered But Not Broken Cross - Front engraving, Western Red Cedar backing",
      },
    ],
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
