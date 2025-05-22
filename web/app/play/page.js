/*
  What is this file?:
    A Next.js Page Component
      Next.js Pages are where you put code that is unique to a specific page.
      Since this file is located in the /app/play folder,
      it is what runs when you go to the /play URL in the browser.
      Think of it like a main() method in Java.
      Learn more here: 
        https://nextjs.org/docs/app/building-your-application/routing/pages
  Server component or client component?:
    Server Component
  What are we using this file for?:
    Since this is a Server Component, 
    we are using it to run our server-side logic.
    This includes fetching locations from our temporary "database",
    and processing the user's guess (using a Server Action).
    If our map didn't require interactivity, 
    we could put all of our HTML in the return of the function and render our map UI directly in this file,
    but since our map needs to be interactive, 
    we import a Client Component (MapWrapper) that takes care of actually rendering the map UI.
*/

import { revalidatePath } from "next/cache";
import latlngToMeters from "../_utils/latlngToMeters";
import prisma from "../_utils/db";
import GameView from "./_components/GameView";
import { cookies } from "next/headers";
import { getIronSession, sealData } from "iron-session";
import { getUserSession } from "../_utils/userSession";
import { DateTime } from "luxon";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { publishMessage } from "../api_leaderboard/kafkas/kafkas.js";

export const dynamic = "force-dynamic";

const prismaGameStateInclude = {
  guesses: {
    include: {
      photo: {
        select: {
          id: true,
          imageId: true,
          latitude: true,
          longitude: true,
        },
      },
    },
    orderBy: {
      id: "asc",
    },
  },
};

function getFullUrl(id) {
  return `https://utfs.io/a/e9dxf42twp/${id}`;
}

