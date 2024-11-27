export default function Table() {
  const sample1 = {
    name: "sam breider",
    score: 4201,
  };

  const sample2 = {
    name: "john",
    score: 3917,
  };

  const users = [sample1, sample2];

  const LeaderBoard = users.map((item, index) => {
    return (
      <tr key={index}>
        <td>{item.name}</td>
        <td>{item.score}</td>
      </tr>
    );
  });

  return (
    <table className="w-full table-auto">
      <thead>
        <tr>
          <th className="w-48 text-center">Name</th>
          <th className="w-24 text-center">Score</th>
        </tr>
      </thead>
      <tbody>{LeaderBoard}</tbody>
    </table>
  );
}
