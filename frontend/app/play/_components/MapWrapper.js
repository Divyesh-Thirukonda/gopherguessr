"use client";

import { useEffect, useState } from "react";
import * as motion from "framer-motion/client";
import dynamic from "next/dynamic";
const BaseMap = dynamic(() => import("./BaseMap"), { ssr: false });

const maps = {
  eastBank: {
    imgSrc: "/images/eastbank.png",
    bounds: [
      [44.97069111915625, -93.23820422738942],
      [44.97837130687424, -93.22659538730979],
    ],
  },
};

export default function MapWrapper({ submitGuess, mode, gameState }) {
  const center = [
    maps[mode].bounds[1][0] -
      (maps[mode].bounds[1][0] - maps[mode].bounds[0][0]) / 2,
    maps[mode].bounds[1][1] -
      (maps[mode].bounds[1][1] - maps[mode].bounds[0][1]) / 2,
  ];
  const [guess, setGuess] = useState(center);

  useEffect(() => {
    // reset guess after submit
    setGuess(center);
  }, [gameState]);

  return (
    <>
      <BaseMap
        imgSrc={maps[mode].imgSrc}
        bounds={maps[mode].bounds}
        center={center}
        setGuess={setGuess}
        guess={guess}
      />
      <motion.button
        className="fixed bottom-6 left-0 right-0 z-[1000] mx-auto w-min whitespace-nowrap rounded-full bg-rose-600 px-4 py-2 font-medium text-white hover:bg-rose-700"
        whileHover={{ scale: 1.2 }}
        onClick={() => submitGuess(guess)}
      >
        Submit Guess
      </motion.button>
    </>
  );
}
