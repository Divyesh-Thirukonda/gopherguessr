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
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

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

export default async function Play({ searchParams }) {
  const params = new URLSearchParams(await searchParams);
  const gameMode = params.get("gameMode");
  const cookieStore = await cookies();

  let curState = null;
  // TODO: this should be encrypted in the future to prevent people from playing games that are not their own
  const prismaCookie = cookieStore.get("prismaGameStateId");
  const prismaGameStateId = prismaCookie?.value;
  if (!prismaCookie) {
    // create db state if no cookie
    curState = await prisma.gameState.create({
      data: {},
      include: prismaGameStateInclude,
    });
    redirect(`/createprismacookie?id=${curState.id}&gameMode=${gameMode}`);
  } else {
    // if cookie exists, make sure it's valid
    curState = await prisma.gameState.findUnique({
      where: { id: parseInt(prismaGameStateId, 10) },
      include: prismaGameStateInclude,
    });
    // if not valid, make new state and create new cookie
    if (!curState) {
      curState = await prisma.gameState.create({
        data: {},
        include: prismaGameStateInclude,
      });
      redirect(`/createprismacookie?id=${curState.id}&gameMode=${gameMode}`);
    }
  }
  let filter = {
    OR: [
      { campus: "WestBank" },
      { campus: "EastBankCore" },
      { campus: "EastBankOuter" },
    ],
  };
  if (gameMode === "1") {
    console.log("YESSS");
    filter = { diffRating: "ONE" };
  } else if (gameMode === "2") {
    filter = { diffRating: "TWO" };
  } else if (gameMode === "3") {
    filter = { diffRating: "THREE" };
  } else if (gameMode === "St.Paul") {
    filter = { campus: "St.Paul" };
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
          gameStateId: parseInt(prismaGameStateId, 10),
          photoId: parseInt(possibleLocations[index].id, 10),
        },
      });
    });
    // update guess state after creating guesses
    curState = await prisma.gameState.findUnique({
      where: { id: parseInt(prismaGameStateId, 10) },
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
    }
    // make sure frontend has latest data
    revalidatePath("/play");
  }

  // SERVER ACTION
  async function clearGameState() {
    "use server";
    const cookieStore = await cookies();
    cookieStore.delete("prismaGameStateId");
    revalidatePath("/play");
    redirect(`/play?gameMode=${gameMode}`);
  }

  return (
    <GameView
      clearGameState={clearGameState}
      submitGuess={submitGuess}
      curState={curState}
    />
  );
}
