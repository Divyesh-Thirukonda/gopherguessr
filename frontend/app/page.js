import { getIronSession } from "iron-session";
import HomeWrapper from "./_components/HomeWrapper";
import prisma from "./_utils/db";
import { cookies } from "next/headers";

export default async function HomePage() {
  // fetch contributors on server
  const res = await fetch(
    "https://api.github.com/repos/Divyesh-Thirukonda/gopherguessr/contributors",
    { next: { revalidate: 60 * 60 * 24 } }, // cache contributors data for 24 hours to prevent hitting rate limit
  );
  const contributors = await res.json();

  // check if user has a current game
  const cookieStore = await cookies();
  let inProgressGame = false;
  let isLoggedIn = false;

  const { id: gameStateId } = await getIronSession(cookieStore, {
    password: process.env.SESSION_SECRET,
    cookieName: "game_s",
  });

  const { email: email } = await getIronSession(cookieStore, {
    password: process.env.SESSION_SECRET,
    cookieName: "user_s",
  });

  if (email) {
    isLoggedIn = true;
  }

  if (gameStateId) {
    const curState = await prisma.gameState.findUnique({
      where: { id: parseInt(gameStateId, 10) },
    });
    if (curState) inProgressGame = true;
  }

  async function clearGameState() {
    "use server";
    const cookieStore = await cookies();
    cookieStore.delete("game_s");
  }

  return (
    <HomeWrapper
      clearGameState={clearGameState}
      contributors={contributors}
      inProgressGame={inProgressGame}
      isLoggedIn={isLoggedIn}
    />
  );
}
