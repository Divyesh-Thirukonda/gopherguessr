// Leaderboard table

export default function ResultsLeaderboard({ scoreData, isLoggedIn, score }) {
  if (!scoreData) {
    scoreData = [];
  }

  const LeaderBoard = scoreData.map((item, index) => {
    return (
      <tr className="text-xl" key={index}>
        <td className="text-left">{index + 1}.</td>
        <td className="text-right">{item.name}</td>
        <td>{item.highScore}</td>
      </tr>
    );
  });

  const scoreMessage = () => {
    const place = 6;

    let suffix = "th";
    if (place === 1) {
      suffix = "st";
    } else if (place === 2) {
      suffix = "nd";
    } else if (place === 3) {
      suffix = "rd";
    }

    return (
      <h3 className="text-4xl">
        Your score would have landed you at {place}
        {suffix} place!
      </h3>
    );
  };

  return (
    <main>
      <div className="mb-5 text-white">{scoreMessage()}</div>
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
    </main>
  );
}
