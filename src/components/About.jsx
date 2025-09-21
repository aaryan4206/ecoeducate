import React from "react";
import "./../styles/About.css";

function About() {
  return (
    <section id="about" className="about-section">
      <h2>About EcoEducate</h2>
      <div className="lists-container">
        <div className="list-column">
          <h3>Mission</h3>
          <ul>
            <li>Transform environmental education with experiential learning.</li>
            <li>Empower students to take real-world sustainable action.</li>
            <li>Engage eco-conscious communities through gamification.</li>
            <li>Support India's SDG and NEP 2020 educational goals.</li>
          </ul>
        </div>
        <div className="list-column">
          <h3>Vision</h3>
          <ul>
            <li>A generation of environmental champions in every school.</li>
            <li>Widespread adoption of sustainable habits and lifestyle.</li>
            <li>Schools and communities collaborating for ecological health.</li>
            <li>A greener future for India and the planet.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default About;
