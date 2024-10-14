// using image from db now!

function getFullUrl(id) {
  return `https://utfs.io/a/e9dxf42twp/${id}`;
}

export default function PreviewImage({ gameState }) {
  return (
    <div
      className={`fixed right-0 top-72 z-[1000] px-4 py-2 ${gameState.complete ? "bg-emerald-50" : "bg-white"} w-72 rounded-bl-lg shadow-inner`}
    >
      <span className="flex items-center gap-1.5 text-lg font-medium">
        Where is this building!?
      </span>
      <img className="rounded" src={getFullUrl(gameState.loc.imageId)} />
    </div>
  );
}
