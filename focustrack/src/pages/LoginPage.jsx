import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error("Invalid credentials");

      const data = await response.json();
      localStorage.setItem("token", data.token);
      setSuccess("Login successful!");
      navigate("/home");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={leftStyle}>
        <img src="/focustrack.png" alt="FocusTrack Logo" style={logoStyle} />
        <h1 style={brandTextStyle}>FocusTrack</h1>
        <p style={sloganStyle}>Plan Goals. Stay on Track.</p>
      </div>

      <form onSubmit={handleLogin} style={formStyle}>
        <h2 style={formTitle}>🎯 Login</h2>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          style={inputStyle}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          style={inputStyle}
        />

        <button type="submit" style={buttonStyle}>Log in</button>

        <p style={{ marginTop: "1rem", textAlign: "center" }}>
          <Link to="/forgot-password" style={linkStyle}>
            Forgotten password?
          </Link>
        </p>
        <p style={{ textAlign: "center", fontSize: "0.9rem" }}>
          Don’t have an account? <Link to="/register" style={linkStyle}>Register</Link>
        </p>

        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
        {success && <p style={{ color: "green", textAlign: "center" }}>{success}</p>}
      </form>
    </div>
  );
}

// 🧩 Styling
const pageStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  background: "#eaf4fb",
  padding: "2rem",
};

const leftStyle = {
  marginRight: "4rem",
  textAlign: "right",
};

const logoStyle = {
  width: "80px",
  height: "80px",
  marginBottom: "0.5rem",
};

const brandTextStyle = {
  fontSize: "2.5rem",
  color: "#007bff",
  margin: 0,
  fontWeight: "bold",
};

const sloganStyle = {
  fontSize: "1.1rem",
  color: "#333",
  maxWidth: "250px",
  marginTop: "0.5rem",
};

const formStyle = {
  background: "white",
  padding: "2rem",
  borderRadius: "10px",
  width: "320px",
  boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
};

const formTitle = {
  color: "#007bff",
  textAlign: "center",
  fontSize: "1.5rem",
  marginBottom: "1.5rem",
};

const inputStyle = {
  display: "block",
  width: "100%",
  padding: "12px",
  fontSize: "1rem",
  marginBottom: "1rem",
  border: "1px solid #ccc",
  borderRadius: "5px",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  fontSize: "1rem",
  background: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

const linkStyle = {
  color: "#007bff",
  textDecoration: "none",
};
