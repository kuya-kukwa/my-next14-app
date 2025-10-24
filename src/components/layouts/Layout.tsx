import React from "react";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-primary text-white font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/60 backdrop-blur-md">
        <nav className="container mx-auto flex items-center justify-between py-4 sm:py-6 md:py-8 px-4 sm:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-sm flex items-center justify-center text-white font-bold text-sm sm:text-lg shadow-lg shadow-primary/40"></div>
            <span className="text-lg sm:text-xl font-bold tracking-tight">
              <span className="text-primary">Next</span>Flix
            </span>
          </Link>

          {/* Navigation - can add menu items here later */}
          <div></div>
        </nav>
      </header>

      {/* Main content */}
      <main className="flex-1">{children}</main>
{/* Footer */}
<footer className="bg-black/50 py-8 sm:py-12 mt-0">
  <div className="container mx-auto px-4 sm:px-6 text-center text-sm text-gray-400 space-y-4 sm:space-y-6">
    <div className="flex flex-row flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 text-muted text-sm sm:text-base">
      <Link href="#" className="hover:text-primary transition-colors py-2 sm:py-0">
        Terms
      </Link>
      <Link href="#" className="hover:text-primary transition-colors py-2 sm:py-0">
        Privacy
      </Link>
      <Link href="#" className="hover:text-primary transition-colors py-2 sm:py-0">
        Help
      </Link>
    </div>

    <p className="text-muted text-xs sm:text-sm">
      © {new Date().getFullYear()}{" "}
      <span className="text-primary">NextFlix</span>. All rights reserved.
    </p>
  </div>
</footer>
    </div>
  );
}
