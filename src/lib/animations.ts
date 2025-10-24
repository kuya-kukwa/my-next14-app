import { cn } from "@/lib/utils";

// Animation utility functions
export const animations = {
  // Fade animations
  fadeIn: "animate-fadeIn",
  fadeOut: "opacity-0",

  // Slide animations
  slideUp: "animate-slideUp",
  slideDown: "animate-[slideDown_0.6s_ease-out]",
  slideLeft: "animate-[slideLeft_0.6s_ease-out]",
  slideRight: "animate-[slideRight_0.6s_ease-out]",

  // Scale animations
  scaleIn: "animate-scaleIn",
  scaleOut: "scale-95 opacity-0",

  // Bounce animations
  bounceIn: "animate-[bounceIn_0.6s_ease-out]",
  bounceOut: "scale-95 opacity-0",

  // Pulse animations
  pulse: "animate-pulse",
  ping: "animate-ping",
};

// Animation hooks for dynamic animations
export function useAnimation() {
  return {
    // Utility functions for common animation patterns
    getHoverAnimation: (baseClass = "") =>
      cn(baseClass, "transition-all duration-300 hover:scale-105"),

    getFocusAnimation: (baseClass = "") =>
      cn(baseClass, "transition-all duration-200 focus:scale-105"),

    getLoadingAnimation: (baseClass = "") =>
      cn(baseClass, "animate-pulse opacity-60"),

    getEntranceAnimation: (delay = 0) =>
      `animate-fadeIn [animation-delay:${delay}ms] [animation-fill-mode:both]`,
  };
}

// Animation keyframes (add to globals.css if not already present)
export const keyframes = `
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideLeft {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideRight {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
`;

// Animation presets for common UI patterns
export const animationPresets = {
  button: {
    hover: "transform hover:scale-105 transition-transform duration-200",
    active: "transform active:scale-95 transition-transform duration-100",
    loading: "animate-pulse cursor-not-allowed",
  },

  card: {
    hover: "transform hover:scale-105 hover:shadow-xl transition-all duration-300",
    entrance: "animate-fadeIn",
  },

  modal: {
    entrance: "animate-scaleIn",
    exit: "animate-[scaleOut_0.2s_ease-in]",
  },

  notification: {
    slideIn: "animate-slideDown",
    slideOut: "animate-[slideUp_0.3s_ease-in]",
  },
};