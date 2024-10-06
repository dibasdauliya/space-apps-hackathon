import React, { useEffect, useState } from "react";
import { Link, Element } from "react-scroll";
import { motion, useAnimation } from "framer-motion";
import { useViewportScroll } from "framer-motion";
import Sun3D from "../component/Sun3D";

export default function HomePage() {
  const { scrollY } = useViewportScroll();
  const controls = useAnimation();
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    return scrollY.onChange((latest) => {
      setScrollPosition(latest);
      controls.start({
        y: latest * 0.1, // Adjust the multiplier for subtle movement
        transition: { type: "spring", stiffness: 100 },
      });
    });
  }, [scrollY, controls]);

  return (
    <div className="snap-y snap-mandatory h-screen overflow-y-scroll">
      {/* First Section */}
      <Element name="section1" className="snap-start">
        <div className="relative min-h-screen">
          <video
            autoPlay
            muted
            loop
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/space.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black opacity-85"></div>
          <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4">
            <motion.h1
              className="font-sixtyfour text-6xl bg-space-vibe bg-clip-text text-transparent mb-4"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              style={{ y: scrollPosition * 0.1 }}
            >
              Caldwell Astrobots
            </motion.h1>
            <motion.p
              className="text-2xl text-white max-w-3xl mt-8"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              style={{ y: scrollPosition * 0.1 }}
            >
              A robotic arm toy with a self-learning base, blending fun and
              function to support astronauts' tasks and well-being in space.
            </motion.p>
          </div>
          <div className="absolute bottom-10 w-full flex justify-center z-10">
            <Link to="section2" smooth={true} duration={500}>
              <motion.div
                className="text-white cursor-pointer"
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                Scroll Down
              </motion.div>
            </Link>
          </div>
          <img
            src="/rocket.png"
            alt="Rocket"
            className="absolute bottom-0 left-0 w-24 animate-parabolicFlight"
          />
          <img
            src="/comet.png"
            alt="Comet"
            className="absolute top-[32%] left-80 w-16 animate-cometFlight"
          />
          <img
            src="/comet.png"
            alt="Comet"
            className="absolute top-[48%] right-80 w-16 animate-cometFlight"
          />
          {/* <img
            src="/sun.png"
            alt="Sun"
            className="absolute -top-20 -left-20 w-80 animate-rotate3D"
          /> */}
          <div className="absolute z-50 -top-16 -left-16 w-80 h-80">
            <Sun3D />
          </div>
        </div>
      </Element>

      {/* Second Section */}
      <Element name="section2" className="snap-start">
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
          <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4">
            <motion.h2
              className="text-4xl text-white"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              style={{ y: scrollPosition * 0.1 }}
            >
              Welcome to the Second Section
            </motion.h2>
            <motion.p
              className="mt-4 text-lg text-white max-w-2xl"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              style={{ y: scrollPosition * 0.1 }}
            >
              This is some content for the second section.
            </motion.p>
            <Link to="section3" smooth={true} duration={500}>
              <motion.div
                className="mt-10 text-blue-500 cursor-pointer"
                whileHover={{ scale: 1.1 }}
              >
                Scroll to Next Section
              </motion.div>
            </Link>
          </div>
        </div>
      </Element>

      {/* Third Section */}
      <Element name="section3" className="snap-start">
        <div className="relative min-h-screen flex items-center justify-center bg-gray-900 text-white">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            style={{ y: scrollPosition * 0.1 }}
          >
            <h2 className="text-4xl">Welcome to the Third Section</h2>
            <p className="mt-4 text-lg">
              This is some content for the third section.
            </p>
            <Link to="section1" smooth={true} duration={500}>
              <motion.div
                className="mt-10 text-blue-500 cursor-pointer"
                whileHover={{ scale: 1.1 }}
              >
                Scroll to First Section
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </Element>
    </div>
  );
}
