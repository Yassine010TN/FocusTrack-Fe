import { useState } from "react";
import { Link } from "react-router-dom";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [description, setDescription] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    try {
      const response = await fetch("http://localhost:8080/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, description }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || "Registration failed");
      }

      setSuccess("Registration successful! You can now login.");
      setEmail("");
      setPassword("");
      setDescription("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#f0f4f8" }}>
      <form onSubmit={handleRegister} style={{ background: "white", padding: "2rem", borderRadius: "10px", width: "300px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
        <h2 style={{ marginBottom: "1rem", color: "#007bff", textAlign: "center" }}>🎯 Register</h2>

        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required style={inputStyle} />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required style={inputStyle} />
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description (optional)" style={inputStyle} />

        <button type="submit" style={buttonStyle}>Register</button>
        <p style={{ textAlign: "center", fontSize: "0.9rem" }}>
          Already have an account? <Link to="/login" style={{ color: "#007bff" }}>Login</Link>
        </p>
        {success && <p style={{ color: "green", fontSize: "0.9rem", marginTop: "1rem" }}>{success}</p>}
        {error && <p style={{ color: "red", fontSize: "0.9rem", marginTop: "1rem" }}>{error}</p>}

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
