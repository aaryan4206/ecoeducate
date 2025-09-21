import React from "react";
import "./../styles/Footer.css";

function Footer() {
  return (
    <footer className="footer-section">
      <div className="footer-container">
        <div className="footer-about">
          <h3>EcoEducate</h3>
          <p>
            Empowering environmental education through gamification and real-world action. Building a sustainable future aligned with NEP 2020 and UN SDG goals.
          </p>
        </div>
        <div className="footer-contact">
          <h4>Contact</h4>
          <ul>
            <li>Email: <a href="mailto:support@ecoeducate.in">support@ecoeducate.in</a></li>
            <li>Phone: <a href="tel:+919876543210">+91 98765 43210</a></li>
            <li>Location: New Delhi, India</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2024 EcoEducate. Empowering environmental education for a sustainable future.</p>
      </div>
    </footer>
  );
}

export default Footer;
