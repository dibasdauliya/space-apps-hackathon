import React from "react";
import { Element } from "react-scroll";

export default function HomeSectionWrapper({
  sectionName,
  children,
}: {
  sectionName: string;
  children: React.ReactNode;
}) {
  return (
    <Element name={sectionName} className="snap-start">
      <div className="relative min-h-screen">
        <video
          autoPlay
          muted
          loop
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/space2.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black opacity-85"></div>

        <div className="relative z-10 flex items-center justify-center min-h-screen text-left px-4">
          {children}
        </div>
      </div>
    </Element>
  );
}
