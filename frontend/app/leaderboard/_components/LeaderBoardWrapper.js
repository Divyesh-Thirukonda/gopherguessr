"use client";

import { ArrowLeft, SignIn, UserCircle } from "@phosphor-icons/react/dist/ssr";
import * as motion from "framer-motion/client";
import Link from "next/link";
import Table from "./Table";

export default function LeaderBoardWrapper({ isLoggedIn, scoreData }) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-400 to-rose-800">
      <div className="absolute inset-0 flex items-center justify-center px-4 pb-20 pt-12">
        <div className="max-w-lg text-center">
          <Table scoreData={scoreData} isLoggedIn={isLoggedIn} />
          <motion.div
            className="absolute right-3 top-3 mx-auto inline-block rounded-full bg-rose-600"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
          >
            <Link
              href="/login"
              className="inline-flex items-center px-4 py-2 text-xl font-medium text-white"
              aria-label="Login"
            >
              {isLoggedIn ? (
                <UserCircle
                  className="h-6 w-6"
                  weight="bold"
                  aria-label="Profile Icon"
                />
              ) : (
                <>
                  <span>Login</span>
                  <SignIn className="ml-1.5 h-6 w-6" weight="bold" />
                </>
              )}
            </Link>
          </motion.div>
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
        </div>
      </div>
    </main>
  );
}
