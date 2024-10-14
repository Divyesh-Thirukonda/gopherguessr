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
    This is essentially a temporary database (using JavaScript objects).
    We import this anywhere we would need the real database.
    Because objects are pointers (just like in Java),
    we can import this in multiple places and it will update the original values.
*/

// This prevents us from accidentally importing this in a Client Component.
// Even though this is a fake "Database" we should still follow best practice and not run Database queries on the client.
import "server-only";

// this basically is an in-memory db that stores the game state until we get an actual db working
// i have no idea how to use mongodb lol
const gameState = {
  loc: null,
  allLocsUsed: [],
  lastGuessD: 0,
  lastGuessPoints: 0,
  round: 1,
  points: 0,
  complete: false,
  gameStarted: false,
  lastGuessLat: 0,
  lastGuessLng: 0,
  allGuessesUsed: [],
};

export { gameState };
