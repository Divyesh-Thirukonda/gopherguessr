export default function Table() {
  const sample1 = {
    name: "sam breider",
    score: 4201,
  };

  const sample2 = {
    name: "johnny appleseed",
    score: 3917,
  };

  const sample3 = {
    name: "stevie wonder",
    score: 0,
  };

  const users = [sample1, sample2, sample3];

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
