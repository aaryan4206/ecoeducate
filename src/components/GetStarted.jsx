import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import "./../styles/AuthForm.css";

const db = getFirestore();

function GetStarted() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      // Create user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save additional data (name, email) in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: email,
        createdAt: new Date()
      });

      await setDoc(doc(db, "eco-points", user.uid), {
        name: name,
        email: email,
        eco_points: 0,
      });

      navigate("/dashboard"); // Redirect after signup
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Get Started with EcoEducate</h2>
      <form className="auth-form" onSubmit={handleSignUp}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
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
          minLength={6}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
          minLength={6}
        />
        {error && <div className="auth-error">{error}</div>}
        <button type="submit">Create Account</button>
      </form>
    </div>
  );
}

export default GetStarted;
