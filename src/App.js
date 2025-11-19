import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import AdminSummary from "./AdminSummary";
import logo from "./assets/logo.png";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import JoinPage from "./JoinPage";

function App() {
  const [phone, setPhone] = useState("");
  const [customer, setCustomer] = useState(null);
  const [addAmount, setAddAmount] = useState("");
  const [redeemPoints, setRedeemPoints] = useState("");
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [showAdmin, setShowAdmin] = useState(false);

  const backendURL = "https://loyalty-backend-zhzw.onrender.com/api";

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleFetch = async () => {
    try {
      const res = await axios.get(`${backendURL}/customer/${phone}`);
      if (res.data) {
        setCustomer(res.data);
        setMessage("");
      } else {
        setCustomer(null);
        setMessage("Customer not found");
      }
    } catch {
      setCustomer(null);
      setMessage("Error fetching customer");
    }
  };

  const handleAddPoints = async () => {
    if (!addAmount || !phone) {
      setMessage("⚠️ Please enter phone number and amount");
      return;
    }

    try {
      await axios.post(`${backendURL}/add-points`, {
        phone,
        amount: Number(addAmount),
      });
      setMessage("✅ Points added successfully!");
      handleFetch();
      setAddAmount("");
    } catch {
      setMessage("❌ Error adding points");
    }
  };

  const handleRedeem = async () => {
    if (!redeemPoints || !phone) {
      setMessage("⚠️ Please enter phone number and points");
      return;
    }

    try {
      await axios.post(`${backendURL}/redeem`, {
        phone,
        points: Number(redeemPoints),
      });
      setMessage("🎁 Points redeemed successfully!");
      handleFetch();
      setRedeemPoints("");
    } catch {
      setMessage("❌ Error redeeming points");
    }
  };

  const handleCreateCustomer = async () => {
    try {
      await axios.post(`${backendURL}/customers`, {
        name: newName,
        phone: newPhone,
      });
      setMessage(`🎉 New customer added: ${newName}`);
      setNewName("");
      setNewPhone("");
      setShowModal(false);
    } catch {
      setMessage("Error creating customer");
    }
  };

  return (
    <Router>
      <Routes>

        {/* ⭐ QR Join Page Route */}
        <Route path="/join" element={<JoinPage />} />

        {/* ⭐ Main App Route */}
        <Route
          path="/"
          element={
            <div className="container">
              <div className="card">
                {/* === ADMIN MODE === */}
                {showAdmin ? (
                  <>
                    {/* Back Button */}
                    <div className="admin-toggle-wrapper">
                      <button
                        className="admin-btn"
                        onClick={() => setShowAdmin(false)}
                      >
                        🏠 Back to Loyalty App
                      </button>
                    </div>

                    {/* Admin Summary Page */}
                    <AdminSummary />
                  </>
                ) : (
                  <>
                    {/* === LOGO HEADER === */}
                    <div className="header">
                      <div className="logo-wrapper">
                        <img src={logo} alt="Shop Logo" className="app-logo" />
                      </div>
                    </div>

                    {/* === CHECK BALANCE === */}
                    <div className="input-group">
                      <input
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        placeholder="Enter phone number"
                        value={phone}
                        onChange={(e) =>
                          setPhone(e.target.value.replace(/\D/g, ""))
                        }
                      />
                      <button className="primary-btn" onClick={handleFetch}>
                        Check Balance
                      </button>
                    </div>

                    {/* === ADD NEW CUSTOMER === */}
                    <button
                      className="secondary-btn"
                      onClick={() => setShowModal(true)}
                    >
                      ➕ Add New Customer
                    </button>

                    {/* === CUSTOMER CARD === */}
                    {customer && (
                      <div className="customer-card">
                        <h2>{customer.name}</h2>
                        <p>📞 {customer.phone}</p>
                        <h3>{customer.points} Points</h3>
                      </div>
                    )}

                    {/* === ADD AMOUNT === */}
                    <div className="section-group">
                      <label className="section-label">💰 Add Amount</label>
                      <div className="input-group">
                        <input
                          type="number"
                          placeholder="Enter amount to add"
                          value={addAmount}
                          onChange={(e) => setAddAmount(e.target.value)}
                        />
                        <button className="success-btn" onClick={handleAddPoints}>
                          ➕ Add Points
                        </button>
                      </div>
                    </div>

                    {/* === REDEEM === */}
                    <div className="section-group">
                      <label className="section-label">🎁 Redeem Points</label>
                      <div className="input-group">
                        <input
                          type="number"
                          placeholder="Enter points to redeem"
                          value={redeemPoints}
                          onChange={(e) => setRedeemPoints(e.target.value)}
                        />
                        <button className="danger-btn" onClick={handleRedeem}>
                          Redeem
                        </button>
                      </div>
                    </div>

                    {/* Messages */}
                    {message && (
                      <p key={message} className="message fade-in">
                        {message}
                      </p>
                    )}

                    {/* === ADMIN BUTTON AT BOTTOM === */}
                    <div className="admin-toggle-wrapper">
                      <button
                        className="admin-btn"
                        onClick={() => setShowAdmin(true)}
                      >
                        📊 View Admin Summary
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* === MODAL === */}
              {showModal && (
                <div
                  className="modal-overlay"
                  onClick={() => setShowModal(false)}
                >
                  <div
                    className="modal-card"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h2>Add New Customer</h2>
                    <p className="modal-subtext">
                      Enter customer details below.
                    </p>

                    <input
                      type="text"
                      placeholder="Customer Name"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                    />

                    <input
                      type="tel"
                      inputMode="numeric"
                      placeholder="Phone Number"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                    />

                    <div className="modal-buttons">
                      <button
                        className="success-btn"
                        onClick={handleCreateCustomer}
                      >
                        💾 Save
                      </button>
                      <button
                        className="danger-btn"
                        onClick={() => setShowModal(false)}
                      >
                        ✖ Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
