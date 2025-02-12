import { ArrowArcLeft, ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import * as motion from "framer-motion/client";
import Link from "next/link";
import { DateTime } from "luxon";
import prisma from "../_utils/db";
import { redirect } from "next/navigation";
import QRCode from "react-qr-code";
import Timer from "./_components/Timer";

export default async function Lobby({ searchParams }) {
  const params = new URLSearchParams(await searchParams);
  const code = params.get("code");

  // get currently running lobby game
  let curLobby = null;
  let timeLeft = null;
  if (code) {
    curLobby = await prisma.lobby.findUnique({
      where: { code: parseInt(code, 10) },
    });
    timeLeft =
      DateTime.fromJSDate(curLobby.completeBy).toMillis() -
      DateTime.now().toMillis();
  }

  // get leaderboard data (top 5)
  let games = null;
  if (curLobby) {
    games = await prisma.gameState.findMany({
      where: {
        lobbyId: curLobby.id,
      },
      include: {
        user: true,
      },
    });
    games.slice(0, 5);
    games.sort((a, b) => (a.points >= b.points ? -1 : 1));
  }

  async function createLobby(formData) {
    "use server";

    const time = parseInt(formData.get("time"), 10);

    // pick 5 locations

    // get all locations that are in minneapolis
    const possibleLocations = await prisma.photo.findMany({
      where: {
        OR: [
          { campus: "WestBank" },
          { campus: "EastBankCore" },
          { campus: "EastBankOuter" },
        ],
        isApproved: true,
      },
      select: { id: true },
    });

    // shuffle cause math.random isnt random enough?
    for (let i = 0; i < 30; i++) {
      for (let i = possibleLocations.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [possibleLocations[i], possibleLocations[j]] = [
          possibleLocations[j],
          possibleLocations[i],
        ];
      }
    }

    // get 5 random locations
    const indexes = new Set();
    while (indexes.size !== 5) {
      indexes.add(Math.floor(Math.random() * possibleLocations.length));
    }
    const photoIds = [];
    indexes.forEach((index) => photoIds.push(possibleLocations[index].id));

    // create 6 digit join code and check if used
    let code = null;
    let foundUnique = false;
    while (!foundUnique) {
      code = Math.floor(100000 + Math.random() * 900000);
      const lobbyWithCode = await prisma.lobby.findUnique({ where: { code } });
      if (!lobbyWithCode) {
        foundUnique = true;
      }
    }

    // create lobby in db
    const lobby = await prisma.lobby.create({
      data: {
        code,
        completeBy: DateTime.now().plus({ minutes: time }),
        photoIds,
      },
    });

    redirect(`/lobby?code=${lobby.code}`);
  }

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
          {!curLobby && (
            <div>
              <h1 className="text-3xl font-bold text-white">
                Create Multiplayer Lobby
              </h1>
              <p className="mt-1.5 text-gray-100">
                Play Gopher Guessr with friends!
                <br /> Currently, only the Minneapolis Game Mode is available.
              </p>
            </div>
          )}
          {curLobby && timeLeft <= 0 && (
            <div>
              <h1 className="text-3xl font-bold text-white">
                Time&apos;s up! Let&apos;s see how you did...
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
                          <td className="text-right">{game.user.name}</td>
                          <td>{game.points}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {curLobby && timeLeft > 0 && (
            <>
              <div className="mt-3 flex flex-col items-center justify-center overflow-hidden rounded-xl border bg-white">
                <div className="w-full bg-amber-400 py-2 text-lg font-medium">
                  <div className="ml-2 mr-2">
                    Join by Scanning this QR Code <br />
                    (manual code entry coming soon...)
                  </div>
                </div>
                <div className="px-3 py-4">
                  <QRCode
                    value={`${process.env.ROOT}/play?code=${curLobby.code}`}
                    size="200"
                  />
                </div>
              </div>
              <div className="mt-3 flex flex-col items-center justify-center overflow-hidden rounded-xl border bg-white p-4">
                <h2 className="text-2xl font-medium">Time Left</h2>
                <Timer
                  completeBy={curLobby.completeBy}
                  initTimeLeft={timeLeft}
                />
              </div>
            </>
          )}
          {!curLobby && (
            <form
              action={createLobby}
              className="relative mt-3 flex flex-col overflow-hidden rounded-xl border bg-white p-4 text-left"
            >
              <label htmlFor="time" className="mb-1 text-lg font-medium">
                Timer (in minutes)
              </label>
              <input
                name="time"
                id="time"
                type="number"
                defaultValue="5"
                min="1"
                max="15"
                className="mb-3 rounded border-gray-300"
              />
              <button
                type="submit"
                className="rounded bg-rose-600 p-3 font-medium text-white hover:bg-rose-700"
              >
                Create Lobby
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
