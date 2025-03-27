"use client";

import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import * as motion from "framer-motion/client";
import Link from "next/link";
import { useState, useEffect } from "react";
import MultiplayerReturnLink from "./MultiplayerReturnLink";

export default function LobbyLeaderboard({ games, path, pollForLeaderboard }) {
  const [secondsSinceRefresh, setSecondsSinceRefresh] = useState(5);

  // Update timer and handle revalidation
  useEffect(() => {
    const updateInterval = setInterval(() => {
      pollForLeaderboard(path);
      setSecondsSinceRefresh((prev) => prev + 1);
    }, 6000); // Reloads the multiplayer leaderboard every 6 seconds. Can be lowered/raised based on performance

    return () => {
      clearInterval(updateInterval);
    };
  }, [path, pollForLeaderboard]);

  return (
    <div className="fixed inset-0 overflow-y-scroll bg-gradient-to-br from-yellow-400 to-rose-800">
      <div className="flex min-h-full items-center justify-center px-3 py-20">
        <div className="max-w-lg text-center">
          <motion.div
            className="absolute left-3 top-3 mx-auto inline-block rounded-full bg-rose-600"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
          >
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 text-xl font-medium text-white"
              aria-label="Back"
            >
              <ArrowLeft
                className="h-6 w-6"
                weight="bold"
                aria-label="Back Icon"
              />
            </Link>
          </motion.div>
          {
            <div>
              <h1 className="text-3xl font-bold text-white">
                The current standings...
              </h1>
              <div className="mt-3 flex flex-col items-center justify-center overflow-hidden rounded-xl border bg-white p-4">
                <h2 className="text-2xl font-medium">Leaderboard</h2>
                <table className="mx-auto w-full table-auto border-separate border-spacing-y-2 md:border-spacing-y-3">
                  <thead>
                    <tr className="text-gray-500">
                      <th className="w-36 text-center"></th>
                      <th className="w-96 text-right font-medium">Name</th>
                      <th className="w-64 text-center font-medium">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {games.map((game, index) => {
                      return (
                        <tr className="text-xl" key={index}>
                          <td className="text-left">{index + 1}.</td>
                          <td className="text-right">{game.lobbyUsername}</td>
                          <td>{game.points}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="mt-2">
                <MultiplayerReturnLink />
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  );
}
