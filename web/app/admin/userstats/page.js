// quick page to gather number of unique player ips throughout march
// we can update this whenever we want analytics

import prisma from "@/app/_utils/db";

export default async function PhotosIndex() {
  const games = await prisma.gameState.findMany({
    where: {
      createdAt: {
        gte: new Date("2025-03-01").toISOString(),
        lte: new Date("2025-03-30").toISOString(),
      },
    },
  });
  const rawPlayerCount = games.length;
  // array of ips
  const rawIps = games.map((game) => game.ip);
  const uniquePlayers = rawIps.filter((ip, index, arr) => {
    // check if ip was already in the arr before (so itll only get the first time a given ip was used)
    return arr.indexOf(ip) === index;
  });
  const uniquePlayerCount = uniquePlayers.length;
  const averageGames = Math.round(rawPlayerCount / uniquePlayerCount);

  return (
    <div className="p-3">
      <p>Games Played: {rawPlayerCount}</p>
      <p>Unique Players: {uniquePlayerCount}</p>
      <p>Average Games Per Player: {averageGames}</p>
    </div>
  );
}
