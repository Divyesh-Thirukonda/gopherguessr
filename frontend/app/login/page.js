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
import { useEffect, useState } from 'react';
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import * as motion from "framer-motion/client";




export default function Login() {
    const router = useRouter(); // Updated useRouter hook from next/navigation


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
            poster="/cacheable/umn-flyover-poster-20241021.webp"
          >
            <source
              src="/cacheable/umn-flyover-20241021.mp4"
              type="video/mp4"
            />
          </video>
        </div>
        <div className="absolute inset-0 bg-gray-900 bg-opacity-50 backdrop-blur video-background"></div>
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
              <GoogleOAuthProvider clientId= {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
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
    </main>
  );
};
