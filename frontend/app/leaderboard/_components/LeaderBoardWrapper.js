"use client";

import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import * as motion from "framer-motion/client";
import Link from "next/link";
import Table from "./Table";

export default function LeaderBoardWrapper({ isLoggedIn }) {
  return (
    <main>
      <section className="relative min-h-dvh w-full">
        <div className="fixed inset-0">
          <video
            className="h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            poster="/cacheable/umn-flyover-poster-20241021.webp"
          >
            <source
              src="/cacheable/umn-flyover-20241021.mp4"
              type="video/mp4"
            />
          </video>
        </div>
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 backdrop-blur"></div>
        <div className="absolute inset-0 flex items-center justify-center px-4 pb-20 pt-12">
          <div className="max-w-md text-center">
            <Table />
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
          </div>
        </div>
      </section>
    </main>
  );
}
