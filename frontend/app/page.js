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
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import * as motion from "framer-motion/client";
import Link from "next/link";
import Image from "next/image";

// Function to fetch contributors data from GitHub
async function fetchContributors() {
  const res = await fetch("https://api.github.com/repos/Divyesh-Thirukonda/gopherguessr/contributors");
  const contributors = await res.json();
  return contributors;
}

export default async function Home() {
  const contributors = await fetchContributors();  // FIX THIS

  return (
    <main>
      {/* Main section with video */}
      <section className="relative min-h-dvh w-full">
        <div className="fixed inset-0">
          <video
            className="h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          >
            <source
              src="/videos/placeholder-drone-footage.mp4"
              type="video/mp4"
            ></source>
          </video>
        </div>
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur"></div>
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
              <Link
                href="/play"
                className="flex items-center px-4 py-2 text-2xl font-medium text-white"
              >
                Play
                <ArrowRight className="ml-1.5 h-6 w-6" weight="bold" />
              </Link>
            </motion.div>
          </div>
        </div>
        
        {/* Contributors Section */}
        <div className="-bottom-36 absolute left-0 right-0 p-6 text-center text-white">
          <hr className="border-white w-full mb-4" />
          <h2 className="text-2xl font-bold">Contributors</h2>
          <div className="mt-4 flex justify-center gap-4">
            {contributors.map((contributor) => (
              <div key={contributor.id} className="relative">
                <a href={`https://github.com/${contributor.login}`} target="_blank" rel="noopener noreferrer">
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
