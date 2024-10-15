// Handles errors during image upload process

"use client";

export default function Error({ error, reset }) {
  // Allows for custom messages on errors thrown by imported libraries.
  let errorMessage;

  switch (error.message) {
    case "Invalid image format":
      // sharp error
      errorMessage =
        "Invalid image format. Please submit a JPG, PNG or HEIC file.";
      break;
    default:
      // handles custom errors
      errorMessage = error.message;
      break;
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="mb-4 text-2xl font-bold text-red-600">Upload Failed</h1>
        <p className="mb-6 text-lg">{errorMessage}</p>
        <button
          onClick={() => reset()}
          className="rounded bg-rose-600 px-4 py-2 text-white hover:bg-rose-700"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
