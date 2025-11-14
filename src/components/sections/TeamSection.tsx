"use client";

import React from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { teamMembers } from "@/data/teams";

export default function TeamSection() {
  const [failedMap, setFailedMap] = React.useState<Record<number, boolean>>({});

  return (
    <Section className="py-[clamp(2rem,4vw,5rem)] bg-transparent">
      <Container>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40 pointer-events-none -z-10" />

        {/* Header */}
        <div className="relative z-10 text-center mb-[clamp(1.5rem,4vw,4rem)]">
          <h2 className="text-[clamp(1.5rem,4vw,3.2rem)] font-bold mb-3 gradient-text">
            Meet The Team
          </h2>
          <p className="text-gray-400 text-[clamp(0.9rem,1.5vw,1.2rem)] max-w-2xl mx-auto">
            The talented people behind NextFlix&rsquo;s success
          </p>
        </div>

        {/* Fluid Equal-Height Grid */}
        <div
          className="
            grid 
            grid-cols-[repeat(auto-fit,minmax(260px,1fr))] 
            gap-[clamp(1rem,2vw,2rem)]
            items-stretch
            relative z-10
          "
        >
          {teamMembers.map((member) => (
            <div key={member.id} className="w-full h-full">
              <div
                className="
                  group relative flex flex-col h-full
                  bg-white/5 backdrop-blur-md rounded-2xl 
                  p-[clamp(1rem,2vw,2rem)] border border-white/10 
                  transition-all duration-300 
                  hover:border-primary/50 hover:shadow-xl hover:shadow-primary/20 
                  hover:-translate-y-2
                "
              >
                {/* Avatar */}
                <div className="flex justify-center mb-[clamp(1rem,2vw,1.5rem)]">
                  <div
                    className="
                      relative 
                      w-[clamp(5rem,10vw,8rem)] 
                      h-[clamp(5rem,10vw,8rem)]
                      mx-auto border-2 border-gray-500/40 
                      group-hover:border-primary/50 
                      transition-all duration-300 
                      rounded-full
                    "
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-red-800 rounded-full animate-pulse opacity-40 group-hover:opacity-100 transition-opacity duration-300 z-0" />
                    <div className="relative w-full h-full rounded-full overflow-hidden z-10 flex items-center justify-center text-white font-bold text-[clamp(1.2rem,2vw,2rem)]">
                      {member.avatar && !failedMap[member.id] ? (
                        <Image
                          src={member.avatar}
                          alt={member.name}
                          width={300}
                          height={300}
                          style={{
                            objectFit: "cover",
                            objectPosition: member.objectPosition || "center",
                            width: "100%",
                            height: "100%",
                          }}
                          onError={() =>
                            setFailedMap((p) => ({ ...p, [member.id]: true }))
                          }
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

                {/* Info — Fills vertical space */}
                <div className="text-center flex-1 flex flex-col">
                  <h3
                    className="
                      font-bold text-white 
                      text-[clamp(1.2rem,2.5vw,2rem)] 
                      mb-2 
                      px-2 py-1 rounded-lg 
                      transition-all duration-300 
                      hover:!text-primary hover:bg-primary/10 
                      cursor-default
                    "
                  >
                    {member.name}
                  </h3>

                  <p className="text-primary font-semibold text-[clamp(1rem,2vw,1.25rem)] mb-2">
                    {member.role}
                  </p>

                  {member.bio && (
                    <p className="text-gray-400 text-[clamp(0.85rem,1.5vw,1rem)] leading-relaxed flex-1">
                      {member.bio}
                    </p>
                  )}
                </div>

                {/* Hover Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
