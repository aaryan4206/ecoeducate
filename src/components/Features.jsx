import React from "react";
import { FaTachometerAlt, FaNewspaper, FaGamepad, FaMedal } from "react-icons/fa";
import "./../styles/Features.css";

const features = [
  {
    title: "Simplistic and User-Friendly Dashboard",
    icon: <FaTachometerAlt className="feature-icon" />
  },
  {
    title: "Learn about the Latest Environmental News",
    icon: <FaNewspaper className="feature-icon" />
  },
  {
    title: "Play Interactive Quizzes and Collect Eco-Points",
    icon: <FaGamepad className="feature-icon" />
  },
  {
    title: "Feature on Daily Leaderboard",
    icon: <FaMedal className="feature-icon" />
  }
];

function Features() {
  return (
    <section id="features" className="features-section">
      <h2>Features</h2>
      <div className="cards-container">
        {features.map(({ title, icon }, index) => (
          <div key={index} className={`feature-card card-${index + 1}`}>
            {icon}
            <p>{title}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;
