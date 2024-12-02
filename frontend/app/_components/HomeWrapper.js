"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowArcLeft,
  ArrowRight,
  Ranking,
  SignIn,
  UserCircle,
  UsersFour,
} from "@phosphor-icons/react/dist/ssr";
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
    /*
      we currently don't have enough photos to offer a good user experience for these modes if we limit to minneapolis campus
      for example there are only 35 easy photos on the minneapolis campus
      thats only enough to last 7 games!
      and only like 2 until repeats become rampant
      so hiding for now until we have more photos
      i did add an "all" mode that has every photo though
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
    },*/
    {
      title: "Everything",
      mode: "all",
      description: "You gotta be better than Rainbolt to play this mode...",
      bg: "https://utfs.io/a/e9dxf42twp/xHYRlR61dJiMxjdU0W61dJiMHu2eo6NDykUlB7vPE4fYOCIq",
    },
  ];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // const handlePlayClick = (e) => {
  //   e.preventDefault();
  //   if (!isMounted) return;

  //   setIsLoading(true);
  //   router.push(`/play?gameMode=${gameModes[gameMode].mode}`);
  // };
  const handleNavigationClick = (target) => {
    return (e) => {
      e.preventDefault();
      if (!isMounted) return;

      setIsLoading(true);

      if (target === "play") {
        router.push(`/play?gameMode=${gameModes[gameMode].mode}`);
      } else if (target === "leaderboard") {
        router.push("/leaderboard");
      } else if (target === "lobby") {
        router.push("/lobby");
      } else {
        console.warn("Unknown target:", target);
        setIsLoading(false); // Reset loading if the route is invalid
      }
    };
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
      className={`fixed inset-0 overflow-y-scroll ${isLoading && "animate-[loadBlur_1s_ease-in-out_forwards]"}`}
    >
      <section className="relative flex min-h-full w-full flex-col items-center justify-center px-3 pb-10 pt-20">
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
        <div className="relative flex min-h-[80dvh] items-center">
          <div className="max-w-md text-center">
            <h1 className="text-5xl font-bold text-white">Explore The U!</h1>
            <p className="mt-3 text-white">
              Just like Geoguessr, but for the streets and buildings of the
              beautiful University of Minnesota campus!
            </p>
            {inProgressGame && (
              <div className="mt-3 flex flex-col gap-3">
                <MotionButton
                  onClick={handleNavigationClick("play")}
                  className="text-xl"
                >
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
                <div className="bg-amber-400 py-2 text-lg font-medium">
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
                            onClick={handleNavigationClick("play")}
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
                      className="rounded-full bg-rose-600 p-2 text-white"
                      whileHover={{ scale: 1.2 }}
                      onClick={() => paginate(-1)}
                    >
                      &larr;
                    </motion.button>
                  </div>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 transform">
                    <motion.button
                      className="rounded-full bg-rose-600 p-2 text-white"
                      whileHover={{ scale: 1.2 }}
                      onClick={() => paginate(1)}
                    >
                      &rarr;
                    </motion.button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Contributors Section */}
        <div className="relative left-0 right-0 top-0 w-dvw px-3 pb-3 pt-10 text-center text-white">
          <div className="flex items-center gap-4">
            <hr className="w-full border-dashed border-gray-400" />
            <span className="shrink-0">
              &darr;&nbsp;&nbsp;&nbsp;Contributors
            </span>
            <hr className="w-full border-dashed border-gray-400" />
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            {contributors && Array.isArray(contributors) ? (
              contributors.map((contributor) => (
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
              ))
            ) : (
              <div>Error fetching contributors...</div>
            )}
          </div>
        </div>

        <motion.div
          className="fixed right-3 top-3 mx-auto inline-block rounded-full bg-rose-600"
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.8 }}
        >
          <Link
            href="/login"
            className="inline-flex items-center px-4 py-2 text-xl font-medium text-white"
            aria-label="Login"
          >
            {isLoggedIn ? (
              <UserCircle
                className="h-6 w-6"
                weight="bold"
                aria-label="Profile Icon"
              />
            ) : (
              <>
                <span>Login</span>
                <SignIn className="ml-1.5 h-6 w-6" weight="bold" />
              </>
            )}
          </Link>
        </motion.div>

        <div className="fixed left-3 top-3">
          <MotionButton
            onClick={handleNavigationClick("leaderboard")}
            className="inline-flex items-center px-4 py-2 text-2xl font-medium text-white"
            ariaLabel="Leaderboard"
          >
            <Ranking className="h-6 w-6" aria-label="Leaderboard Icon" />
          </MotionButton>
        </div>
        <div className="fixed left-[4.75rem] top-3">
          <MotionButton
            onClick={handleNavigationClick("lobby")}
            className="inline-flex items-center px-4 py-2 text-2xl font-medium text-white"
            ariaLabel="Multiplayer"
          >
            <UsersFour className="h-6 w-6" aria-label="Multiplayer Icon" />
          </MotionButton>
        </div>
      </section>

      {/* Loading */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" />
      )}
    </main>
  );
}
