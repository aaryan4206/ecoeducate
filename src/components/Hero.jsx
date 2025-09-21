import React from "react";
import "./../styles/Hero.css";
import heroImage from "./../assets/hero.jpg"; // Replace with actual image path
import { useNavigate } from "react-router-dom";

function HeroSection() {
  const navigate = useNavigate();
  return (
    <section id="home" className="hero-section">
      <div className="hero-text">
        <span className="tagline">Transforming Environmental Education</span>
        <h1>
          Learn, Play, and <span className="highlight">Save the Planet</span>
        </h1>
        <p>
          Join India's most engaging environmental education platform where students earn eco-points,
          complete real-world challenges, and compete with schools nationwide to create a sustainable future.
        </p>
        <div className="hero-buttons">
          <button className="primary-btn" onClick={() => navigate("/get-started")}>Get Started</button>
          <a href='#about'><button className="secondary-btn">Know More</button></a>
        </div>
        <div className="stats">
          <div>
            <h3>50K+</h3>
            <p>Active Students</p>
          </div>
          <div>
            <h3>1000+</h3>
            <p>Schools</p>
          </div>
          <div>
            <h3>95%</h3>
            <p>Engagement</p>
          </div>
        </div>
      </div>

      <div className="hero-image-wrapper">
        <img src={heroImage} alt="Kids planting trees" className="hero-image" />
        <div className="eco-points-badge">+50 Eco Points<br />Tree Planted!</div>
        <div className="team-challenge-badge">Team Challenge<br />Join 15 others</div>
      </div>
    </section>
  );
}

export default HeroSection;
