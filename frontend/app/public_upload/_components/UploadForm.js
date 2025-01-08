// this is a client component that handles the frontend form logic for the image uploader

"use client";

import { useFormStatus } from "react-dom";

export default function UploadForm({ uploaders, CampusEnum, DiffEnum }) {
  const { pending } = useFormStatus();

  // show uploading... if the form is currently submitting
  if (pending) {
    return <div>Sending...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
      <label htmlFor="name" className="block mb-2 text-lg font-medium">
        Location Name
      </label>
      <input
        name="name"
        id="name"
        type="text"
        className="mb-4 w-full p-2 border rounded border-gray-300"
      />
      <label htmlFor="difficulty" className="block mb-2 text-lg font-medium">
        Difficulty (1 is easy, 3 is hard)
      </label>
      <select
        name="difficulty"
        id="difficulty"
        className="mb-4 w-full p-2 border rounded border-gray-300"
      >
        {Object.keys(DiffEnum).map((key) => (
          <option value={DiffEnum[key]} key={key}>
            {DiffEnum[key]}
          </option>
        ))}
      </select>
      <label htmlFor="campus" className="block mb-2 text-lg font-medium">
        Campus
      </label>
      <select
        name="campus"
        id="campus"
        className="mb-4 w-full p-2 border rounded border-gray-300"
      >
        {Object.keys(CampusEnum).map((key) => (
          <option value={CampusEnum[key]} key={key}>
            {CampusEnum[key]}
          </option>
        ))}
      </select>
      <label htmlFor="indoors" className="block mb-2 text-lg font-medium">
        Indoors
      </label>
      <select
        name="indoors"
        id="indoors"
        className="mb-4 w-full p-2 border rounded border-gray-300"
      >
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
      <label htmlFor="file" className="block mb-2 text-lg font-medium">
        Image Upload
      </label>
      <div className="mb-4 w-full p-2 border rounded border-gray-300">
        <input
          name="file"
          type="file"
          id="file"
          className="file:cursor-pointer file:appearance-none file:rounded-lg file:border-none file:bg-rose-600 file:text-white hover:file:bg-rose-700"
          required
        />
      </div>
      <button type="submit" className="w-full rounded bg-rose-600 p-3 text-white">
        Submit
      </button>
      <p className="mt-5 text-center font-light">The council will review your upload and determine if it is worthy of our prestigious collection.</p>
      </div>
    </div>
  );
}
