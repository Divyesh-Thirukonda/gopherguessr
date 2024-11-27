"use client";

import { useState } from "react";

export default function GameStatsCarousel({ easyStats, mediumStats, hardStats }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Define the stats for each mode
  const stats = [
    {
      title: "Overall",
      numGames:
        easyStats.numGames + mediumStats.numGames + hardStats.numGames,
      avgScore:
        (easyStats.avgScore + mediumStats.avgScore + hardStats.avgScore) / 3,
      highestScore: Math.max(
        easyStats.highestScore,
        mediumStats.highestScore,
        hardStats.highestScore
      ),
    },
    { title: "Easy", numGames: easyStats.numGames, avgScore: easyStats.avgScore, highestScore: easyStats.highestScore },
    { title: "Medium", numGames: mediumStats.numGames, avgScore: mediumStats.avgScore, highestScore: mediumStats.highestScore },
    { title: "Hard", numGames: hardStats.numGames, avgScore: hardStats.avgScore, highestScore: hardStats.highestScore },
  ];

  const goToNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % stats.length);
  };

  const goToPrevious = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + stats.length) % stats.length);
  };

  return (
    <div className="relative overflow-hidden w-full">
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
            className="bg-black/50 backdrop-blur-md rounded-lg shadow-2xl p-6 text-white text-center w-full flex-shrink-0 mr-[5%]"
          >
            <h3 className="text-rose-400 font-bold text-lg">{stat.title}</h3>
            <p className="text-6xl font-extrabold">{stat.numGames}</p>
            <p className="text-sm text-gray-400">Num Games Played</p>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div>
                <p className="text-4xl font-bold">{stat.avgScore.toFixed(2)}</p>
                <p className="text-sm text-gray-400">Avg Score</p>
              </div>
              <div>
                <p className="text-4xl font-bold">{stat.highestScore.toFixed(2)}</p>
                <p className="text-sm text-gray-400">Highest Score</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Carousel Navigation Arrows */}
      <div
        className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white text-3xl cursor-pointer"
        onClick={goToPrevious}
      >
        <span>&lt;</span>
      </div>
      <div
        className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white text-3xl cursor-pointer"
        onClick={goToNext}
      >
        <span>&gt;</span>
      </div>
    </div>
  );
}
