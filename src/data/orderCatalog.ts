import oHolyNightImg from "@/assets/o-holy-night.jpg";
import angelsWeHaveHeardOnHighImg from "@/assets/angels_we_have_heard_on_high.webp";
import oLittleTownOfBethlehemImg from "@/assets/o_little_town_of_bethlehem.webp";
import walkingCedarImg from "@/assets/walking_on_water-western_red_cedar.webp";
import deepWatersFrontImg from "@/assets/deep_waters-satin.webp";
import shatteredCedarSatinImg from "@/assets/shattered_not_broken_satin.webp";
import shatteredImg from "@/assets/shattered1.png";
import mightierFrontImg from "@/assets/mightier_than_the_waves-satin.webp";

export const CEDAR_CROSS_OPTIONS = [
  { id: "o-holy-night", name: "O Holy Night", preview: oHolyNightImg },
  { id: "angels-we-have-heard", name: "Angels We Have Heard on High", preview: angelsWeHaveHeardOnHighImg },
  { id: "o-little-town", name: "O Little Town of Bethlehem", preview: oLittleTownOfBethlehemImg },
  { id: "o-come-emmanuel", name: "O Come, O Come, Emmanuel" },
  { id: "silent-night", name: "Silent Night" },
] as const;

export const CEDAR_SIZES = [
  { label: '10"', price: 50 },
  { label: '14"', price: 75 },
] as const;

export const RESIN_CROSS_OPTIONS = [
  { id: "resin-wave", name: "Resin Wave on Top", preview: walkingCedarImg, prices: { '14"': 150, '20"': 225 } },
  { id: "full-resin", name: "Full Resin", preview: deepWatersFrontImg, prices: { '14"': 175, '20"': 250 } },
  { id: "shattered-top-bottom", name: "Shattered Glass Top & Bottom, verse on front", preview: shatteredCedarSatinImg, prices: { '14"': 250, '20"': 325 } },
  { id: "full-shattered", name: "Full Shattered Glass", preview: shatteredImg, prices: { '14"': 275, '20"': 350 } },
  { id: "full-resin-shattered", name: "Full Resin & Shattered Glass", preview: mightierFrontImg, prices: { '14"': 325, '20"': 400 } },
] as const;

export const SALES_TAX_RATE = 0.0775;
