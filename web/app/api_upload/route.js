import sharp from "sharp";
import { utapi } from "../_utils/ut";
import prisma from "../_utils/db";

export const config = {
  api: {
    responseLimit: false,
    bodyParser: {
      sizeLimit: "100mb",
    },
  },
};

export async function POST(request) {
  console.log("API UPLOADER CALLED");

  const formData = await request.formData();

  // TODO: ADD REAL AUTHENTICATION HERE - THIS IS JUST CHECKING THAT THE APP IS SENDING THE REQUEST BUT THE KEY WILL BE IN THE APP BUNDLE SO THIS IS INHERENTLY INSECURE
  const appAuthKey = formData.get("appAuthKey");
  if (appAuthKey !== process.env.APP_AUTH_KEY) {
    throw new Error("AUTH FAILED");
  }

  const base64 = formData.get("base64");
  let buffer = Buffer.from(base64, "base64");

  const latitude = parseFloat(formData.get("latitude"));
  const longitude = parseFloat(formData.get("longitude"));

  // compress image and convert to webp
  const optimized = await sharp(buffer)
    .rotate()
    .resize(3000)
    .toFormat("webp")
    .webp({ quality: 75 })
    .toBuffer();
  // convert to blob as the File class needs it to be a blob
  const blob = new Blob([optimized], { type: "image/webp" });
  const newFileName = `mobile-upload${new Date().getTime()}.webp`;
  // create the new image
  const newFile = new File([blob], newFileName, { type: "image/webp" });

  console.log("uploading...");
  // upload the image
  const response = await utapi.uploadFiles(newFile);
  if (response.error) {
    console.log(response.error);
    throw new Error("Unknown error in file upload.");
  }

  const imageId = response.data.appUrl.substring(
    response.data.appUrl.lastIndexOf("/") + 1,
  );

  console.log("saving to db...");
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
      uploaderId: 29,
      campus,
      diffRating,
      isApproved: false,
      indoors: indoors === "Yes" ? true : false,
    },
  });
  console.log(newImageInPrisma);
  return new Response("OK");
}
