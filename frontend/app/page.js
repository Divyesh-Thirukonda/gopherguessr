"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import * as motion from "framer-motion/client";
import Link from "next/link";
import Image from "next/image";

// Keep contributor info fresh
export const dynamic = "force-dynamic";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [gameMode, setGameMode] = useState("default"); // Index for carousel navigation
  const router = useRouter();

  const gameModes = [
    {
      title: "Default",
      mode: "default",
      description: "Explore the entire twin-cities campus",
      bg: "https://admissions.tc.umn.edu/sites/admissions.tc.umn.edu/files/styles/hero_image/public/2021-05/location.jpg?itok=HDx2_JJx",
    },
    {
      title: "Easy",
      mode: "1",
      description: "You've probably been here before",
      bg: "https://i.ytimg.com/vi/Mn-JHxscNV0/maxresdefault.jpg",
    },
    {
      title: "Medium",
      mode: "2",
      description: "Not too difficult",
      bg: "https://upload.wikimedia.org/wikipedia/commons/3/32/Science_Teaching_and_Student_Services_Minnesota_5.jpg",
    },
    {
      title: "Hard",
      mode: "3",
      description: "'This exists??'",
      bg: "https://campusmaps.umn.edu/sites/campusmaps.umn.edu/files/styles/folwell_full/public/2022-01/boathouse_150804_7974.jpg?itok=TDru7LZV",
    },
    {
      title: "St. Paul",
      mode: "St.Paul",
      description: "Cows are the coolest thing here.",
      bg: "https://farm4.static.flickr.com/3304/3589837883_158e809b69.jpg",
    },{
      title: "Dinkytown",
      mode: "Dinkytown",
      description: "Grab your bullet-proof vests folks",
      bg: "https://www.minneapolis.org/imager/cmsimages/meta-images/793707/tcf-bank-area-dinkytown-social-mtime20190627142030_2021-11-01-120926_eegx_91852798b59be8b28fc00edfe4aec23a.jpg",
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
    setGameMode((prev) => (prev + newDirection + gameModes.length) % gameModes.length);
  };

  const contributorsFetch = async () => {
    const res = await fetch(
      "https://api.github.com/repos/Divyesh-Thirukonda/gopherguessr/contributors",
      { cache: "no-store" }
    );
    return await res.json();
  };

  const [contributors, setContributors] = useState([]);

  useEffect(() => {
    contributorsFetch().then(setContributors);
  }, []);

  return (
    <main className={`${isLoading && "animate-[loadBlur_1s_ease-in-out_forwards]"}`}>
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
            <source src="/cacheable/umn-flyover-20241021.mp4" type="video/mp4" />
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

            {/* Carousel Section */}
            <div className="relative mt-6 w-full">
              <motion.div
                className="relative flex w-full items-center justify-center"
                key={gameMode}
              >
                <motion.div
                  className="rounded-lg p-6 text-center"
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  custom={direction}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  style={{
                    background: `url(${gameModes[gameMode].bg}) no-repeat center center / cover`,
                    width: "100%",
                    height: "250px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <h2 className="text-3xl font-bold text-white">{gameModes[gameMode].title}</h2>
                  <p className="mt-2 text-white">{gameModes[gameMode].description}</p>
                  <motion.button
                    className="mt-4 rounded-full bg-rose-600 px-4 py-2 text-lg font-medium text-white"
                    onClick={handlePlayClick}
                    whileHover={{ scale: 1.1 }}
                  >
                    Play {gameModes[gameMode].title}
                    <ArrowRight className="ml-2 inline-block h-5 w-5" />
                  </motion.button>
                </motion.div>
              </motion.div>

              {/* Navigation Buttons */}
              <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
                <button
                  className="rounded-full bg-gray-800 p-2 text-white shadow"
                  onClick={() => paginate(-1)}
                >
                  &larr;
                </button>
              </div>
              <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
                <button
                  className="rounded-full bg-gray-800 p-2 text-white shadow"
                  onClick={() => paginate(1)}
                >
                  &rarr;
                </button>
              </div>
            </div>

            <motion.div
              className="absolute top-0 right-0 mx-auto mt-4 inline-block rounded-full bg-rose-600 mr-3"
              whileHover={{ scale: 1.1 }}
            >
              <Link
                href="/login"
                className="inline-flex items-center px-4 py-2 text-2xl font-medium text-white"
              >
                Login
                <ArrowRight className="ml-1.5 h-6 w-6" weight="bold" />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Contributors Section */}
        <div className="absolute left-0 right-0 top-[92dvh] p-6 text-center text-white">
          <div className="flex items-center gap-4">
            <hr className="w-full border-dashed border-gray-400" />
            <span className="shrink-0">&darr;&nbsp;&nbsp;&nbsp;Contributors</span>
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
