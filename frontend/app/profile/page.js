import prisma from "../_utils/db";
import { authorizeUserRoute } from "../_utils/userSession";
import GameStatsCarousel from "./_components/GameStatsCarousel";

export default async function ProfileIndex() {
  const { session } = await authorizeUserRoute();
  const userInDB = await prisma.user.findFirst({
    where: { email: session.email },
  });

  const name = userInDB?.name || "Guest";

  // Fetching stats for each difficulty mode (ONE, TWO, THREE)
  const allStats = await getGameStats(userInDB?.id);
  const easyStats = allStats.easy;
  const mediumStats = allStats.medium;
  const hardStats = allStats.hard;

  // Helper function to fetch stats for each difficulty
  async function getGameStats(userId) {
    const easyGames = await fetchGameStats(userId, "ONE");
    const mediumGames = await fetchGameStats(userId, "TWO");
    const hardGames = await fetchGameStats(userId, "THREE");

    return { easy: easyGames, medium: mediumGames, hard: hardGames };
  }

  // Helper function to fetch stats for a specific difficulty
  async function fetchGameStats(userId, difficulty) {
    const gameStates = await prisma.gameState.findMany({
      where: {
        userId,
        guesses: {
          some: {
            photo: {
              diffRating: difficulty,
            },
          },
        },
      },
      include: {
        guesses: {
          include: {
            photo: true,
          },
        },
      },
    });

    const numGames = gameStates.length;
    const allScores = [];
    let highestScore = 0;

    gameStates.forEach((gameState) => {
      gameState.guesses.forEach((guess) => {
        if (guess.photo.diffRating === difficulty) {
          allScores.push(guess.points);
          highestScore = Math.max(highestScore, guess.points);
        }
      });
    });

    const avgScore = allScores.length
      ? allScores.reduce((acc, score) => acc + score, 0) / allScores.length
      : 0;

    return { numGames, highestScore, avgScore };
  }

  const highScore = userInDB?.highScore || 0;

  // Fetch fun facts dynamically
  const totalPhotos = await prisma.photo.count({ where: { isApproved: true } });
  const highestScore =
    (await prisma.gameState.aggregate({ _max: { points: true } }))?._max
      .points || 0;
  const totalGamesPlayed = await prisma.gameState.count({
    where: { userId: userInDB?.id },
  });

  async function calculateStreaksAndFirstGame(userId) {
    // Fetch all games played by the user, sorted by date
    const games = await prisma.gameState.findMany({
      where: { userId, complete: true },
      orderBy: { createdAt: "asc" }, // Sort games by ascending date
      select: { createdAt: true }, // Only fetch the creation date
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
    const elapsedDays = Math.floor(
      timeElapsedSinceFirstGameDate / millisecondsInOneDay,
    );

    // Calculate streaks
    let longestStreak = 1;
    let currentStreak = 1;

    var previousDate = new Date(games[0].createdAt).getDate();

    for (let i = 1; i < games.length; i++) {
      const currentDate = new Date(games[i].createdAt).getDate();

      if (currentDate - previousDate === 1) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
        previousDate = new Date(games[i].createdAt).getDate();
      } else if (currentDate - previousDate > 1) {
        // If there's a gap, reset the current streak
        currentStreak = 1;
        previousDate = new Date(games[i].createdAt).getDate();
      }
    }

    return {
      firstGame: firstGameDate,
      elapsedDays,
      longestStreak,
    };
  }

  const results = await calculateStreaksAndFirstGame(userInDB?.id);

  const totalPoints = await prisma.gameState.aggregate({
    where: { userId: userInDB?.id },
    _sum: { points: true }, // Calculate the sum of points
  });
  const totalPointsEarned = totalPoints._sum.points || 0;

  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-400 to-rose-800">
      {/* User Section */}
      <h1 className="flex items-center justify-center p-6 text-2xl font-bold text-white">
        Welcome back, {name.replace(/ .*/, "")}!
      </h1>

      {/* Dashes */}
      <div className="flex items-center gap-4">
        <hr className="w-full border-dashed border-gray-400" />
        <span className="shrink-0 text-white">
          &darr;&nbsp;&nbsp;&nbsp;Statistics
        </span>
        <hr className="w-full border-dashed border-gray-400" />
      </div>

      {/* Statistics Section */}
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 p-8 text-center">
        <GameStatsCarousel
          easyStats={easyStats}
          mediumStats={mediumStats}
          hardStats={hardStats}
        />

        {/* Additional Information */}
        <div className="rounded-lg bg-black/50 p-6 text-center text-white shadow-2xl backdrop-blur-md">
          <h3 className="text-lg font-bold text-gray-400">Lifetime Points</h3>
          <p className="text-6xl font-extrabold text-white">
            {totalPointsEarned}
          </p>
          <p className="mt-2 text-sm text-gray-400">
            All points earned across every game you&apos;ve played!
          </p>
        </div>

        <div className="rounded-lg bg-black/50 p-6 text-center text-white shadow-2xl backdrop-blur-md">
          <h3 className="text-lg font-bold text-gray-400">
            🔥 Your Best Streak 🔥
          </h3>
          <p className="text-6xl font-extrabold text-white">
            {results.longestStreak}
          </p>
          <p className="mt-2 text-sm text-gray-400">Consecutive Days Played</p>
        </div>

        <div className="rounded-lg bg-black/50 p-6 text-center text-white shadow-2xl backdrop-blur-md">
          <h3 className="text-lg font-bold text-gray-400">First Game Played</h3>
          <p className="text-6xl font-bold text-white">{results.firstGame}</p>
          <p className="mt-2 text-sm text-gray-400">
            Where did the time go,{" "}
            {results.elapsedDays === 1
              ? "feels like it was just yesterday"
              : `feels like it was just ${results.elapsedDays} days ago...`}
          </p>
        </div>
      </div>
    </main>
  );
}
