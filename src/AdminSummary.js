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
        <div className="summary-cards">
          <div className="summary-card">
            <h2>{summary.totalCustomers}</h2>
            <p>Total Customers</p>
          </div>
          <div className="summary-card">
            <h2>{summary.totalPoints}</h2>
            <p>Total Points in System</p>
          </div>
        </div>
      ) : (
        <p className="error-text">❌ Unable to load summary</p>
      )}
    </div>
  );
}

export default AdminSummary;
