import prisma from "../_utils/db";
import { authorizeUserRoute } from "../_utils/userSession";

export default async function ProfileIndex() {
  const { session } = await authorizeUserRoute();
  const userInDB = await prisma.user.findFirst({
    where: { email: session.email },
  });

  const name = userInDB?.name || "Guest";
  const highScore = userInDB?.highScore || 0;

  // Fetch fun facts dynamically
  const totalPhotos = await prisma.photo.count({ where: { isApproved: true } });
  const highestScore = (
    await prisma.gameState.aggregate({ _max: { points: true } })
  )?._max.points || 0;
  const totalGamesPlayed = await prisma.gameState.count({
    where: { userId: userInDB?.id },
  });

  async function calculateStreaksAndFirstGame(userId) {
    // Fetch all games played by the user, sorted by date
    const games = await prisma.gameState.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" }, // Sort games by ascending date
      select: { createdAt: true },  // Only fetch the creation date
    });

    if (games.length === 0) {
      return {
        firstGame: "No games played yet",
        longestStreak: 0,
        timeElapsedSinceFirstGameDate: 0,
      };
    }

    // Calculate the first game date
    const firstGameDate = games[0].createdAt.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const timeElapsedSinceFirstGameDate = new Date() - new Date(firstGameDate);
    const millisecondsInOneDay = 1000 * 60 * 60 * 24;
    const elapsedDays = Math.floor(timeElapsedSinceFirstGameDate / millisecondsInOneDay);

    // Calculate streaks
    let longestStreak = 1;
    let currentStreak = 1;

    for (let i = 1; i < games.length; i++) {
      const previousDate = new Date(games[i - 1].createdAt);
      const currentDate = new Date(games[i].createdAt);

      // Calculate difference in days between consecutive games
      const diffInDays =
        (currentDate.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24);

      if (diffInDays === 1) {
        // If the games are exactly 1 day apart, increment the streak
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else if (diffInDays > 1) {
        // If there's a gap, reset the current streak
        currentStreak = 1;
      }
    }

    return {
      firstGame: firstGameDate,
      elapsedDays,
      longestStreak,
    };
  }

  const results = await calculateStreaksAndFirstGame(userInDB?.id);

  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-400 to-rose-800">
      {/* User Section */}
      <h1 className="text-2xl font-bold flex items-center justify-center text-white p-6">Welcome back, {name}!</h1>

      {/* Dashes */}
      <div className="flex items-center gap-4">
        <hr className="w-full border-dashed border-gray-400" />
        <span className="shrink-0 text-white">&darr;&nbsp;&nbsp;&nbsp;Statistics</span>
        <hr className="w-full border-dashed border-gray-400" />
      </div>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 gap-8 p-8 text-center max-w-5xl mx-auto">

        {/* Cards */}
        <div
          className="bg-black/50 backdrop-blur-md rounded-lg shadow-2xl p-6 text-white text-center"
        >
          {/* Title */}
          <div>
            <h3 className="text-rose-400 font-bold text-lg">XX</h3>
            <p className="text-6xl font-extrabold text-white">YY</p>
          </div>

          {/* Bottom Stats */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div>
              <p className="text-4xl font-bold">XX</p>
              <p className="text-sm text-gray-400">Avg Score</p>
            </div>
            <div>
              <p className="text-4xl font-bold">XX</p>
              <p className="text-sm text-gray-400">Highest Score</p>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-black/50 backdrop-blur-md rounded-lg shadow-2xl p-6 text-white text-center">
          <h3 className="text-gray-400 font-bold text-lg">🔥 Your Best Streak 🔥</h3>
          <p className="text-6xl font-extrabold text-white">{results.longestStreak}</p>
          <p className="text-sm text-gray-400 mt-2">Longest Consecutive Days Played</p>
        </div>

        <div className="bg-black/50 backdrop-blur-md rounded-lg shadow-2xl p-6 text-white text-center">
          <h3 className="text-gray-400 font-bold text-lg">First Game Played</h3>
          <p className="text-2xl font-bold text-white">{results.firstGame}</p>
          <p className="text-sm text-gray-400 mt-2">
            Where did the time go,{" "}
            {results.elapsedDays === 1
              ? "feels like it was just yesterday"
              : `feels like it was just ${results.elapsedDays} days ago} 🫠`}
          </p>
        </div>
      </div>

    </main>
  );
}