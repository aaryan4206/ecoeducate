import React, { useEffect, useState } from "react";
import { collection, query, orderBy, limit, getFirestore, getDocs } from "firebase/firestore";
import { getApp } from "firebase/app";
import LoadingSpinner from "./LoadingSpinner";

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const app = getApp(); // Assumes Firebase app is already initialized
        const db = getFirestore(app);

        // Query top 10 users ordered by eco_points descending
        const leaderboardQuery = query(
          collection(db, "eco-points"),
          orderBy("eco_points", "desc"),
          limit(10)
        );

        const querySnapshot = await getDocs(leaderboardQuery);
        const topUsers = [];
        querySnapshot.forEach(doc => {
          const data = doc.data();
          topUsers.push({
            id: doc.id,
            name: data.name || "Anonymous",
            ecoPoints: data.eco_points || 0,
          });
        });

        setUsers(topUsers);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
  }, []);

  if (loading) {
    return <LoadingSpinner/>;
  }

  if (users.length === 0) {
    return <p>No users available in leaderboard.</p>;
  }

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <h2 style={{ textAlign: "center", marginBottom: "1rem", color: "#2e7d32" }}>Eco-Points Leaderboard</h2>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#a5d6a7", color: "#1b5e20" }}>
            <th style={{ padding: "0.75rem", border: "1px solid #81c784" }}>Rank</th>
            <th style={{ padding: "0.75rem", border: "1px solid #81c784" }}>Name</th>
            <th style={{ padding: "0.75rem", border: "1px solid #81c784" }}>Eco Points</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id} style={{ textAlign: "center", borderBottom: "1px solid #c8e6c9" }}>
              <td style={{ padding: "0.5rem", border: "1px solid #c8e6c9" }}>{index + 1}</td>
              <td style={{ padding: "0.5rem", border: "1px solid #c8e6c9" }}>{user.name}</td>
              <td style={{ padding: "0.5rem", border: "1px solid #c8e6c9", fontWeight: "bold", color: "#2e7d32" }}>
                {user.ecoPoints}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
