// individual photo editor
// this is a component not a page because we use it in 2 places to implement intercepting routes
// learn more here: https://nextjs.org/docs/app/building-your-application/routing/intercepting-routes
// TODO: add deletion functionality

"use server";

import prisma from "@/app/_utils/db";
import Image from "next/image";
import PhotoEditBackButton from "./PhotoEditBackButton";
import PhotoEditForm from "./PhotoEditForm";
import { DiffEnum, CampusEnum } from "@prisma/client";
import {
  authorizeAdminAction,
  authorizeAdminRoute,
} from "@/app/_utils/userSession";
import { revalidatePath } from "next/cache";
import { DateTime } from "luxon";
import PhotoEditMapView from "./PhotoEditMapView";

function getFullUrl(id) {
  return `https://utfs.io/a/e9dxf42twp/${id}`;
}

export default async function PhotoEditWrapper({ id, inModal }) {
  const photo = await prisma.photo.findFirst({
    where: { id: parseInt(id, 10) },
    include: {
      uploader: true,
    },
  });

  async function editPhoto(formData) {
    "use server";
    // check admmin auth, redirects if not authorized
    await authorizeAdminRoute();
    // checks db, logs the user out if not actually admin
    await authorizeAdminAction();

    // get data from form and save to db
    const buildingName = formData.get("name");
    const description = formData.get("description");
    const campus = formData.get("campus");
    const diffRating = formData.get("difficulty");
    const indoors = formData.get("indoors");
    const isApproved = formData.get("approved");
    await prisma.photo.update({
      where: {
        id: photo.id,
      },
      data: {
        buildingName,
        description,
        campus,
        diffRating,
        indoors: indoors === "true",
        isApproved: isApproved === "true",
      },
    });
    revalidatePath(`admin/photos/${id}`);
  }

  async function updateLocation(latitude, longitude) {
    "use server";
    // check admmin auth, redirects if not authorized
    await authorizeAdminRoute();
    // checks db, logs the user out if not actually admin
    await authorizeAdminAction();

    // save to db
    await prisma.photo.update({
      where: {
        id: photo.id,
      },
      data: {
        latitude,
        longitude,
      },
    });
    revalidatePath(`admin/photos/${id}`);
  }

  return (
    <div
      className={`mx-auto w-[28rem] max-w-[calc(100vw-1.5rem)] ${inModal && "px-3"} py-3`}
    >
      {inModal && <PhotoEditBackButton />}
      <h1 className="mb-2 text-3xl font-medium">{photo.buildingName}</h1>
      <small>
        Uploaded: {DateTime.fromJSDate(photo.createdAt).toLocaleString()}
      </small>
      <br />
      <small>Uploaded by: {photo.uploader.name}</small>
      <br />
      <small>
        Edited: {DateTime.fromJSDate(photo.updatedAt).toLocaleString()}
      </small>
      <br />
      <a
        href={getFullUrl(photo.imageId)}
        target="_blank"
        className="text-sm underline"
      >
        Direct Image Link
      </a>
      <div className="relative mt-3 w-[28rem] max-w-full overflow-hidden rounded-xl">
        <Image
          src={getFullUrl(photo.imageId)}
          className="h-full w-full object-contain object-center"
          width={0}
          height={0}
          sizes="100%"
          alt={photo.buildingName}
          loading="eager"
        />
      </div>
      <div className="relative mt-3 h-80 w-full overflow-hidden rounded-xl border">
        <PhotoEditMapView updateLocation={updateLocation} photo={photo} />
      </div>
      <form
        action={editPhoto}
        className="relative mt-3 flex flex-col overflow-hidden rounded-xl border p-4"
      >
        <PhotoEditForm
          initial={photo}
          CampusEnum={CampusEnum}
          DiffEnum={DiffEnum}
        />
      </form>
    </div>
  );
}