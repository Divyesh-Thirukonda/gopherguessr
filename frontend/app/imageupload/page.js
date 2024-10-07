// this is a server component page route that handles the serverside part of uplading images
// we import in a client component (UploadForm) so that we can show when the form is processing

import { utapi } from "../_utils/ut";
import sharp from "sharp";
import ExifReader from "exifreader";
import prisma from "../_utils/db";
import UploadForm from "./_components/UploadForm";

export default async function ImageUpload() {
  // this runs on the server before rendering the page
  // and gets the users from the db to use when rendring the dropdown
  const uploaders = await prisma.user.findMany();

  // this runs on the backend when the user submits the form
  async function uploadFiles(formData) {
    "use server";
    const password = formData.get("password");
    if (password !== process.env.UPLOAD_PASSWORD) {
      throw new Error();
    }
    const file = formData.get("file");
    const buffer = await file.arrayBuffer();
    // pull gps coords from image
    const tags = await ExifReader.load(buffer, { expanded: true });
    if (!tags.gps) {
      throw new Error();
    }
    const latitude = tags.gps.Latitude;
    const longitude = tags.gps.Longitude;
    // compress image and convert to webp
    const optimized = await sharp(buffer)
      .rotate()
      .resize(3000)
      .toFormat("webp")
      .webp({ quality: 75 })
      .toBuffer();
    // convert to blob as the File class needs it to be a blob
    const blob = new Blob([optimized], { type: "image/webp" });
    const newFileName = `${file.name.substring(0, file.name.lastIndexOf("."))}.webp`;
    // create the new image
    const newFile = new File([blob], newFileName, { type: "image/webp" });
    // upload the image
    const response = await utapi.uploadFiles(newFile);
    if (response.error) {
      throw new Error();
    }
    const imageId = response.data.appUrl.substring(
      response.data.appUrl.lastIndexOf("/") + 1,
    );
    // get rest of data from form and save to db
    const buildingName = formData.get("name");
    const uploaderId = parseInt(formData.get("uploaderId"), 10);
    const newImageInPrisma = await prisma.photo.create({
      data: {
        imageId,
        buildingName,
        latitude,
        longitude,
        uploaderId,
      },
    });
    console.log(newImageInPrisma);
    return;
  }

  return (
    <form
      action={uploadFiles}
      className="m-4 flex max-w-md flex-col rounded-md border p-4"
    >
      <UploadForm uploaders={uploaders} />
    </form>
  );
}
