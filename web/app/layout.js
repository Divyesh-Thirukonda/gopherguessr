/*
  What is this file?:
    A Next.js Layout Component
      Next.js Layouts are where you put code that is shared across multiple pages.
      This is the root layout as it is in the root /app directory.
      Since this is the root layout, everything in this file will render across the entire app.
      This acts much like the _app.js and _document.js files in older versions of Next.js.
      Learn more here: 
        https://nextjs.org/docs/app/building-your-application/routing/layouts-and-templates
  Server component or client component?:
    Server Component
  What are we using this file for?:
    This is a convenient place to load our CSS library (Tailwind CSS) 
    and our fonts as both of those things are used throughout the entire app.
*/

import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./_fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./_fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Gopher Guessr",
  description: "A Geoguessr like game for the UMN Twin Cities campus.",
  verification: {
    google: "yq2e44lu7MiAx4VEYIYuWgBlNypf68sTJtbdXsHmppY",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
