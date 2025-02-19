// this is a client component that handles the frontend form logic for the image editor

"use client";

import { useFormStatus } from "react-dom";
import Loading from "@/app/_components/Loading";

export default function EditForm({ initial, CampusEnum, DiffEnum }) {
  const { pending } = useFormStatus();

  return (
    <>
      <label htmlFor="name" className="mb-1 text-lg font-medium">
        Location Name
      </label>
      <input
        name="name"
        id="name"
        type="text"
        defaultValue={initial.buildingName}
        className="mb-3 rounded border-gray-300"
      />
      <label htmlFor="description" className="mb-1 text-lg font-medium">
        Description
      </label>
      <textarea
        name="description"
        id="description"
        type="text"
        defaultValue={initial.description}
        rows="3"
        className="mb-3 rounded border-gray-300"
      />
      <label htmlFor="difficulty" className="mb-1 text-lg font-medium">
        Difficulty
      </label>
      <select
        name="difficulty"
        id="difficulty"
        defaultValue={initial.diffRating}
        className="mb-3 rounded border-gray-300"
      >
        {Object.keys(DiffEnum).map((key) => (
          <option value={DiffEnum[key]} key={key}>
            {DiffEnum[key]}
          </option>
        ))}
      </select>
      <label htmlFor="campus" className="mb-1 text-lg font-medium">
        Campus
      </label>
      <select
        name="campus"
        id="campus"
        defaultValue={initial.campus}
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
        defaultValue={initial.indoors}
        className="mb-3 rounded border-gray-300"
      >
        <option value="true">Yes</option>
        <option value="false">No</option>
      </select>
      <label htmlFor="approved" className="mb-1 text-lg font-medium">
        Approved
      </label>
      <select
        name="approved"
        id="approved"
        defaultValue={initial.isApproved}
        className="mb-3 rounded border-gray-300"
      >
        <option value="true">Yes</option>
        <option value="false">No</option>
      </select>
      <button type="submit" className="rounded bg-rose-600 p-3 text-white">
        Save
      </button>
      {pending && (
        <div className="absolute inset-0 z-[1100] flex items-center justify-center bg-white bg-opacity-50 backdrop-blur">
          <Loading />
        </div>
      )}
    </>
  );
}
