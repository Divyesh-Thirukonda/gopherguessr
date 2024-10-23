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
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import * as motion from "framer-motion/client";


export default function Login() {
  const router = useRouter();

  return (
    <main>
      {/* Main section with video */}
      <section className="relative min-h-dvh w-full">
        {/* <div className="absolute inset-0 video-background">
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
        </div> */}
        <div className="absolute inset-0 bg-gray-900 bg-opacity-80 backdrop-blur video-background"></div>
        <div className="absolute inset-0 flex items-center justify-center px-4 pb-20 pt-12">
          <div className="max-w-md text-center">
            <h1 className="text-5xl font-bold text-white">Get Started!</h1>
            <p className="mt-3 text-white">
              Sign up using your UMN Email!
            </p>
            <motion.div
              className="mx-auto mt-4 w-min rounded-full"
              whileHover={{ scale: 1.2 }}
            >
              <GoogleOAuthProvider clientId="711588679062-cei3he7ektr8buucb7p5nmpr4eltotju.apps.googleusercontent.com">
              <GoogleLogin
                onSuccess={credentialResponse => {
                  console.log(credentialResponse);
                  router.push('/play')
                }}
                onError={() => {
                  console.log('Login Failed');
                }}
              />
              </GoogleOAuthProvider>
            </motion.div>
          </div>
        </div>
      </section>
      <div className="absolute top-0 left-0 w-48 h-48 bg-purple-500 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-blue-500 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob animation-delay-2000"></div>
      <div className="absolute top-0 right-0 w-48 h-48 bg-pink-500 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob animation-delay-4000"></div>
    </main>
  );
};