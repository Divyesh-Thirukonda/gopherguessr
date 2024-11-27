"use client";

import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import * as motion from "framer-motion/client";
import Link from "next/link";
import Table from "./Table";
import { ArrowArcLeft } from "@phosphor-icons/react";

export default function LeaderBoardWrapper({ isLoggedIn, scoreData }) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-400 to-rose-800">
      <div className="absolute inset-0 flex items-center justify-center px-4 pb-20 pt-12">
        <div className="max-w-md text-center">
          <Table scoreData={scoreData} />
          <motion.div
            className="absolute right-0 top-0 mx-auto mr-3 mt-4 inline-block rounded-full bg-rose-600"
            whileHover={{ scale: 1.1 }}
          >
            <Link
              href="/login"
              className="inline-flex items-center px-4 py-2 text-2xl font-medium text-white"
            >
              {isLoggedIn ? "Profile" : "Login"}
              <ArrowRight className="ml-1.5 h-6 w-6" weight="bold" />
            </Link>
          </motion.div>
          <motion.div
            className="absolute left-0 top-0 mx-auto ml-3 mt-4 inline-block rounded-full bg-rose-600"
            whileHover={{ scale: 1.1 }}
          >
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 text-2xl font-medium text-white"
            >
              Home
              <ArrowArcLeft className="ml-1.5 h-6 w-6" weight="bold" />
            </Link>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
