/*
  What is this file?:
    A JavaScript script.
      It is in the folder /app/_utils (not in a specific route directory) because it is used across our application.
      (utils is a common name for a folder to store things in a React project that aren't React Components).
      The underscore in _utils just means it's a private folder (think like a private method in Java)
      which prevents the user from ever being able to call it directly.
      Learn more here: 
        https://nextjs.org/docs/app/building-your-application/routing/colocation#private-folders
  What are we using this file for?:
    This is boilerplate code that allows us to connect to our PostgresSQL database using Prisma ORM.
    Learn more here:
      https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/nextjs-prisma-client-dev-practices
    We will import this anywhere we need to connect to the Database.
*/

// This prevents us from accidentally importing this in a Client Component.
// Remember database calls should only be made on the server for security.
import "server-only";

import { PrismaClient } from "@prisma/client";

export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export default prisma;
