// this is a client component that handles the frontend form logic for the image uploader

"use client";

import { useFormStatus } from "react-dom";

export default function UploadForm({ uploaders }) {
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
      <label htmlFor="password" className="mb-1 text-lg font-medium">
        Password (in the Discord)
      </label>
      <input
        name="password"
        id="password"
        type="password"
        className="mb-3 rounded border-gray-300"
      />
      <button type="submit" className="rounded bg-rose-600 p-3 text-white">
        Upload
      </button>
    </>
  );
}
