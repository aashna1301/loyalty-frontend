import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function JoinPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const backendURL = "https://loyalty-backend-zhzw.onrender.com/api";

  const handleSubmit = async () => {
    if (!name || !phone) {
      setMessage("⚠️ Please enter name and phone number");
      return;
    }

    try {
      await axios.post(`${backendURL}/customers`, { name, phone });
      setMessage("🎉 You’ve successfully joined the loyalty program!");
      setName("");
      setPhone("");
    } catch (err) {
      setMessage("❌ Error joining. Please try again.");
    }
  };

  return (
    <div className="container">
      <div className="card">

        <h2 style={{ textAlign: "center", marginBottom: 15 }}>Join Loyalty Program</h2>

        <div className="input-group">
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="input-group">
          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
            maxLength={10}
          />
        </div>

        <button className="primary-btn" onClick={handleSubmit}>
          Join Program
        </button>

        {message && <p className="message fade-in">{message}</p>}
      </div>
    </div>
  );
}

export default JoinPage;
