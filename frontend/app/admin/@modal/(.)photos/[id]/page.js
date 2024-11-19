// for intercepting route
// learn more here: https://nextjs.org/docs/app/building-your-application/routing/intercepting-routes

import PhotoEditWrapper from "@/app/admin/_components/PhotoEditWrapper";
import Modal from "./_components/Modal";

export default async function Page(props) {
  const params = await props.params;

  return (
    <Modal>
      <PhotoEditWrapper id={params.id} inModal={true} />
    </Modal>
  );
}
