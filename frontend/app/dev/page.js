// page to link to all of our dev tools
// TODO: make sure to either remove this or put it behind authentication in prod

import Link from "next/link";

export default function DevTools() {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold">Dev Tools</h1>
      <Link
        href="/imageupload"
        className="mt-3 block text-xl text-blue-600 underline hover:text-blue-700"
      >
        Upload Images (/imageupload)
      </Link>
      <Link
        href="/imagetest"
        className="mt-3 block text-xl text-blue-600 underline hover:text-blue-700"
      >
        New Layout Mockup (/imagetest)
      </Link>
      <Link
        href="/photos"
        className="mt-3 block text-xl text-blue-600 underline hover:text-blue-700"
      >
        Map of all Current Photos (/photos)
      </Link>
    </div>
  );
}
