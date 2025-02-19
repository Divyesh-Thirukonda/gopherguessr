import PhotoEditWrapper from "@/app/admin/_components/PhotoEditWrapper";

export default async function Page(props) {
  const params = await props.params;

  return <PhotoEditWrapper id={params.id} />;
}
