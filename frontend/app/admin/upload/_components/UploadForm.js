// this is a client component that handles the frontend form logic for the image uploader

"use client";

import { useFormStatus } from "react-dom";

export default function UploadForm({ uploaders, CampusEnum, DiffEnum }) {
  const { pending } = useFormStatus();

  // show uploading... if the form is currently submitting
  if (pending) {
    return <div>uploading...</div>;
  }

  return (
    <>
      <label htmlFor="name" className="mb-1 text-lg font-medium">
        Location Name
      </label>
      <input
        name="name"
        id="name"
        type="text"
        className="mb-3 rounded border-gray-300"
      />
      <label htmlFor="difficulty" className="mb-1 text-lg font-medium">
        Difficulty
      </label>
      <select
        name="difficulty"
        id="difficulty"
        className="mb-3 rounded border-gray-300"
      >
        {Object.keys(DiffEnum).map((key) => (
          <option value={DiffEnum[key]} key={key}>
            {DiffEnum[key]}
          </option>
        ))}
      </select>
      <label htmlFor="difficulty" className="mb-1 text-lg font-medium">
        Campus
      </label>
      <select
        name="campus"
        id="campus"
        className="mb-3 rounded border-gray-300"
      >
        {Object.keys(CampusEnum).map((key) => (
          <option value={CampusEnum[key]} key={key}>
            {CampusEnum[key]}
          </option>
        ))}
      </select>
      <label htmlFor="indoors" className="mb-1 text-lg font-medium">
        Indoors
      </label>
      <select
        name="indoors"
        id="indoors"
        className="mb-3 rounded border-gray-300"
      >
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
      <label htmlFor="uploaderId" className="mb-1 text-lg font-medium">
        Photo Source
      </label>
      <select
        name="uploaderId"
        id="uploaderId"
        className="mb-3 rounded border-gray-300"
      >
        {uploaders.map((uploader) => (
          <option value={uploader.id} key={uploader.id}>
            {uploader.name}
          </option>
        ))}
      </select>
      <label htmlFor="file" className="mb-1 text-lg font-medium">
        Image Upload
      </label>
      <div className="mb-3 rounded border p-2">
        <input
          name="file"
          type="file"
          id="file"
          className="file:cursor-pointer file:appearance-none file:rounded-lg file:border-none file:bg-rose-600 file:text-white hover:file:bg-rose-700"
          required
        />
      </div>
      <button type="submit" className="rounded bg-rose-600 p-3 text-white">
        Upload
      </button>
    </>
  );
}
