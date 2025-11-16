import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminSummary.css";

const backendURL = "https://loyalty-backend-zhzw.onrender.com/api";

function AdminSummary() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get(`${backendURL}/summary`);
        setSummary(res.data);
      } catch (err) {
        console.error("Error fetching summary:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) return <p className="loading">⏳ Loading summary...</p>;

  return (
    <div className="summary-container">
      <h1>📊 Admin Summary</h1>

      {summary ? (
        <>
          <div className="summary-overview">
            <div className="summary-box">
              <h2>{summary.totalCustomers}</h2>
              <p>Total Customers</p>
            </div>
            <div className="summary-box">
              <h2>{summary.totalPoints}</h2>
              <p>Total Points in System</p>
            </div>
          </div>

          <div className="table-wrapper">
            <h3>Top Customers</h3>
            <table className="summary-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Total Purchase (₹)</th>
                  <th>Points</th>
                </tr>
              </thead>
              <tbody>
                {summary.customers.map((c, idx) => (
                  <tr key={idx}>
                    <td>{c.name}</td>
                    <td>{c.phone}</td>
                    <td>{c.totalPurchase.toLocaleString()}</td>
                    <td>{c.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <p className="error-text">❌ Unable to load summary</p>
      )}
    </div>
  );
}

export default AdminSummary;
