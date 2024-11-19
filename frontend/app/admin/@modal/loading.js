import Loading from "@/app/_components/Loading";

export default function SuspenseLoading() {
  return (
    <div className="fixed inset-0 z-[2000] bg-white bg-opacity-50 backdrop-blur">
      <Loading />
    </div>
  );
}
