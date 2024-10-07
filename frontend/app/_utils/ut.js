// this is a server utility for setting up uploadthing
// learn more about uploadthing: https://uploadthing.com

import "server-only";

import { UTApi } from "uploadthing/server";

export const utapi = new UTApi({ token: process.env.UPLOADTHING_TOKEN });