export default async function Play({ searchParams }) {
  const params = new URLSearchParams(await searchParams);
  const gameMode = params.get("gameMode");
  const code = params.get("code");
  const isTimed = params.get("isTimed") || "false";
  const cookieStore = await cookies();
  const headersList = await headers();
  const ip =
    process.env.NODE_ENV === "production"
      ? headersList.get("X-Real-IP")
      : "127.0.0.1";

  let { id: gameStateId } = await getIronSession(cookieStore, {
    password: process.env.SESSION_SECRET,
    cookieName: "game_s",
  });

  // check if user is logged in and get user id if they are
  let userId = 29; // default user
  let userInDB = null;
  const session = await getUserSession();
  // make sure not expired
  if (session.expiry > DateTime.now().toSeconds()) {
    userInDB = await prisma.user.findFirst({
      where: { email: session.email },
    });
    if (userInDB) {
      userId = userInDB.id;
    }
  }

  // check if code is part of an active lobby
  let curLobby = null;
  if (code) {
    curLobby = await prisma.lobby.findUnique({
      where: { code: parseInt(code, 10) },
    });
    if (
      DateTime.fromJSDate(curLobby.completeBy).toSeconds() <=
      DateTime.now().toSeconds()
    ) {
      // expired
      curLobby = null;
    }
  }

  // for storing gamemode in db (converting to the enum)
  let dbGameMode = null;
  switch (gameMode) {
    case "1":
      dbGameMode = "Easy";
      break;
    case "2":
      dbGameMode = "Medium";
      break;
    case "3":
      dbGameMode = "Hard";
      break;
    case "stpaul":
      dbGameMode = "StPaul";
      break;
    case "all":
      dbGameMode = "All";
      break;
    default:
      dbGameMode = "Minneapolis";
      break;
  }

  let curState = null;
  if (gameStateId) {
    // check if game state is in the db
    curState = await prisma.gameState.findUnique({
      where: { id: parseInt(gameStateId, 10) },
      include: prismaGameStateInclude,
    });
    // if the current game is not the lobby game, reset the current game
    if (curState && curLobby && curState.lobbyId !== curLobby.id) {
      curState = null;
    }
    if (!curState) {
      // if not in db, create game state
      curState = await prisma.gameState.create({
        data: {
          userId,
          lobbyId: curLobby ? curLobby.id : null,
          gameMode: dbGameMode,
          ip,
        },
        include: prismaGameStateInclude,
      });
      gameStateId = curState.id;
    }
  } else {
    // if no session stored in browser, create game state
    curState = await prisma.gameState.create({
      data: {
        userId,
        lobbyId: curLobby ? curLobby.id : null,
        gameMode: dbGameMode,
        ip,
      },
      include: prismaGameStateInclude,
    });
    gameStateId = curState.id;
  }

  // to persist state in browser as session cookie
  const sealedSession = await sealData(
    { id: curState.id },
    {
      password: process.env.SESSION_SECRET,
    },
  );

  if (curLobby) {
    // use lobby locations
    if (curState.guesses.length === 0) {
      // create guess items in db
      for (const photoId of curLobby.photoIds) {
        await prisma.guess.create({
          data: {
            gameStateId: parseInt(gameStateId, 10),
            photoId,
          },
        });
      }
      // update guess state after creating guesses
      curState = await prisma.gameState.findUnique({
        where: { id: parseInt(gameStateId, 10) },
        include: prismaGameStateInclude,
      });
    }
  } else {
    // for generating locations
    let filter = {
      OR: [
        { campus: "WestBank" },
        { campus: "EastBankCore" },
        { campus: "EastBankOuter" },
      ],
      isApproved: true,
    };
    if (gameMode === "1") {
      filter = {
        diffRating: "ONE",
        OR: [
          { campus: "WestBank" },
          { campus: "EastBankCore" },
          { campus: "EastBankOuter" },
        ],
        isApproved: true,
      };
    } else if (gameMode === "2") {
      filter = {
        diffRating: "TWO",
        OR: [
          { campus: "WestBank" },
          { campus: "EastBankCore" },
          { campus: "EastBankOuter" },
        ],
        isApproved: true,
      };
    } else if (gameMode === "3") {
      filter = { diffRating: "THREE", isApproved: true };
    } else if (gameMode === "stpaul") {
      filter = { campus: "StPaul", isApproved: true };
    } else if (gameMode === "all") {
      filter = { isApproved: true };
    }
    // check if guesses initialized
    if (curState.guesses.length === 0) {
      // get all locations that are in the filter
      const possibleLocations = await prisma.photo.findMany({
        where: {
          ...filter,
          isApproved: true, // This makes sure the isApproved filter is always true and the other filters are not ignored
        },
        select: { id: true },
      });

      // shuffle possibleLocations array thirty times
      for (let i = 0; i < 30; i++) {
        for (let i = possibleLocations.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [possibleLocations[i], possibleLocations[j]] = [
            possibleLocations[j],
            possibleLocations[i],
          ];
        }
      }

      // get 5 random indexes of the possibleLocations array
      const indexes = new Set();
      while (indexes.size !== 5) {
        indexes.add(Math.floor(Math.random() * possibleLocations.length));
      }
      // create Guess items in the db
      for (const index of indexes) {
        await prisma.guess.create({
          data: {
            gameStateId: parseInt(gameStateId, 10),
            photoId: parseInt(possibleLocations[index].id, 10),
          },
        });
      }
      // update guess state after creating guesses
      curState = await prisma.gameState.findUnique({
        where: { id: parseInt(gameStateId, 10) },
        include: prismaGameStateInclude,
      });
    }
  }

  // sanitize latitude and longitude data for guesses that havent been made yet
  curState.guesses = curState.guesses.slice(0, 5);
  curState.guesses.forEach((guess) => {
    if (!guess.guessComplete) {
      guess.photo.longitude = null;
      guess.photo.latitude = null;
    }
  });
  // inject current guess, completed guesses, last guess data for easier parsing on frontend
  curState.curGuess = curState.guesses[curState.round - 1];
  curState.completedGuesses = curState.guesses.filter(
    (guess) => guess.guessComplete,
  );
  curState.lastGuess =
    curState.completedGuesses[curState.completedGuesses.length - 1];

  // SERVER ACTION
  async function persistGameState() {
    "use server";
    const cookieStore = await cookies();
    // persist as cookie
    cookieStore.set("game_s", sealedSession, {
      path: "/",
    });
  }

  // SERVER ACTION
  async function submitGuess(guess) {
    "use server";
    // don't let users submit twice
    if (!curState.curGuess || !curState.curGuess?.guessComplete) {
      // get full photo/location data
      const photo = await prisma.photo.findUnique({
        where: { id: curState.curGuess.photo.id },
      });
      // calculate distance from guess and points
      const roundDistance = latlngToMeters(
        guess[0],
        guess[1],
        photo.latitude,
        photo.longitude,
      );

      const maxDistance = 1000;
      const minDistance = 5;

      // Ensure roundDistance is within bounds
      const clampedDistance = Math.min(
        Math.max(roundDistance, minDistance),
        maxDistance,
      );

      // Normalize the distance to [0, 1] for logarithmic scaling
      const normalizedDistance =
        (clampedDistance - minDistance) / (maxDistance - minDistance);

      // Apply a logarithmic scale
      const logValue = Math.log(1 + normalizedDistance * 9); // Base-e logarithm scaled over [1, 10]

      // Map logarithmic scale to the points range [1000, 0]
      const roundPoints = Math.ceil(1000 * (1 - logValue / Math.log(10)));

      // update in db
      await prisma.guess.update({
        where: { id: curState.curGuess.id },
        data: {
          guessComplete: true,
          latitude: guess[0],
          longitude: guess[1],
          distance: roundDistance,
          points: roundPoints,
        },
      });
      await prisma.gameState.update({
        where: { id: curState.id },
        data: {
          points: curState.points + roundPoints,
          started: true,
          round: curState.round + 1,
          complete: curState.round === 5,
        },
      });

      if (curLobby) {
        const value = JSON.stringify({
          lobbyUsername: curState.lobbyUsername,
          points: curState.points + roundPoints,
        });

        publishMessage("multiplayer_guesses", curLobby.id.toString(), value);
      }

      // NOTE:
      // Eventually, we will want specific high scores for game modes / difficulties

      // update user (or default user) high score
      if (curState.round === 5 && curState.userId !== 29) {
        const userInDB = await prisma.user.findFirst({
          where: { id: curState.userId },
        });

        // update db only if new score is higher
        if (userInDB.highScore < curState.points + roundPoints) {
          await prisma.user.update({
            where: { id: curState.userId },
            data: {
              highScore: curState.points + roundPoints,
            },
          });
        }
      }

      // make sure frontend has latest data
      revalidatePath("/play");
    }
  }

  // SERVER ACTION
  async function clearGameState() {
    "use server";
    const cookieStore = await cookies();
    cookieStore.delete("game_s");
  }

  // SERVER ACTION
  async function goHome() {
    "use server";
    const cookieStore = await cookies();
    cookieStore.delete("game_s");
    redirect("/");
  }

  // SERVER ACTION
  async function setName(formData) {
    // this is only in use for multiplayer lobbies for now
    // if we implement this for regular games we should have some sort of profanity filter on the names
    "use server";
    if (curLobby) {
      await prisma.gameState.update({
        where: {
          id: curState.id,
        },
        data: {
          lobbyUsername: formData.get("name"),
        },
      });
      revalidatePath("/play");
    } else {
      await goHome();
    }
  }

  // remove user email addresses from client payload
  function anonymize(item) {
    item.email = null;
  }
  // Get top users and anonymize all guests
  let scoreData = await prisma.user.findMany();
  scoreData.sort((a, b) => (a.highScore > b.highScore ? -1 : 1));
  // Likely change based on # of users. Top 10 users
  scoreData = scoreData.slice(0, 10);
  scoreData.map((item) => anonymize(item));

  return (
    <>
      <div className="pointer-events-none invisible fixed inset-0 h-dvh w-dvw">
        {/* preloading images for better perf */}
        {curState.guesses.map((guess) => (
          <div className="absolute inset-0" key={guess.photo.imageId}>
            <img
              src={getFullUrl(guess.photo.imageId)}
              alt=""
              className="mx-auto h-full w-full object-contain"
            />
          </div>
        ))}
      </div>
      <GameView
        clearGameState={clearGameState}
        submitGuess={submitGuess}
        curState={curState}
        key={curState.id}
        persistGameState={persistGameState}
        goHome={goHome}
        curLobby={curLobby}
        scoreData={scoreData}
        isLoggedIn={userInDB}
        isTimed={isTimed.toLowerCase() === "true"}
        gameMode={gameMode}
      />
      {curLobby && !curState.lobbyUsername && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-white bg-opacity-50 backdrop-blur-md">
          <form
            action={setName}
            className="relative mx-3 flex w-full max-w-md flex-col overflow-hidden rounded-xl border bg-white p-4 text-left"
          >
            <p className="mb-3 text-xl font-semibold">
              Set your name for the leaderboard!
            </p>
            <label htmlFor="name" className="mb-1 text-lg font-medium">
              Name
            </label>
            <input
              name="name"
              id="name"
              type="text"
              className="mb-3 rounded border-gray-300"
              autoFocus
            />
            <button
              type="submit"
              className="rounded bg-rose-600 p-3 font-medium text-white hover:bg-rose-700"
            >
              Continue
            </button>
          </form>
        </div>
      )}
    </>
  );
}
