import prisma from "../_utils/db";
import { authorizeUserRoute } from "../_utils/userSession";

export default async function ProfileIndex() {
  const { session } = await authorizeUserRoute();
  const userInDB = await prisma.user.findFirst({
    where: { email: session.email },
  });

  return (
    <main>
      <div>
        <p>{"Thanks for joining Gopher Guessr, " + userInDB.name + "!"}</p>
      </div>
    </main>
  );
}
