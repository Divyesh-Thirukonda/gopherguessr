// * * * *
// DEPRECATED, use PhotoApprovalForm instead.
// * * * *

// Sorry Divyesh. Keeping in loving memory of swipe approval 2025-2025

"use client";

import { useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { deletePhoto, approvePhoto } from "../page";

function getFullUrl(id) {
  return `https://utfs.io/a/e9dxf42twp/${id}`;
}

export default function PhotoReview({ photos }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const controls = useAnimation();

  const handleSwipe = async (direction) => {
    const photo = photos[currentIndex];
    if (direction === "right") {
      await approvePhoto(photo.id);
    } else if (direction === "left") {
      await deletePhoto(photo.id);
    }
    setCurrentIndex((prevIndex) => prevIndex + 1);
    if (currentIndex + 1 >= photos.length) {
      return;
    }
  };

  const handleDragEnd = (event, info) => {
    if (info.offset.x > 100) {
      controls.start({ x: 1000, opacity: 0 }).then(() => handleSwipe("right"));
    } else if (info.offset.x < -100) {
      controls.start({ x: -1000, opacity: 0 }).then(() => handleSwipe("left"));
    } else {
      controls.start({ x: 0 });
    }
  };

  const handleSkip = () => {
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  if (currentIndex >= photos.length) {
    return <div>No more photos to review.</div>;
  }

  const photo = photos[currentIndex];

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h2 className="mb-5 text-2xl">Swipe right to approve, left to delete</h2>
      <motion.div className="relative h-80 w-80">
        <motion.img
          src={getFullUrl(photo.imageId)}
          className="absolute inset-0 h-full w-full rounded-lg object-cover shadow-lg"
          alt={photo.buildingName}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          animate={controls}
        />
      </motion.div>
      <div className="mt-4 text-center">
        <h2 className="text-2xl font-bold">{photo.buildingName}</h2>
        <p>{photo.description}</p>
        <p>Latitude: {photo.latitude}</p>
        <p>Longitude: {photo.longitude}</p>
        <p>Campus: {photo.campus}</p>
        <p>Difficulty: {photo.diffRating}</p>
        <p>Indoors: {photo.indoors ? "Yes" : "No"}</p>
      </div>
      <button
        className="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
        onClick={handleSkip}
      >
        Skip
      </button>
    </div>
  );
}
