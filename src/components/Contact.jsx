import React from "react";
import "./../styles/Contact.css";

function Contact() {
  return (
    <section className="contact-section" id="contact">
      <h2>Contact Us</h2>
      <div className="contact-container">
        <div className="contact-info">
          <p>Email: <a href="mailto:support@ecoeducate.in">support@ecoeducate.in</a></p>
          <p>Phone: <a href="tel:+919876543210">+91 98765 43210</a></p>
          <p>Address: New Delhi, India</p>
        </div>

        <form className="contact-form" onSubmit={e => e.preventDefault()}>
          <input type="text" name="name" placeholder="Your Name" required />
          <input type="email" name="email" placeholder="Your Email" required />
          <textarea name="message" placeholder="Your Message" rows="5" required></textarea>
          <button type="submit">Send Message</button>
        </form>
      </div>
    </section>
  );
}

export default Contact;
