// WHY DID NEXT JS REMOVE ROUTER EVENTS?!?!?!?!?!
// now there's no easy way to tell when a route transition has ended
// trying to make a loading spinner appear after clicking the play again button
// tried suspense, didn't work because of the fact it redirects back to the same page
// loading.js is just suspense
// there's no good way to set up a useTransition either
// soooo im literally resorting to having a loading spinner always rendered but the actual content just display over it when it finishes rendering lmao
// remix did this way better

export default function Layout({ children }) {
  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center">
        {/* Loading spinner from https://tailwindcss.com/docs/animation */}
        <svg
          className="h-10 w-10 animate-spin text-rose-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-50"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
      <>{children}</>
    </>
  );
}
