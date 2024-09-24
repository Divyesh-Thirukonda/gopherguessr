import db from "/utils/db";

export default async function TestDB() {
  // create new
  const newTest2 = await db.test2.create({
    data: {
      imageId: "https://google.com/imageid",
    },
  });
  // get
  const allTest2Items = await db.test2.findMany();
  console.log(allTest2Items);
  return <div></div>;
}
