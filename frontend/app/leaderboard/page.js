import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import LeaderBoardWrapper from "./_components/LeaderBoardWrapper";

export default async function HomePage() {
  const cookieStore = await cookies();
  let isLoggedIn = false;

  const { email: email } = await getIronSession(cookieStore, {
    password: process.env.SESSION_SECRET,
    cookieName: "user_s",
  });

  if (email) {
    isLoggedIn = true;
  }

  return <LeaderBoardWrapper isLoggedIn={isLoggedIn} />;
}
