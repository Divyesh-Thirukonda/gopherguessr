import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import LeaderBoardWrapper from "./_components/LeaderBoardWrapper";
import prisma from "../_utils/db";

export default async function HomePage() {
  const cookieStore = await cookies();
  let isLoggedIn = false;

  // Make all not logged in users anonymous
  function anonymize(item) {
    if (item.email.charCodeAt(item.email.length - 1) <= 57) {
      item.email = "not logged in";
      item.name = "Guest";
    }
  }
  // Get top users and anonymize all guests
  let scoreData = await prisma.user.findMany();
  scoreData.sort((a, b) => (a.highScore > b.highScore ? -1 : 1));
  // Likely change based on # of users. Top 10 users
  scoreData = scoreData.slice(0, 10);
  scoreData.map((item) => anonymize(item));

  const { email: email } = await getIronSession(cookieStore, {
    password: process.env.SESSION_SECRET,
    cookieName: "user_s",
  });

  if (email) {
    isLoggedIn = true;
  }

  return <LeaderBoardWrapper isLoggedIn={isLoggedIn} scoreData={scoreData} />;
}
