"use server";

import prisma from "@/app/_utils/db";
import PhotoReview from "./_components/PhotoReview";

// export const dynamic = "force-dynamic";

export async function deletePhoto(photoId) {
  await prisma.photo.delete({
    where: { id: photoId },
  });
}

export async function approvePhoto(photoId) {
  await prisma.photo.update({
    where: { id: photoId },
    data: { isApproved: true },
  });
}

export default async function PublicUploadApproval() {
  const photos = await prisma.photo.findMany({
    where: { isApproved: false },
  });

  return <PhotoReview photos={photos} />;
}