import db from "../../utils/db";

export default async function TestDB() {
  // create new
  const newTest = await db.test.create();
  // get
  const allTestItems = await db.test.findMany();
  console.log(allTestItems);
  return <div></div>;
}
