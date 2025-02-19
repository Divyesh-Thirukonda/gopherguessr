"use client";

import { DataGrid } from "@mui/x-data-grid";
import Link from "next/link";

export default function Table({ allPhotos }) {
  const columns = [
    {
      field: "buildingName",
      headerName: "Name",
      width: 300,
      renderCell: (params) => (
        <Link
          href={`/admin/photos/${params.row.id}`}
          className="!text-gray-900 underline"
        >
          {params.row.buildingName}
        </Link>
      ),
    },
    {
      field: "id",
      headerName: "ID",
      width: 100,
    },
    {
      field: "description",
      headerName: "Description",
      width: 400,
    },
    {
      field: "diffRating",
      headerName: "Difficulty",
      width: 150,
    },
    {
      field: "campus",
      headerName: "Campus",
      width: 150,
    },
    {
      field: "indoors",
      headerName: "Indoors",
      width: 150,
    },
    {
      field: "isApproved",
      headerName: "Approved",
      width: 150,
    },
    {
      field: "uploader",
      headerName: "Uploader",
      width: 150,
      valueGetter: (params) => params.name,
    },
    {
      field: "_count",
      headerName: "Times Guessed",
      width: 150,
      valueGetter: (params) => params.guesses,
    },
  ];

  return (
    <DataGrid
      sx={{
        fontFamily: "var(--font-geist-sans)",
        color: "#4b5563",
      }}
      rows={allPhotos}
      columns={columns}
    />
  );
}
