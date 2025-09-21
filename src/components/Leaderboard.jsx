import React, { useEffect, useMemo, useState } from "react";
import { collection, query, orderBy, limit, getFirestore, getDocs } from "firebase/firestore";
import { getApp } from "firebase/app";
import LoadingSpinner from "./LoadingSpinner";
import { FaCrown, FaSearch, FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qText, setQText] = useState("");
  const [asc, setAsc] = useState(false);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const app = getApp();
        const db = getFirestore(app);
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

  const filtered = useMemo(() => {
    const ql = qText.trim().toLowerCase();
    const arr = ql ? users.filter(u => (u.name || "").toLowerCase().includes(ql)) : users.slice();
    arr.sort((a,b) => asc ? a.ecoPoints - b.ecoPoints : b.ecoPoints - a.ecoPoints);
    return arr;
  }, [users, qText, asc]);

  if (loading) return <LoadingSpinner />;

  if (users.length === 0) {
    return (
      <div style={{ maxWidth: 900, margin: "2.2rem auto", fontFamily: "'Segoe UI', Tahoma, Verdana, sans-serif" }}>
        <div style={{
          border: "1px solid #d9efe0",
          background: "linear-gradient(135deg,#f6fff9,#eef7ff)",
          padding: "1.2rem 1.3rem",
          borderRadius: 16,
          boxShadow: "0 10px 26px rgba(33,77,56,.12)"
        }}>
          <h2 style={{ margin: 0, color: "#134b28" }}>Eco‑Points Leaderboard</h2>
          <p style={{ marginTop: ".5rem", color: "#377b45" }}>No users available in leaderboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: "2.2rem auto", fontFamily: "'Segoe UI', Tahoma, Verdana, sans-serif" }}>
      <div style={{
        border: "1px solid #cfe9d6",
        borderRadius: 18,
        overflow: "hidden",
        boxShadow: "0 16px 40px rgba(33,77,56,.12)",
        background: "#fff"
      }}>
        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg,#bff3d1,#88d9a9)",
          padding: "1rem 1.2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: ".8rem"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: ".6rem" }}>
            <FaCrown style={{ color: "#f6c431", filter: "drop-shadow(0 1px 2px rgba(0,0,0,.2))" }} size={24} />
            <h2 style={{ margin: 0, color: "#0f5a23" }}>Eco‑Points Leaderboard</h2>
          </div>
          <div style={{ display: "flex", gap: ".6rem", alignItems: "center" }}>
            <div style={{
              position: "relative",
              border: "1.5px solid #bfe6c9",
              borderRadius: 12,
              background: "#fff"
            }}>
              <FaSearch style={{ position: "absolute", left: 10, top: 10, color: "#6aa57a" }} />
              <input
                value={qText}
                onChange={(e) => setQText(e.target.value)}
                placeholder="Search name..."
                style={{
                  padding: ".55rem .8rem .55rem 2rem",
                  border: "none",
                  outline: "none",
                  minWidth: 220,
                  color: "#144c29",
                  borderRadius: 12
                }}
              />
            </div>
            <button
              onClick={() => setAsc(s => !s)}
              style={{
                border: "none",
                background: "linear-gradient(135deg,#67e0a1,#4caf50)",
                color: "#fff",
                padding: ".6rem .8rem",
                borderRadius: 12,
                fontWeight: 800,
                cursor: "pointer",
                boxShadow: "0 8px 22px rgba(76,175,80,.35)"
              }}
              title={asc ? "Sort: Highest first" : "Sort: Lowest first"}
            >
              {asc ? <FaSortAmountUp /> : <FaSortAmountDown />} Sort
            </button>
          </div>
        </div>

        {/* Table */}
        <div style={{ padding: "1rem 1.2rem 1.2rem" }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}>
            <thead>
              <tr style={{ background: "#ecfff2", color: "#1b5e20" }}>
                <th style={th}>Rank</th>
                <th style={thLeft}>Name</th>
                <th style={th}>Eco Points</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user, index) => {
                const rank = index + 1;
                const isTop1 = rank === 1;
                const isTop2 = rank === 2;
                const isTop3 = rank === 3;
                return (
                  <tr key={user.id} style={{ background: "#fff" }}>
                    <td style={{ ...td, fontWeight: 800, color: "#0f5a23" }}>
                      {isTop1 ? "🥇" : isTop2 ? "🥈" : isTop3 ? "🥉" : rank}
                    </td>
                    <td style={{ ...tdLeft, fontWeight: 600, color: "#123f24" }}>{user.name}</td>
                    <td style={{ ...td, fontWeight: 900, color: "#2e7d32" }}>{user.ecoPoints}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Footer hint */}
          <div style={{ marginTop: ".9rem", color: "#3a7b47", fontSize: ".92rem" }}>
            Top {filtered.length} eco champions • Keep completing challenges and quizzes to climb ranks.
          </div>
        </div>
      </div>
    </div>
  );
}

const thBase = {
  padding: "0.8rem",
  borderTop: "1px solid #cfe9d6",
  borderBottom: "1px solid #cfe9d6",
  fontWeight: 800,
  textAlign: "center",
};
const th = { ...thBase };
const thLeft = { ...thBase, textAlign: "left" };

const tdBase = {
  padding: "0.85rem",
  borderBottom: "1px solid #e5f4ea",
  textAlign: "center",
};
const td = { ...tdBase };
const tdLeft = { ...tdBase, textAlign: "left" };
