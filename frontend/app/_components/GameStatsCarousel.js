"use client";

import { useState } from "react";
import * as motion from "framer-motion/client";
import { useSwipeable } from "react-swipeable";

export default function GameStatsCarousel({
  easyStats,
  mediumStats,
  hardStats,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Define the stats for each mode
  const stats = [
    {
      title: "Overall",
      numGames: easyStats.numGames + mediumStats.numGames + hardStats.numGames,
      avgScore:
        (easyStats.avgScore + mediumStats.avgScore + hardStats.avgScore) / 3,
      highestScore: Math.max(
        easyStats.highestScore,
        mediumStats.highestScore,
        hardStats.highestScore,
      ),
    },
    {
      title: "Easy",
      numGames: easyStats.numGames,
      avgScore: easyStats.avgScore,
      highestScore: easyStats.highestScore,
    },
    {
      title: "Medium",
      numGames: mediumStats.numGames,
      avgScore: mediumStats.avgScore,
      highestScore: mediumStats.highestScore,
    },
    {
      title: "Hard",
      numGames: hardStats.numGames,
      avgScore: hardStats.avgScore,
      highestScore: hardStats.highestScore,
    },
  ];

  const goToNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % stats.length);
  };

  const goToPrevious = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + stats.length) % stats.length,
    );
  };

  const swipeableAreaProp = useSwipeable({
    onSwipedLeft: () => goToNext(),
    onSwipedRight: () => goToPrevious(),
    trackMouse: true,
  });

  return (
    <div {...swipeableAreaProp} className="relative w-full overflow-hidden">
      <div
        className={`flex transition-transform duration-500 ease-in-out`}
        style={{
          transform: `translateX(-${currentIndex * 105}%)`, // Each card should move 100% of the container width
        }}
        onTransitionEnd={() => setIsAnimating(false)} // Reset animation flag when transition ends
      >
        {stats.map((stat, key) => (
          <div
            key={key}
            className="mr-[5%] w-full flex-shrink-0 rounded-lg bg-black/50 p-6 text-center text-white shadow-2xl backdrop-blur-md"
          >
            <h3 className="text-lg font-bold text-rose-400">{stat.title}</h3>
            <p className="text-6xl font-extrabold">{stat.numGames}</p>
            <p className="text-sm text-gray-400">Num Games Played</p>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div>
                <p className="text-4xl font-bold">{stat.avgScore.toFixed(2)}</p>
                <p className="text-sm text-gray-400">Avg Score</p>
              </div>
              <div>
                <p className="text-4xl font-bold">
                  {stat.highestScore.toFixed(2)}
                </p>
                <p className="text-sm text-gray-400">Highest Score</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Carousel Navigation Arrows */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 transform">
        <motion.button
          className="rounded-full bg-white p-2 text-gray-800"
          whileHover={{ scale: 1.2 }}
          onClick={goToPrevious}
        >
          &larr;
        </motion.button>
      </div>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 transform">
        <motion.button
          className="rounded-full bg-white p-2 text-gray-800"
          whileHover={{ scale: 1.2 }}
          onClick={goToNext}
        >
          &rarr;
        </motion.button>
      </div>
    </div>
  );
}
