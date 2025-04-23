// this is a client component that handles the frontend form logic for the image uploader

"use client";

import { useFormStatus } from "react-dom";
import * as motion from "framer-motion/client";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react";

export default function UploadForm({ uploaders, CampusEnum, DiffEnum }) {
  const { pending } = useFormStatus();

  // show uploading... if the form is currently submitting
  if (pending) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white text-2xl font-bold">
        Uploading...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <motion.div
        className="absolute left-3 top-3 mx-auto inline-block rounded-full bg-rose-600"
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.8 }}
      >
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 text-xl font-medium text-white"
          aria-label="Back"
        >
          <ArrowLeft className="h-6 w-6" weight="bold" aria-label="Back Icon" />
        </Link>
      </motion.div>
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <div className="hidden">
          <label htmlFor="name" className="mb-2 block text-lg font-medium">
            Location Name
          </label>
          <input
            name="name"
            id="name"
            type="text"
            className="mb-4 w-full rounded border border-gray-300 p-2"
          />
          <label
            htmlFor="difficulty"
            className="mb-2 block text-lg font-medium"
          >
            Difficulty (1 is easy, 3 is hard)
          </label>
          <select
            name="difficulty"
            id="difficulty"
            className="mb-4 w-full rounded border border-gray-300 p-2"
          >
            {Object.keys(DiffEnum).map((key) => (
              <option value={DiffEnum[key]} key={key}>
                {DiffEnum[key]}
              </option>
            ))}
          </select>
          <label htmlFor="campus" className="mb-2 block text-lg font-medium">
            Campus
          </label>
          <select
            name="campus"
            id="campus"
            className="mb-4 w-full rounded border border-gray-300 p-2"
          >
            {Object.keys(CampusEnum).map((key) => (
              <option value={CampusEnum[key]} key={key}>
                {CampusEnum[key]}
              </option>
            ))}
          </select>
          <label htmlFor="indoors" className="mb-2 block text-lg font-medium">
            Indoors
          </label>
          <select
            name="indoors"
            id="indoors"
            className="mb-4 w-full rounded border border-gray-300 p-2"
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <label htmlFor="file" className="mb-2 block text-lg font-medium">
          Image Upload
        </label>
        <div className="mb-4 w-full rounded border border-gray-300 p-2">
          <input
            name="file"
            type="file"
            id="file"
            className="file:cursor-pointer file:appearance-none file:rounded-lg file:border-none file:bg-rose-600 file:text-white hover:file:bg-rose-700"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full rounded bg-rose-600 p-3 text-white"
        >
          Submit
        </button>
        <p className="mt-5 text-center font-medium text-red-500">
          IMPORTANT: Location services must be enabled on your phone for us to
          know where the photo is, thanks!
        </p>
        <p className="mt-5 text-center font-light">
          The council will review your upload and determine if it is worthy of
          our prestigious collection.
        </p>
      </div>
    </div>
  );
}
