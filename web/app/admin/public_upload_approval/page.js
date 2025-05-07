"use server";

import prisma from "@/app/_utils/db";
import PhotoApprovalWrapper from "./_components/PhotoApprovalWrapper";

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
    where: { isApproved: false, isTest: false },
  });
  if (photos.length > 0) {
    return <PhotoApprovalWrapper id={photos[0].id} />;
  } else {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <img src="/sadgopher.png"></img>
        <h1 className="mt-6 text-3xl">That&apos;s all, folks!</h1>
      </div>
    );
  }
}
