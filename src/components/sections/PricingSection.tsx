import React from "react";
import Button from "../ui/Button";

interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
}

const pricingTiers: PricingTier[] = [
  {
    name: "Basic",
    price: "$9.99",
    period: "/month",
    description: "Perfect for casual viewers",
    features: [
      "HD streaming quality",
      "Watch on 1 device",
      "Unlimited movies & shows",
      "Cancel anytime",
      "Ad-free experience",
    ],
  },
  {
    name: "Standard",
    price: "$14.99",
    period: "/month",
    description: "Great for sharing",
    features: [
      "Full HD streaming quality",
      "Watch on 2 devices simultaneously",
      "Unlimited movies & shows",
      "Cancel anytime",
      "Ad-free experience",
      "Download on 2 devices",
    ],
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "Premium",
    price: "$19.99",
    period: "/month",
    description: "The ultimate experience",
    features: [
      "4K + HDR streaming quality",
      "Watch on 4 devices simultaneously",
      "Unlimited movies & shows",
      "Cancel anytime",
      "Ad-free experience",
      "Download on 4 devices",
      "Dolby Atmos sound",
    ],
  },
];

export default function PricingSection() {
  return (
    <div className="container mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-12 md:mb-16">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 gradient-text">
          Choose Your Plan
        </h2>
        <p className="text-muted max-w-xs sm:max-w-2xl mx-auto text-sm sm:text-base md:text-lg px-4">
          Stream unlimited movies and shows. Cancel anytime. No hidden fees.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
        {pricingTiers.map((tier) => (
          <div
            key={tier.name}
            className={`relative rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:scale-105 ${
              tier.highlighted
                ? "bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border-2 border-primary shadow-xl shadow-primary/20"
                : "bg-white/5 border border-white/10 hover:border-white/20"
            }`}
          >
            {/* Badge */}
            {tier.badge && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-white text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full shadow-lg">
                  {tier.badge}
                </span>
              </div>
            )}

            {/* Plan Name */}
            <div className="text-center mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                {tier.name}
              </h3>
              <p className="text-muted text-xs sm:text-sm">{tier.description}</p>
            </div>

            {/* Price */}
            <div className="text-center mb-6 sm:mb-8">
              <div className="flex items-baseline justify-center">
                <span className="text-4xl sm:text-5xl font-bold text-white">
                  {tier.price}
                </span>
                <span className="text-muted ml-2 text-sm sm:text-base">
                  {tier.period}
                </span>
              </div>
            </div>

            {/* Features */}
            <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              {tier.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-primary flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-300 text-sm sm:text-base">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <Button
              variant={tier.highlighted ? "cta" : "outline"}
              size="md"
              className="w-full"
            >
              Get Started
            </Button>
          </div>
        ))}
      </div>

      {/* Footer Note */}
      <div className="text-center mt-8 sm:mt-12">
        <p className="text-muted text-xs sm:text-sm">
          All plans include a 30-day free trial. No credit card required.
        </p>
      </div>
    </div>
  );
}
