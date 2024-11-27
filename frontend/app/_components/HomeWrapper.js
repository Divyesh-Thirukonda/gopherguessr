"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowArcLeft, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import * as motion from "framer-motion/client";
import Link from "next/link";
import Image from "next/image";
import MotionButton from "./MotionButton";
import { useSwipeable } from "react-swipeable";

export default function HomeWrapper({
  clearGameState,
  contributors,
  inProgressGame,
  isLoggedIn,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [gameMode, setGameMode] = useState(0); // Index for carousel navigation
  const router = useRouter();

  const gameModes = [
    {
      title: "Minneapolis",
      mode: "default",
      description: "Explore The Minneapolis Campus",
      bg: "https://utfs.io/a/e9dxf42twp/xHYRlR61dJiMCejBeBNbNR3mhrM4ioY0JK2I6j57BZAWxLct",
    },
    {
      title: "St. Paul",
      mode: "stpaul",
      description: "Cows may be coolest thing here-",
      bg: "https://utfs.io/a/e9dxf42twp/xHYRlR61dJiMdevHFUSzhAB4JjrVfnMDw1C0o37tcFgSuP2K",
    },
    {
      title: "Easy",
      mode: "1",
      description: "You've probably been here before :)",
      bg: "https://utfs.io/a/e9dxf42twp/xHYRlR61dJiM6kLnd57W0SRVu3wlG8pQtDvzm7eZCXHNFAxj",
    },
    {
      title: "Medium",
      mode: "2",
      description: "Use your context clues!",
      bg: "https://utfs.io/a/e9dxf42twp/xHYRlR61dJiM0kHzV9fLvPQdMhU8Oi71sqfSamJWHeg3NBrl",
    },
    {
      title: "Hard",
      mode: "3",
      description: '"This exists??" :O',
      bg: "https://utfs.io/a/e9dxf42twp/xHYRlR61dJiMGnHLxEiXzCVTYEGJj5pQab9dMKoReIthFUrO",
    },
  ];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handlePlayClick = (e) => {
    e.preventDefault();
    if (!isMounted) return;

    setIsLoading(true);
    router.push(`/play?gameMode=${gameModes[gameMode].mode}`);
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  const [direction, setDirection] = useState(0); // Track slide direction

  const paginate = (newDirection) => {
    setDirection(newDirection);
    setGameMode(
      (prev) => (prev + newDirection + gameModes.length) % gameModes.length,
    );
  };

  const swipeableAreaProp = useSwipeable({
    onSwipedLeft: () => paginate(1),
    onSwipedRight: () => paginate(-1),
    trackMouse: true, // Enables swipe for mouse drag (useful for testing on desktops)
  });

  return (
    <main
      className={`${isLoading && "animate-[loadBlur_1s_ease-in-out_forwards]"}`}
    >
      <section className="relative min-h-dvh w-full">
        <div className="fixed inset-0">
          <video
            className="h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            poster="/cacheable/umn-flyover-poster-20241021.webp"
          >
            <source
              src="/cacheable/umn-flyover-20241021.mp4"
              type="video/mp4"
            />
          </video>
        </div>
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 backdrop-blur"></div>
        <div className="absolute inset-0 flex items-center justify-center px-4 pb-20 pt-12">
          <div className="max-w-md text-center">
            <h1 className="text-5xl font-bold text-white">Explore The U!</h1>
            <p className="mt-3 text-white">
              Just like Geoguessr, but for the streets and buildings of the
              beautiful University of Minnesota campus!
            </p>
            {inProgressGame && (
              <div className="mt-3 flex flex-col gap-3">
                <MotionButton onClick={handlePlayClick} className="text-xl">
                  Continue Game{" "}
                  <ArrowRight
                    className="ml-2 inline-block h-6 w-6"
                    weight="bold"
                  />
                </MotionButton>
                <MotionButton onClick={clearGameState} className="text-xl">
                  New Game{" "}
                  <ArrowArcLeft
                    className="ml-2 inline-block h-6 w-6"
                    weight="bold"
                  />
                </MotionButton>
              </div>
            )}
            {/* game mode selector */}

            {!inProgressGame && (
              <div className="mt-6 w-full overflow-hidden rounded-xl border border-gray-500 bg-white">
                <div className="border-b border-gray-500 py-2 text-lg font-medium">
                  Select a Game Mode to Play
                </div>
                <div className="relative w-full">
                  {/* Swipeable Area */}
                  <div {...swipeableAreaProp}>
                    <motion.div
                      className="relative flex w-full items-center justify-center bg-gray-500"
                      key={gameMode}
                    >
                      <motion.div
                        className="relative h-64 w-full text-center"
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        custom={direction}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      >
                        <Image
                          fill
                          alt=""
                          src={gameModes[gameMode].bg}
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gray-800 bg-opacity-40 backdrop-blur-sm" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center px-20">
                          <h2 className="text-3xl font-bold text-white">
                            {gameModes[gameMode].title}
                          </h2>
                          <p className="text-white">
                            {gameModes[gameMode].description}
                          </p>
                          <MotionButton
                            onClick={handlePlayClick}
                            className="mt-2"
                          >
                            Play {gameModes[gameMode].title}
                            <ArrowRight className="ml-2 inline-block h-5 w-5" />
                          </MotionButton>
                        </div>
                      </motion.div>
                    </motion.div>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 transform">
                    <motion.button
                      className="rounded-full bg-white p-2 text-gray-800"
                      whileHover={{ scale: 1.2 }}
                      onClick={() => paginate(-1)}
                    >
                      &larr;
                    </motion.button>
                  </div>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 transform">
                    <motion.button
                      className="rounded-full bg-white p-2 text-gray-800"
                      whileHover={{ scale: 1.2 }}
                      onClick={() => paginate(1)}
                    >
                      &rarr;
                    </motion.button>
                  </div>
                </div>
              </div>
            )}

            <motion.div
              className="absolute right-0 top-0 mx-auto mr-3 mt-4 inline-block rounded-full bg-rose-600"
              whileHover={{ scale: 1.1 }}
            >
              <Link
                href="/login"
                className="inline-flex items-center px-4 py-2 text-2xl font-medium text-white"
              >
                {isLoggedIn ? "Profile" : "Login"}
                <ArrowRight className="ml-1.5 h-6 w-6" weight="bold" />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Contributors Section */}
        <div className="absolute left-0 right-0 top-[92dvh] p-6 text-center text-white">
          <div className="flex items-center gap-4">
            <hr className="w-full border-dashed border-gray-400" />
            <span className="shrink-0">
              &darr;&nbsp;&nbsp;&nbsp;Contributors
            </span>
            <hr className="w-full border-dashed border-gray-400" />
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            {contributors?.map((contributor) => (
              <div key={contributor.id} className="relative">
                <a
                  href={`https://github.com/${contributor.login}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src={contributor.avatar_url}
                    alt={contributor.login}
                    width={60}
                    height={60}
                    className="rounded-full border-2 border-white"
                  />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Loading */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" />
      )}
    </main>
  );
}
