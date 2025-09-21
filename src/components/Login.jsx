import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import "./../styles/AuthForm.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard"); // Redirect after login
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-background">
      <div className="auth-container">
        <h2>Login</h2>
        <form className="auth-form" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && <div className="auth-error">Invalid Email ID/Password</div>}

          <button type="submit">Login</button>

          {/* <div style={{ marginTop: "1rem", fontSize: "0.9rem" }}>
            <a href="/reset-password" style={{ color: "#2e7d32", fontWeight: "600", textDecoration: "none" }}>
              Forgot password?
            </a>
          </div> */}
          <div style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>
            Don’t have an account?{" "}
            <a href="/get-started" style={{ color: "#2e7d32", fontWeight: "600", textDecoration: "none" }}>
              Sign up
            </a>
          </div>
        </form>

      </div>
    </div>
  );
}

export default Login;
