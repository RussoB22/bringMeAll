import React, { useEffect, useState } from 'react';
const hostServer = 'https://bringmeall-820d703952e6.herokuapp.com';

function Leaderboard(props) {
  const [globalData, setGlobalData] = useState([]);

  useEffect(() => {
    fetchGlobalData();
  }, []);

  const fetchGlobalData = async () => {
    try {
      const response = await fetch(`${hostServer}/api/users`);
      const data = await response.json();

      // Sort the data in descending order based on totalScore
      const sortedData = data.sort((a, b) => b.totalScore - a.totalScore);

      // Take the top 20 records (if available)
      const top20Data = sortedData.slice(0, 20);
      setGlobalData(top20Data);

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="leaderboard-container container my-1">
      <div className="table-container">
        <h2 className="leaderboard-headers">Global</h2>
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {globalData.map((user, index) => (
              <tr key={index}>
                <td>{user.username}</td>
                <td>{user.totalScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Leaderboard;