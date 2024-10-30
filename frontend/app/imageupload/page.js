// this is a server component page route that handles the serverside part of uplading images
// we import in a client component (UploadForm) so that we can show when the form is processing

import { utapi } from "../_utils/ut";
import sharp from "sharp";
import ExifReader from "exifreader";
import prisma from "../_utils/db";
import UploadForm from "./_components/UploadForm";
import heicConvert from "heic-convert";
import { DiffEnum, CampusEnum } from "@prisma/client";

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
    let buffer = await file.arrayBuffer();

    // pull gps coords from image
    const tags = await ExifReader.load(buffer, { expanded: true });
    if (!tags.gps) {
      throw Error(
        "Uploaded photo does not contain GPS data. Please ensure camera has access to location data.",
      );
    }
    const latitude = tags.gps.Latitude;
    const longitude = tags.gps.Longitude;

    // gets last 4 characters of file name
    const fileExtension = file.name.substring(
      file.name.length - 4,
      file.name.length,
    );

    // if HEIC, convert buffer to PNG
    if (fileExtension === "HEIC") {
      // convert function accepts Uint8Array
      const tempBuffer = new Uint8Array(buffer);
      buffer = await heicConvert({
        buffer: tempBuffer,
        format: "PNG",
      });
    }

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
      console.log(response.error);
      throw new Error("Unknown error in file upload.");
    }

    const imageId = response.data.appUrl.substring(
      response.data.appUrl.lastIndexOf("/") + 1,
    );

    // get rest of data from form and save to db
    const buildingName = formData.get("name");
    const uploaderId = parseInt(formData.get("uploaderId"), 10);
    const campus = formData.get("campus");
    const diffRating = formData.get("difficulty");
    const indoors = formData.get("indoors");
    const newImageInPrisma = await prisma.photo.create({
      data: {
        imageId,
        buildingName,
        latitude,
        longitude,
        uploaderId,
        campus,
        diffRating,
        indoors: indoors === "Yes" ? true : false,
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
      <UploadForm
        uploaders={uploaders}
        CampusEnum={CampusEnum}
        DiffEnum={DiffEnum}
      />
    </form>
  );
}
