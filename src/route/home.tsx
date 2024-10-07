import React, { useEffect, useState } from "react";
import { Link, Element } from "react-scroll";
import { motion, useAnimation } from "framer-motion";
import { useViewportScroll } from "framer-motion";
import Sun3D from "../component/Sun3D";
import CarView from "./car-view";
import HomeSection from "../component/HomeSection";
import HomeSectionWrapper from "../component/HomeSectionWrapper";

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
      <Element name="section0" className="snap-start">
        <div className="relative min-h-screen">
          <video
            autoPlay
            muted
            loop
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black opacity-65"></div>

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
          </div>

          <span className="absolute top-8 left-8 font-semibold [text-shadow:_0_.5px_0_rgb(0_0_0_/_40%)] bg-gray-800 px-2 rounded-md bg-opacity-45">
            Calibrating, self-learning, and performing
          </span>
          <span className="absolute top-[600px] left-[490px] font-semibold [text-shadow:_0_.5px_0_rgb(0_0_0_/_40%)] bg-gray-800 px-2 rounded-md bg-opacity-45">
            Image capturing, processing, and detection
          </span>
          <span className="absolute top-8 right-8 font-semibold [text-shadow:_0_.5px_0_rgb(0_0_0_/_40%)] bg-gray-800 px-2 rounded-md bg-opacity-45">
            Radio transmission and adaptive gesture control
          </span>

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

          {/* <img
            src="/sunn.png"
            alt="Sun"
            className="absolute inset-0 w-full h-full -z-1 opacity-40 animate-"
          /> */}
        </div>
      </Element>

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
          <div className="relative z-10 flex items-center gap-6 justify-center min-h-screen text-left px-4">
            <section>
              <motion.h2
                className="text-4xl text-white font-sixtyfour"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                style={{ y: scrollPosition * 0.1 }}
              >
                What is Caldwell Astrobots?
              </motion.h2>
              <motion.p
                className="text-2xl text-white max-w-3xl mt-8"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                style={{ y: scrollPosition * 0.1 }}
              >
                Meet our team Caldwell Astrobots, a group of 4 space and
                robotics enthusiasts bringing forth a gesture control and self
                training robotic companion with a four wheeler prototype capable
                of becoming a friend and coworker for astronauts spending months
                in space exploration. <br />
                <br />
                Team members: Anish Pandey, Dibas Dauliya, Dikshya Giri, and
                Shovan Raut
              </motion.p>
            </section>
            <img src="/team.png" width={400} alt="" className="rounded-md" />
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
          {/* <img
            src="/rocket.png"
            alt="Rocket"
            className="absolute bottom-0 left-0 w-24 animate-parabolicFlight"
          /> */}
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
          <img
            src="/sunn.png"
            alt="Sun"
            className="absolute inset-0 w-full h-full -z-1 opacity-40 animate-"
          />
          {/* <div className="absolute z-50 -top-16 -left-16 w-80 h-80">
            <Sun3D />
          </div> */}
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

          <div className="relative z-10 flex items-center justify-center min-h-screen text-left gap-8 px-4">
            <section>
              <motion.h2
                className="text-4xl text-white font-sixtyfour"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                style={{ y: scrollPosition * 0.1 }}
              >
                Our Missions
              </motion.h2>
              <ul className="space-y-4 mt-6 list-disc">
                <li className="text-lg text-white max-w-2xl">
                  <strong>Leverage Microgravity</strong>: Design a robotic
                  prototype that takes advantage of the unique conditions of
                  space, enhancing astronauts' physical and mental well-being.
                </li>
                <li className="text-lg text-white max-w-2xl">
                  <strong>Promote Health and Cohesion</strong>: Ensure the
                  prototype is a source of entertainment and mental stimulation
                  while fostering teamwork among astronaut crews.
                </li>
                <li className="text-lg text-white max-w-2xl">
                  <strong>Adapt to Space Limitations</strong>: Consider space
                  habitat constraints, creating a compact, engaging experience
                  that entertains and strengthens resilience in the long-term.
                </li>
              </ul>
            </section>
            {/* <img
              src="/sunn.png"
              alt="Sun"
              className="absolute inset-0 w-full h-full -z-1 opacity-40 animate-"
            /> */}
            <img
              src="/rocket2.png"
              alt="Rocket"
              className="absolute bottom-0 -z-10 left-0 w-32 animate-parabolicFlight"
            />
            <img src="/car.jpg" width={300} className="rounded-md" />
          </div>
        </div>
      </Element>

      <HomeSection
        sectionId="section3"
        title="Prototype Model & Algorithms"
        className="gap-8"
        leftView={
          <>
            <ul className="space-y-4 mt-6 list-disc text-lg text-white max-w-2xl">
              <li>
                Hand Tracking with OpenCV & MediaPipe: Uses OpenCV for image
                processing and MediaPipe for precise hand landmark detection.
              </li>
              <li>
                Machine Learning with TensorFlow: Trains a neural network on
                hand movement data to refine control over time.
              </li>
              <li>
                Microgravity Adaptation: Optimizes functionality with sensor
                fusion for seamless operation in microgravity.
              </li>
              <li>
                Wireless Communication: Uses Bluetooth or Wi-Fi for real-time
                control of the robotic hand.
              </li>
            </ul>

            <motion.h2
              className="text-xl mt-8 text-white font-sixtyfour"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              style={{ y: scrollPosition * 0.1 }}
            >
              Detection of Celestial Bodies with Image Processing
            </motion.h2>

            <ul className="space-y-4 mt-6 list-disc text-lg text-white max-w-2xl">
              <li>
                Spectral Analysis with OpenCV: Analyzes celestial colors to
                identify planets or space objects.
              </li>
              <li>
                Color Matching with NASA Data: Compares detected colors with
                NASA's database for accurate identification using RGB/HSV.
              </li>
              <li>
                Feature Extraction: NumPy and SciPy help extract color
                histograms and other features.
              </li>
            </ul>
          </>
        }
        rightView={
          <>
            <section className="space-y-8 w-[400px]">
              <img src="/proto.png" width={500} className="rounded-md" />
              <video
                width={500}
                autoPlay
                muted
                loop
                className="w-full rounded-md"
              >
                <source src="/color-detect.MOV" type="video/mp4" />
              </video>
            </section>
          </>
        }
      />

      <HomeSection
        sectionId="section4"
        title="Self-learning Model with Raspberry Pi"
        className="gap-8"
        leftView={
          <>
            <ul className="space-y-4 mt-6 list-disc text-lg text-white max-w-2xl">
              <li>
                Calibration: Raspberry Pi adjusts sensors and model settings for
                astronaut-specific tasks and environments.
              </li>
              <li>
                Data Storage: Task data and learning progress are stored locally
                for quick access and analysis.
              </li>
              <li>
                Model Reusability: The system re-runs and fine-tunes models,
                improving based on previous tasks.
              </li>
              <li>
                Real-time Task Adaptation: Instantly adapts to tasks using GPIO
                pins and sensor inputs.
              </li>
              <li>
                Edge Computing: Integrates sensors for real-time data processing
                and self-learning.
              </li>
            </ul>
          </>
        }
        rightView={
          <>
            <section className="space-y-8 w-[400px]">
              <video
                autoPlay
                muted
                loop
                className="w-[300px] object-cover rounded-md h-52"
              >
                <source src="/self-learn-2.MOV" type="video/mp4" />
              </video>
              <video
                autoPlay
                muted
                loop
                className="w-[300px] object-cover rounded-md h-52 "
              >
                <source src="/self-learn.mp4" type="video/mp4" />
              </video>
            </section>
          </>
        }
      />

      <HomeSection
        sectionId="section5"
        title="Summarizing Applications"
        className="gap-8"
        leftView={
          <>
            <ul className="space-y-4 mt-6 list-disc text-lg text-white max-w-2xl">
              <li>
                Autonomous Task Assistance: The robotic hand autonomously
                assists with equipment handling, assembly, and repair tasks by
                learning and replicating astronaut hand movements, thus reducing
                workload in microgravity environments.
              </li>
              <li>
                Recreational and Skill-Enhancing Games: The system engages
                astronauts in interactive games like rock-paper-scissors and
                ping pong, fostering recreation and enhancing hand-eye
                coordination, agility, and mental sharpness during extended
                missions.
              </li>
              <li>
                Floating Object Retrieval: Utilizing computer vision, the
                robotic hand detects and retrieves free-floating objects,
                ensuring astronauts have an organized and accessible
                environment.
              </li>
              <li>
                Automated Spacecraft Cleaning: The robotic hand autonomously
                collects debris and loose particles, maintaining a clean and
                hazard-free environment within the spacecraft.
              </li>
              <li>
                Inventory and Tool Management: The system tracks and monitors
                tools and supplies, aiding astronauts in inventory management by
                ensuring items are secured, accessible, and efficiently
                organized.
              </li>
            </ul>
          </>
        }
        rightView={
          <>
            <section className="space-y-8 w-[400px]">
              {/* <img src="/proto.png" width={500} className="rounded-md" /> */}
              <video
                width={500}
                autoPlay
                muted
                loop
                className="w-full rounded-md"
              >
                <source src="/robo.mp4" type="video/mp4" />
              </video>
            </section>
          </>
        }
      />

      <HomeSection
        sectionId="section4"
        title="Complete Astrobot Model"
        leftView={
          <ul className="space-y-4 mt-6 list-disc text-lg text-white max-w-2xl">
            <li>
              Telepathic Interface: Brain-computer interface allows astronauts
              to control the arm using neural signals for tasks like repairs and
              experiments.
            </li>
            <li>
              Advanced Learning Companion: The arm learns from tasks, suggesting
              optimized methods and innovative solutions.
            </li>
            <li>
              Holographic Display: Projects holograms for task planning or
              immersive games in space.
            </li>
            <li>
              Self-Healing Materials: Futuristic materials enable the arm to
              repair itself, ensuring continuous operation in space.
            </li>
            <li>
              Artificial Muscles & Biofeedback: Synthetic muscles provide
              human-like touch feedback for intuitive control.
            </li>
            <li>
              Gravity Simulator: Simulates different gravitational forces for
              training or countering microgravity effects.
            </li>
            <li>
              Astronaut Wellness Hub: Acts as a virtual assistant for health
              diagnostics, muscle routines, and stress relief.
            </li>
          </ul>
        }
        rightView={<CarView />}
      />

      <HomeSectionWrapper sectionName="section5">
        <section>
          <motion.h2
            className="text-4xl text-white font-sixtyfour"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            style={{ y: scrollPosition * 0.1 }}
          >
            What More Can We Do With Model Changes?
          </motion.h2>
        </section>
      </HomeSectionWrapper>
    </div>
  );
}
