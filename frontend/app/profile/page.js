import prisma from "../_utils/db";
import { authorizeUserRoute } from "../_utils/userSession";

export default async function ProfileIndex() {
  const { session } = await authorizeUserRoute();
  const userInDB = await prisma.user.findFirst({
    where: { email: session.email },
  });

  // ternary prevents errors with deleted/edited profiles
  const name = userInDB ? userInDB.name : "";
  const highScore = userInDB ? userInDB.highScore : 0;

  return (
    <main>
      <div>
        <p>{"Thanks for joining Gopher Guessr, " + name + "!"}</p>
        <p>{"Your current high score is " + highScore + " points."}</p>
      </div>
    </main>
  );
}
