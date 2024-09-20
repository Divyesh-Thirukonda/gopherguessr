import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import * as motion from "framer-motion/client";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <section className="relative min-h-dvh w-full">
        <div className="absolute inset-0">
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
        <div className="absolute inset-0 bg-gray-900 bg-opacity-50 backdrop-blur"></div>
        <div className="absolute inset-0 flex items-center justify-center px-4 pb-20 pt-12">
          <div className="max-w-md text-center">
            <h1 className="text-5xl font-bold text-white">Explore The U!</h1>
            <p className="mt-3 text-white">
              Just like Geoguessr, but for the streets and buildings of the
              beautiful University of Minnesota campus.
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
        <small className="absolute bottom-0 left-0 right-0 p-2 text-center text-white">
          Built by Social Coding.
        </small>
      </section>
    </main>
  );
}
