export default function Table({ scoreData, isLoggedIn }) {
  const LeaderBoard = scoreData.map((item, index) => {
    return (
      <tr key={index}>
        <td>{index + 1}</td>
        <td>{item.name}</td>
        <td>{item.highScore}</td>
      </tr>
    );
  });

  return (
    <main>
      <div className="rounded-lg bg-black/50 p-6 text-center text-white shadow-2xl backdrop-blur-md">
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="w-36 text-center lg:w-96">Rank</th>
              <th className="w-96 text-center">Name</th>
              <th className="w-36 text-center lg:w-96">Score</th>
            </tr>
          </thead>
          <tbody>{LeaderBoard}</tbody>
        </table>
      </div>
      {!isLoggedIn && (
        <p className="mt-6 text-black">
          Think you can top the leaderboards?{"  "}
          <a href="/login">
            <u>Sign up now!</u>
          </a>
        </p>
      )}
    </main>
  );
}
