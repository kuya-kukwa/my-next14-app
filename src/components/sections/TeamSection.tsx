"use client";

import React from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { teamMembers } from "@/data/teams";

export default function TeamSection() {
  const [failedMap, setFailedMap] = React.useState<Record<number, boolean>>({});

  return (
  <Section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-transparent">
      <Container>
        {/* Gradient overlay - positioned inside container for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40 pointer-events-none -z-10" />
        
        <div className="relative z-10 text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 gradient-text">
            Meet The Team
          </h2>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
            The talented people behind NextFlix's success
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-3 gap-6 sm:gap-8 md:gap-10">
          {teamMembers.map((member) => (
            <div key={member.id} className="w-full">
              <div className="group relative bg-white/5 backdrop-blur-md rounded-2xl p-4 sm:p-6 md:p-8 border border-white/10 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-2 h-full">
                {/* Avatar */}
                <div className="flex justify-center mb-6">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 mx-auto border-2 border-gray-500/40 group-hover:border-primary/50 transition-all duration-300 rounded-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-red-800 rounded-full animate-pulse opacity-50 group-hover:opacity-100 transition-opacity duration-300 z-0" />
                    <div className="relative w-full h-full bg-gray-700 rounded-full flex items-center justify-center text-white text-lg sm:text-xl md:text-2xl font-bold overflow-hidden z-10">
                      {member.avatar && !failedMap[member.id] ? (
                        <Image
                          src={member.avatar}
                          alt={member.name}
                          width={128}
                          height={128}
                          // Let the image control height and keep width auto so aspect ratio is preserved
                          style={{ objectFit: "cover", objectPosition: member.objectPosition || "center", width: "auto", height: "100%" }}
                          className="block"
                          onError={() => setFailedMap((p) => ({ ...p, [member.id]: true }))}
                        />
                      ) : (
                        member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                      )}
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="text-center">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 px-3 py-2 rounded-lg transition-all duration-300 hover:!text-primary hover:bg-primary/10 cursor-default">
                    {member.name}
                  </h3>
                  <p className="text-primary text-sm sm:text-base font-semibold mb-3">
                    {member.role}
                  </p>
                  {member.bio && (
                    <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                      {member.bio}
                    </p>
                  )}
                </div>

                {/* Decorative gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
