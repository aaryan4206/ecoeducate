import './../styles/Navbar.css'
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <nav className="navbar">
      <div className="logo">EcoEducate</div>
      <ul className="nav-links">
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#features">Features</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
      <div className='auth-buttons'>
        <button className="login-btn" onClick={() => navigate("/login")}>Login</button>
        <button className="get-started">Get Started</button>
      </div>
    </nav>
  )
}

export default Navbar