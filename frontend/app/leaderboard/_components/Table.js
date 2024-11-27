// Leaderboard table

export default function Table({ scoreData, isLoggedIn }) {
  const LeaderBoard = scoreData.map((item, index) => {
    return (
      <tr className="text-xl" key={index}>
        <td className="text-left">{index + 1}.</td>
        <td className="text-right">{item.name}</td>
        <td>{item.highScore}</td>
      </tr>
    );
  });

  return (
    <main>
      <div className="mb-5 text-rose-800">
        <h1 className="text-4xl">
          <b>High Scores</b>
        </h1>
        <p className="mt-1">The best Gopher Guessrs.</p>
      </div>
      <div className="rounded-lg bg-black/50 p-6 text-center text-white shadow-2xl backdrop-blur-md">
        <table className="w-full table-auto border-separate border-spacing-y-2 md:border-spacing-y-3">
          <thead>
            <tr className="text-white">
              <th className="w-36 text-center"></th>
              <th className="w-96 text-right">Name</th>
              <th className="w-64 text-center">Score</th>
            </tr>
          </thead>
          <tbody>{LeaderBoard}</tbody>
        </table>
      </div>
      {!isLoggedIn && (
        <p className="mt-6 text-white">
          Think you can top the leaderboards?{" "}
          <a href="/login">
            <u>Sign up now!</u>
          </a>
        </p>
      )}
    </main>
  );
}
