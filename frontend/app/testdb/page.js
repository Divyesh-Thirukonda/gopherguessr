import db from "/utils/db";

// this is needed to prevent nextjs from statically building this page
export const dynamic = "force-dynamic";

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
  return <div>{allTest2Items.length} items</div>;
}
