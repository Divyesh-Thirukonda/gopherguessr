import prisma from "../_utils/db";
import { authorizeUserRoute } from "../_utils/userSession";
import GameStatsCarousel from "./_components/GameStatsCarousel";

export default async function ProfileIndex({ userId, publicView = false }) {
  const { session } = await authorizeUserRoute();
  let idToFetch = null;

  if (publicView) {
    idToFetch = userId;
  } else {
    let user = await prisma.user.findFirst({
      where: { email: session?.email },
    });
    idToFetch = user.id;
  }

  const userInDB = await prisma.user.findFirst({
    where: { id: idToFetch },
  });

  if (!userInDB) {
    return (
      <main className="flex h-screen items-center justify-center bg-gradient-to-br from-yellow-400 to-rose-800">
        <h1 className="p-6 text-center text-3xl font-bold text-white md:text-4xl">
          🔍 Hmm... <br /> The Profile You Are Looking For <br /> Does Not
          Exist...
        </h1>
      </main>
    );
  }

  const name = userInDB?.name || "Guest";

  const allStats = await fetchGameStats(userInDB?.id);
  const { easy: easyStats, medium: mediumStats, hard: hardStats } = allStats;

  // Helper function to fetch stats for a specific difficulty
  async function fetchGameStats(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        games: {
          include: {
            guesses: {
              include: {
                photo: true,
              },
            },
          },
        },
      },
    });

    const difficultyLevels = {
      ONE: { count: 0, scores: [], highest: 0 },
      TWO: { count: 0, scores: [], highest: 0 },
      THREE: { count: 0, scores: [], highest: 0 },
    };

    user.games.forEach((game) => {
      game.guesses.forEach((guess) => {
        if (guess.guessComplete) {
          const level = difficultyLevels[guess.photo.diffRating];
          if (level) {
            level.count++;
            level.scores.push(guess.points);
            level.highest = Math.max(level.highest, guess.points);
          }
        }
      });
    });

    const calculateAverage = (scores) =>
      scores.length
        ? scores.reduce((sum, score) => sum + score, 0) / scores.length
        : 0;

    return {
      easy: {
        numGames: difficultyLevels.ONE.count,
        highestScore: difficultyLevels.ONE.highest,
        avgScore: calculateAverage(difficultyLevels.ONE.scores),
      },
      medium: {
        numGames: difficultyLevels.TWO.count,
        highestScore: difficultyLevels.TWO.highest,
        avgScore: calculateAverage(difficultyLevels.TWO.scores),
      },
      hard: {
        numGames: difficultyLevels.THREE.count,
        highestScore: difficultyLevels.THREE.highest,
        avgScore: calculateAverage(difficultyLevels.THREE.scores),
      },
    };
  }

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

      {publicView && (
        <h1
          className="relative mx-auto mb-4 w-fit rounded-xl px-6 py-3 text-center text-3xl font-bold tracking-wide text-white shadow-[0_4px_12px_rgba(0,0,0,0.3)] backdrop-blur-lg"
          style={{
            backgroundImage: "linear-gradient(0deg, #ffffff, #bbbbbb)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            textShadow:
              "0 6px 5px rgba(255, 255, 255, 0.5), 0 0 15px rgba(121, 121, 121, 0.3)",
          }}
        >
          {name.replace(/ .*/, "")}&apos;s Profile
        </h1>
      )}

      {/* Dashes ... cool but not needed*/}
      {/* <div className="flex items-center gap-4">
        <hr className="w-full border-dashed border-gray-400" />
        <span className="shrink-0 text-white">
          &darr;&nbsp;&nbsp;&nbsp;Player Stats
        </span>
        <hr className="w-full border-dashed border-gray-400" />
      </div> */}

      {/* Statistics Section */}
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 p-8 text-center">
        <GameStatsCarousel
          easyStats={easyStats}
          mediumStats={mediumStats}
          hardStats={hardStats}
        />

        {/* Additional Information */}
        <div className="rounded-lg bg-black/50 p-6 text-center text-white shadow-2xl backdrop-blur-md">
          <h3 className="text-lg font-bold text-rose-400">Lifetime Points</h3>
          <p className="text-6xl font-extrabold text-white">
            {totalPointsEarned}
          </p>
          <p className="mt-2 text-sm text-gray-400">
            All points earned across every game you&apos;ve played!
          </p>
        </div>

        <div className="rounded-lg bg-black/50 p-6 text-center text-white shadow-2xl backdrop-blur-md">
          <h3 className="text-lg font-bold text-rose-400">
            🔥 Your Best Streak 🔥
          </h3>
          <p className="text-6xl font-extrabold text-white">
            {results.longestStreak}
          </p>
          <p className="mt-2 text-sm text-gray-400">Consecutive Days Played</p>
        </div>

        <div className="rounded-lg bg-black/50 p-6 text-center text-white shadow-2xl backdrop-blur-md">
          <h3 className="text-lg font-bold text-rose-400">First Game Played</h3>
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
