import React from "react";
import { ValueProp } from "@/types";
import { Tv, Target, BellOff, Smartphone, RefreshCw, Award } from "lucide-react";


export const valueProps: ValueProp[] = [
  {
    icon: React.createElement(Tv, { "aria-hidden": true, className: "mx-auto", size: 28, strokeWidth: 1.5 }),
    title: "Extensive Catalogue",
    description:
      "A curated library of blockbusters and classics across every genre: endless choices for every mood.",
  },
  {
  icon: React.createElement(Target, { "aria-hidden": true, className: "mx-auto", size: 28, strokeWidth: 1.5 }),
    title: "Personalized Recommendations",
    description: "Tailored suggestions powered by intelligent algorithms that adapt to your viewing preferences.",
  },
  {
  icon: React.createElement(BellOff, { "aria-hidden": true, className: "mx-auto", size: 28, strokeWidth: 1.5 }),
    title: "Ad-Free Experience",
    description: "Seamless, uninterrupted playback with a premium, ad-free viewing experience.",
  },
  {
  icon: React.createElement(Smartphone, { "aria-hidden": true, className: "mx-auto", size: 28, strokeWidth: 1.5 }),
    title: "Multi-Device Access",
    description: "Stream in high quality on TVs, phones, tablets, and desktops. Pick up where you left off on any device.",
  },
  {
  icon: React.createElement(RefreshCw, { "aria-hidden": true, className: "mx-auto", size: 28, strokeWidth: 1.5 }),
    title: "Flexible Plans",
    description: "Flexible subscription options. Cancel or modify anytime with transparent pricing and no hidden fees.",
  },
  {
  icon: React.createElement(Award, { "aria-hidden": true, className: "mx-auto", size: 28, strokeWidth: 1.5 }),
    title: "Premium Quality",
    description: "Experience crystal-clear 4K streaming with HDR support and immersive Dolby Atmos sound on compatible devices.",
  },
];