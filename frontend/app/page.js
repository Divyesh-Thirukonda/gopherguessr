/*
  What is this file?:
    A Next.js Page Component
      Next.js Pages are where you put code that is unique to a specific page.
      Since this file is located directly in the root /app directory, 
      it is what runs when you go to the root url (just like an index.html file).
      Think of it like a main() method in Java.
      Learn more here: 
        https://nextjs.org/docs/app/building-your-application/routing/pages
  Server component or client component?:
    Server Component
  What are we using this file for?:
    This is just our homepage. 
    I'm importing framer-motion so that we can animate the button, 
    but otherwise this is a pretty simple page with no extra logic.
*/
"use client"; // Enables client-side hooks

import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export const dynamic = "force-dynamic";

export default function Home() {
  // State to manage selected difficulty level
  const [selectedMode, setSelectedMode] = useState("");
  const [contributors, setContributors] = useState([]); // State for contributor data

  // Fetch contributors on mount
  useEffect(() => {
    async function fetchContributors() {
      const res = await fetch(
        "https://api.github.com/repos/Divyesh-Thirukonda/gopherguessr/contributors",
        { cache: "no-store" }
      );
      const data = await res.json();
      setContributors(data);
    }

    fetchContributors();
  }, []);

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
            ></source>
          </video>
        </div>
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 backdrop-blur"></div>
        <div className="absolute inset-0 flex items-center justify-center px-4 pb-20 pt-12">
          <div className="max-w-md text-center">
            <h1 className="text-5xl font-bold text-white">Explore The U!</h1>
            <p className="mt-3 text-white">
              Just like Geoguessr, but for the streets and buildings of the
              beautiful University of Minnesota campus!
            </p>

            {/* Difficulty selection dropdown */}
            <div className="flex items-center justify-center mt-4">
              <label className="mr-2 text-white">Select Difficulty:</label>
              <select
                value={selectedMode}
                onChange={(e) => setSelectedMode(e.target.value)}
                className="p-2 rounded bg-gray-200 text-black"
              >
                <option value="">All Difficulties</option>
                <option value="1">Easy</option>
                <option value="2">Medium</option>
                <option value="3">Hard</option>
              </select>
            </div>

            {/* Play button */}
            <motion.div
              className="mx-auto mt-4 w-min rounded-full bg-rose-600"
              whileHover={{ scale: 1.2 }}
            >
              <Link
                href={`/play?gameMode=${selectedMode}`} // Pass selectedMode in URL
                className="flex items-center px-4 py-2 text-2xl font-medium text-white"
              >
                Play
                <ArrowRight className="ml-1.5 h-6 w-6" weight="bold" />
              </Link>
            </motion.div>
            <motion.div
              className="mx-auto mt-4 w-48 rounded-full bg-rose-600"
              whileHover={{ scale: 1.2 }}
            >
              <Link
                href="/dev"
                className="flex items-center justify-center px-4 py-2 text-2xl font-medium text-white"
              >
                Dev Tools
                <ArrowRight className="ml-1.5 h-6 w-6" weight="bold" />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Contributors Section */}
        <div className="absolute left-0 right-0 top-[92dvh] p-6 text-center text-white">
          <div className="flex items-center gap-4">
            <hr className="w-full border-dashed border-gray-400" />
            <span className="shrink-0">
              &darr;&nbsp;&nbsp;&nbsp;Contributors
            </span>
            <hr className="w-full border-dashed border-gray-400" />
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            {contributors.map((contributor) => (
              <div key={contributor.id} className="relative">
                <a
                  href={`https://github.com/${contributor.login}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src={contributor.avatar_url}
                    alt={contributor.login}
                    width={60}
                    height={60}
                    className="rounded-full border-2 border-white"
                  />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}