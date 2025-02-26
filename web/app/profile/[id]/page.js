import ProfileIndex from "@/app/profile/page";

export default async function PublicProfile(props) {
  const params = await props.params;
  return <ProfileIndex userId={parseInt(params?.id)} publicView={true} />;
}
