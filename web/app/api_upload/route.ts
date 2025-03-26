import ExifReader from "exifreader";
import heicConvert from "heic-convert";
import sharp from "sharp";
import { utapi } from "@/app/_utils/ut";
import prisma from "@/app/_utils/db";

export async function POST(request) {
  console.log("API UPLOADER CALLED");

  const formData = await request.formData();

  // TODO: ADD REAL AUTHENTICATION HERE - THIS IS JUST CHECKING THAT THE APP IS SENDING THE REQUEST BUT THE KEY WILL BE IN THE APP BUNDLE SO THIS IS INHERENTLY INSECURE
  const appAuthKey = formData.get("appAuthKey");
  if (appAuthKey !== process.env.APP_AUTH_KEY) {
    throw new Error("AUTH FAILED");
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
  const campus = formData.get("campus");
  const diffRating = formData.get("difficulty");
  const indoors = formData.get("indoors");
  const newImageInPrisma = await prisma.photo.create({
    data: {
      imageId,
      buildingName,
      latitude,
      longitude,
      uploaderId: 29, // DEFAULT USER FOR NOW
      campus,
      diffRating,
      isApproved: false,
      indoors: indoors === "Yes" ? true : false,
    },
  });
  console.log(newImageInPrisma);
  return new Response("OK");
}
