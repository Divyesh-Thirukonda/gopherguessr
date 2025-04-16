"use client";

import { useState, useEffect } from "react";

// banner promoting photo uploads
export default function PhotoUploadBanner() {
  // Add anything in here
  const picturePrompts = [
    "Make GopherGuessr even better! ",
    "Think you've found a tricky spot? ",
    "Want to stump your fellow Gophers? ",
    "Got pics of Dinkytown? ",
    "Camera roll getting full? ",
    "Help build GopherGuessr! ",
  ];

  const [showBanner, setShowBanner] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * picturePrompts.length);
    setPhotoIndex(randomIndex);
    setShowBanner(true);
  }, []);

  function handleBannerClose() {
    setShowBanner(false);
  }

  if (!showBanner) return null;

  return (
    <div className="animate-fade-up fixed bottom-0 start-0 z-50 flex w-full justify-between bg-amber-400 p-5">
      <div className="mx-auto flex items-center">
        <p className="flex items-center text-lg font-normal text-gray-900">
          <span className="mb-2 mr-2 text-2xl">📸</span>
          <span className="text-lg">
            {picturePrompts[photoIndex]}
            <a
              href="https://gopher.nimbus.page/public_upload"
              className="text-md ms-0 font-medium text-rose-700 hover:underline md:ms-1 dark:text-blue-500"
            >
              Upload your photos!{" "}
              <svg
                className="ms-2 inline-block h-3 w-3 rtl:rotate-180"
                aria-hidden="true"
                xmlns="https://gopher.nimbus.page/public_upload"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </svg>
            </a>
          </span>
        </p>
      </div>
      <div className="flex items-center">
        <button
          type="button"
          onClick={handleBannerClose}
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg p-1.5 text-sm text-gray-900"
        >
          <svg className="h-3 w-3" viewBox="0 0 14 14" fill="none">
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
          <span className="sr-only">Close banner</span>
        </button>
      </div>
    </div>
  );
}
