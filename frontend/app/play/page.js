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
import Image from "next/image";
import { getUserSession } from "../_utils/userSession";
import { DateTime } from "luxon";

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
  const cookieStore = await cookies();

  let { id: gameStateId } = await getIronSession(cookieStore, {
    password: process.env.SESSION_SECRET,
    cookieName: "game_s",
  });

  // check if user is logged in and get user id if they are
  let userId = 29; // default user id
  const session = await getUserSession();
  // make sure not expired
  if (session.expiry > DateTime.now().toSeconds()) {
    const userInDB = await prisma.user.findFirst({
      where: { email: session.email },
    });
    if (userInDB) {
      userId = userInDB.id;
    }
  }

  let curState = null;
  if (gameStateId) {
    // check if game state is in the db
    curState = await prisma.gameState.findUnique({
      where: { id: parseInt(gameStateId, 10) },
      include: prismaGameStateInclude,
    });
    if (!curState) {
      // if not in db, create game state
      curState = await prisma.gameState.create({
        data: {
          userId,
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

  let filter = {
    OR: [
      { campus: "WestBank" },
      { campus: "EastBankCore" },
      { campus: "EastBankOuter" },
    ],
    isApproved: true,
  };
  if (gameMode === "1") {
    filter = { diffRating: "ONE", isApproved: true };
  } else if (gameMode === "2") {
    filter = { diffRating: "TWO", isApproved: true };
  } else if (gameMode === "3") {
    filter = { diffRating: "THREE", isApproved: true };
  } else if (gameMode === "St.Paul") {
    filter = { campus: "StPaul", isApproved: true };
  }
  // check if guesses initialized
  if (curState.guesses.length === 0) {
    // get all locations that are in the filter
    const possibleLocations = await prisma.photo.findMany({
      where: filter,
      select: { id: true },
    });
    // get 5 random indexes of the possibleLocations array
    const indexes = new Set();
    while (indexes.size !== 5) {
      indexes.add(Math.floor(Math.random() * possibleLocations.length));
    }
    // create Guess items in the db
    indexes.forEach(async (index) => {
      await prisma.guess.create({
        data: {
          gameStateId: parseInt(gameStateId, 10),
          photoId: parseInt(possibleLocations[index].id, 10),
        },
      });
    });
    // update guess state after creating guesses
    curState = await prisma.gameState.findUnique({
      where: { id: parseInt(gameStateId, 10) },
      include: prismaGameStateInclude,
    });
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
      const roundPoints =
        (500 - (roundDistance > 500 ? 500 : roundDistance)) * 2;
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

  return (
    <>
      <div className="pointer-events-none invisible fixed inset-0 h-dvh w-dvw">
        {/* preloading images for better perf */}
        {curState.guesses.map((guess) => (
          <div className="absolute inset-0" key={guess.photo.imageId}>
            <Image
              fill
              src={getFullUrl(guess.photo.imageId)}
              alt=""
              className="h-full w-full object-contain object-center"
              loading="eager"
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
      />
    </>
  );
}
