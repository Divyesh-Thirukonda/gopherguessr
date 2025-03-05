// Leaderboard table

export default function ResultsLeaderboard({
  scoreData,
  isLoggedIn,
  curState,
}) {
  if (!scoreData) {
    scoreData = [];
  }

  const LeaderBoard = scoreData.map((item, index) => {
    return (
      <tr className="text-xl" key={index}>
        <td className="text-left">{index + 1}.</td>
        <td className="text-right" style={{ cursor: 'pointer', color: 'white' }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'orange'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
          onClick={() => { window.location.href = `/profile/${item.id}` }}>
          {item.name}
        </td>
        <td>{item.highScore}</td>
      </tr>
    );
  });

  const scoreMessage = () => {
    let place = 1;

    for (let i = 0; i < scoreData.length; i++) {
      place += 1;
    }

    let suffix = "th";
    if (place === 1) {
      suffix = "st";
    } else if (place === 2) {
      suffix = "nd";
    } else if (place === 3) {
      suffix = "rd";
    }

    const hrefRoute = "/login?gameId=" + curState.id;

    if (place > scoreData.length && !isLoggedIn) {
      return (
        <b className="text-2xl">
          <u>
            <a href={hrefRoute}> Log in</a>
          </u>{" "}
          to save your score!
        </b>
      );
    } else if (place > scoreData.length) {
      return (
        <b className="text-2xl">
          Nice score! You&apos;ll be number 1 in no time.
        </b>
      );
    }

    if (!isLoggedIn) {
      return (
        <b className="text-2xl">
          What a score! {place}
          {suffix} place globally.{" "}
          <u>
            <a href={hrefRoute}> Log in</a>
          </u>{" "}
          to claim your spot!
        </b>
      );
    }

    return (
      <b className="text-2xl">
        What a score! {place}
        {suffix} place globally.{" "}
      </b>
    );
  };

  return (
    <main>
      <div className="mb-5 text-white">{scoreMessage()}</div>
      <div className="rounded-lg bg-black/50 p-6 text-center text-white shadow-2xl backdrop-blur-md">
        <b className="text-xl">Leaderboard</b>
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
