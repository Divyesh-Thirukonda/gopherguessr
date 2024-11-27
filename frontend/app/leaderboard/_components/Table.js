export default function Table({ scoreData }) {
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
    <table className="w-full table-auto">
      <thead>
        <tr>
          <th className="w-36 text-center">Rank</th>
          <th className="w-36 text-center">Name</th>
          <th className="w-36 text-center">Score</th>
        </tr>
      </thead>
      <tbody>{LeaderBoard}</tbody>
    </table>
  );
}
