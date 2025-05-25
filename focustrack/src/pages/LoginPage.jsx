import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate(); // ✅ for navigation
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      setSuccess("Login successful!");

      // ✅ Redirect to Home
      navigate("/home");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#f0f4f8" }}>
      <form onSubmit={handleLogin} style={{ background: "white", padding: "2rem", borderRadius: "10px", width: "300px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
        <h2 style={{ marginBottom: "1rem", color: "#007bff", textAlign: "center" }}>🎯 Login</h2>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required style={inputStyle} />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required style={inputStyle} />
        <button type="submit" style={buttonStyle}>Login</button>
        <p style={{ marginTop: "1rem", fontSize: "0.9rem", textAlign: "center" }}>
          <Link to="/forgot-password" style={{ color: "#007bff", textDecoration: "none" }}>
            Forgot your password?
          </Link>
        </p>
        <p style={{ textAlign: "center", fontSize: "0.9rem" }}>
          Don’t have an account? <Link to="/register" style={{ color: "#007bff" }}>Register</Link>
        </p>

        {error && <p style={{ color: "red", fontSize: "0.9rem" }}>{error}</p>}
        {success && <p style={{ color: "green", fontSize: "0.9rem" }}>{success}</p>}
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
