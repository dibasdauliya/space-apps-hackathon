import React, { useEffect, useState } from "react";
import { Element } from "react-scroll";
import { motion, useViewportScroll } from "framer-motion";

export default function HomeSection({
  sectionId,
  title,
  leftView,
  rightView,
  className,
}: {
  sectionId: string;
  title: string;
  leftView: React.ReactNode;
  rightView: any;
  className?: string;
}) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const { scrollY } = useViewportScroll();

  useEffect(() => {
    const unsubscribe = scrollY.onChange((latest) => {
      setScrollPosition(latest);
    });

    return () => unsubscribe();
  }, [scrollY]);

  return (
    <Element name={sectionId} className="snap-start">
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

        <div
          className={`relative z-10 flex flex-col md:flex-row items-center justify-center min-h-screen text-left p-4 m-8 ${className}`}
        >
          <section>
            <motion.h2
              className="text-4xl text-white font-sixtyfour max-w-xl"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              style={{ transform: `translateY(${scrollPosition * 0.1}px)` }}
            >
              {title}
            </motion.h2>
            {leftView}
          </section>
          <section>{rightView}</section>
        </div>
      </div>
    </Element>
  );
}
