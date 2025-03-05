import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import * as motion from "framer-motion/client";
import Link from "next/link";
import prisma from "../_utils/db";
import { redirect } from "next/navigation";

export default async function Join() {
  async function joinLobby(formData) {
    "use server";

    // Lobby code
    const stringCode = formData.get("code");

    if (!stringCode) {
      // No code
      redirect(`/join`);
    }

    const code = parseInt(stringCode, 10);

    if (isNaN(code)) {
      // Invalid code
      redirect(`/join`);
    } else {
      const lobbyGameId = await prisma.lobby.findFirst({
        where: { code: code },
      });

      if (!lobbyGameId) {
        // Valid integer code, but not an active lobby
        redirect(`/join`);
      }

      // Join lobby
      redirect(`/play?code=${code}`);
    }
  }

  return (
    <div className="fixed inset-0 overflow-y-scroll bg-gradient-to-br from-yellow-400 to-rose-800">
      <div className="flex min-h-full items-center justify-center px-3 py-20">
        <div className="max-w-lg text-center">
          <motion.div
            className="absolute left-3 top-3 mx-auto inline-block rounded-full bg-rose-600"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
          >
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 text-xl font-medium text-white"
              aria-label="Back"
            >
              <ArrowLeft
                className="h-6 w-6"
                weight="bold"
                aria-label="Back Icon"
              />
            </Link>
          </motion.div>

          {true && (
            <form
              action={joinLobby}
              className="relative mt-3 flex flex-col overflow-hidden rounded-xl border bg-white p-4 text-left"
            >
              <label
                htmlFor="code"
                className="mx-2 mb-1 text-center text-lg font-medium"
              >
                Join with the PIN on your host&apos;s screen!
              </label>
              <input
                name="code"
                id="code"
                className="mb-3 rounded border-gray-300 text-center"
                maxLength={6}
                placeholder="Game PIN"
              />
              <button
                type="submit"
                className="rounded bg-rose-600 p-3 font-medium text-white hover:bg-rose-700"
              >
                Enter
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
