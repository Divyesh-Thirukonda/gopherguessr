import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import LeaderBoardWrapper from "./_components/LeaderBoardWrapper";
import prisma from "../_utils/db";

export default async function HomePage() {
  const cookieStore = await cookies();
  let isLoggedIn = false;

  let scoreData = await prisma.user.findMany();
  scoreData.sort((a, b) => (a.highScore > b.highScore ? -1 : 1));

  function anonymize(item) {
    if (item.email.charCodeAt(item.email.length - 1) <= 57) {
      item.name = "anonymous";
    }
  }

  scoreData.map((item) => anonymize(item));

  // Likely change
  scoreData = scoreData.slice(0, 10);

  const { email: email } = await getIronSession(cookieStore, {
    password: process.env.SESSION_SECRET,
    cookieName: "user_s",
  });

  if (email) {
    isLoggedIn = true;
  }

  return <LeaderBoardWrapper isLoggedIn={isLoggedIn} scoreData={scoreData} />;
}
