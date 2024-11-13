/*
  What is this file?:
    A JavaScript script.
      It is in the folder /app/_utils (not in a specific route directory) because it could be used across our application.
      (utils is a common name for a folder to store things in a React project that aren't React Components).
      The underscore in _utils just means it's a private folder (think like a private method in Java)
      which prevents the user from ever being able to call it directly.
      Learn more here: 
        https://nextjs.org/docs/app/building-your-application/routing/colocation#private-folders
  What are we using this file for?:
    This is the function that returns the current user's isAdmin status in the database
*/

export default async function getDbIsAdmin() {
  const { session } = await authorizeUserRoute();
  const userInDB = await prisma.user.findFirst({
    where: { email: session.email },
  });

  // Retrieve DB isAdmin value for given user. No redirect because of wide use case
  return userInDB.isAdmin;
}
