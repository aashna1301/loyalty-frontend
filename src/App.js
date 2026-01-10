import React, { useState, useEffect } from "react";
import "./App.css";
import AdminSummary from "./AdminSummary";
import logo from "./assets/logo.png";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import JoinPage from "./JoinPage";
import {
  createOrFetchCustomer,
  getCustomer,
  addPoints,
  redeemPoints
} from "./firebaseService";

function App() {
  const [phone, setPhone] = useState("");
  const [customer, setCustomer] = useState(null);
  const [addAmount, setAddAmount] = useState("");
  const [redeemPointsValue, setRedeemPointsValue] = useState("");
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [showAdmin, setShowAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleFetch = async () => {
    if (!phone) {
      setMessage("⚠️ Please enter phone number");
      return;
    }

    setIsLoading(true);
    try {
      const res = await getCustomer(phone);
      if (res) {
        setCustomer(res);
        setMessage("");
      } else {
        setCustomer(null);
        setMessage("Customer not found");
      }
    } catch {
      setCustomer(null);
      setMessage("Error fetching customer");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPoints = async () => {
    if (!addAmount || !phone) {
      setMessage("⚠️ Please enter phone number and amount");
      return;
    }

    setIsLoading(true);
    try {
      const updatedCustomer = await addPoints(phone, Number(addAmount));
      setCustomer(updatedCustomer);
      setMessage("✅ Points added successfully!");
      setAddAmount("");
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRedeem = async () => {
    if (!redeemPointsValue || !phone) {
      setMessage("⚠️ Please enter phone number and points");
      return;
    }

    setIsLoading(true);
    try {
      const updatedCustomer = await redeemPoints(phone, Number(redeemPointsValue));
      setCustomer(updatedCustomer);
      setMessage("🎁 Points redeemed successfully!");
      setRedeemPointsValue("");
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCustomer = async () => {
    if (!newName || !newPhone) {
      setMessage("⚠️ Please enter name and phone number");
      return;
    }

    setIsLoading(true);
    try {
      await createOrFetchCustomer(newName, newPhone);
      setMessage(`🎉 New customer added: ${newName}`);
      setNewName("");
      setNewPhone("");
      setShowModal(false);
    } catch {
      setMessage("Error creating customer");
    } finally {
      setIsLoading(false);
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
                        disabled={isLoading}
                      />
                      <button className="primary-btn" onClick={handleFetch} disabled={isLoading}>
                        {isLoading ? "Loading..." : "Check Balance"}
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
                          disabled={isLoading}
                        />
                        <button className="success-btn" onClick={handleAddPoints} disabled={isLoading}>
                          {isLoading ? "Adding..." : "➕ Add Points"}
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
                          value={redeemPointsValue}
                          onChange={(e) => setRedeemPointsValue(e.target.value)}
                          disabled={isLoading}
                        />
                        <button className="danger-btn" onClick={handleRedeem} disabled={isLoading}>
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
                        disabled={isLoading}
                      >
                        {isLoading ? "Creating..." : "💾 Save"}
                      </button>
                      <button
                        className="danger-btn"
                        onClick={() => setShowModal(false)}
                        disabled={isLoading}
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
