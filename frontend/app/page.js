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

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import * as motion from "framer-motion/client";
import Link from "next/link";
import Image from "next/image";

// Keep contributor info fresh
export const dynamic = "force-dynamic";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [blurAmount, setBlurAmount] = useState(0);
  const [isMounted, setIsMounted] = useState(false); // Track component mount status
  const router = useRouter(); // Updated useRouter hook from next/navigation

  useEffect(() => {
    setIsMounted(true); // Mark the component as mounted
  }, []);

  const handlePlayClick = async (e) => {
    e.preventDefault(); // Prevent default link behavior
    if (!isMounted) return; // Avoid running if the component isn't mounted yet

    setIsLoading(true); // Set loading state to true

    // Simulate the background blur effect (increase over time)
    let blurInterval = setInterval(() => {
      setBlurAmount((prev) => {
        if (prev >= 10) {
          clearInterval(blurInterval);
          return prev;
        }
        return prev + 1; // Slowly increase blur amount
      });
    }, 100);

    router.push("/play"); // Navigate to the play page
  };

  // Fetch contributors
  const fetchContributors = async () => {
    const res = await fetch(
      "https://api.github.com/repos/Divyesh-Thirukonda/gopherguessr/contributors",
      { cache: "no-store" },
    );
    return await res.json();
  };

  const [contributors, setContributors] = useState([]);

  useEffect(() => {
    fetchContributors().then(setContributors);
  }, []);

  return (
    <main
      className={`${isLoading && "animate-[loadBlur_1s_ease-in-out_forwards]"}`}
    >
      {/* Main section with video */}
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
            <h1 className="text-5xl font-bold text-white">Explore The U!</h1>
            <p className="mt-3 text-white">
              Just like Geoguessr, but for the streets and buildings of the
              beautiful University of Minnesota campus!
            </p>
            <motion.div
              className="mx-auto mt-4 w-min rounded-full bg-rose-600"
              whileHover={{ scale: 1.2 }}
            >
              <a
                href="/play"
                onClick={handlePlayClick}
                className="flex items-center px-4 py-2 text-2xl font-medium text-white"
              >
                Play
                <ArrowRight className="ml-1.5 h-6 w-6" weight="bold" />
              </a>
            </motion.div>
            <motion.div
              className="mx-auto mt-4 inline-block rounded-full bg-rose-600"
              whileHover={{ scale: 1.2 }}
            >
              <Link
                href="/admin"
                className="inline-flex items-center px-4 py-2 text-2xl font-medium text-white"
              >
                Admin
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
            {contributors?.map((contributor) => (
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

      {/* Loading */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" />
      )}
    </main>
  );
}
