import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
        const response = await fetch(`http://localhost:8080/api/auth/forgot-password?email=${encodeURIComponent(email)}`, {
        method: "POST"
        });

        if (!response.ok) {
            throw new Error("Failed to send reset link");
        }

      setMessage("Password reset link sent. Please check your email.");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#f0f4f8" }}>
      <form onSubmit={handleForgotPassword} style={{ background: "white", padding: "2rem", borderRadius: "10px", width: "300px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
        <h2 style={{ marginBottom: "1rem", color: "#007bff", textAlign: "center" }}>🎯 Forgot Password</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>Send Reset Link</button>
        {message && <p style={{ color: "green", fontSize: "0.9rem" }}>{message}</p>}
        {error && <p style={{ color: "red", fontSize: "0.9rem" }}>{error}</p>}
      </form>
    </div>
  );
}

const inputStyle = {
  display: "block",
  width: "100%",
  padding: "10px",
  marginBottom: "1rem",
  border: "1px solid #ccc",
  borderRadius: "5px",
};

const buttonStyle = {
  width: "100%",
  padding: "10px",
  background: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};
