import './App.css'
import Navbar from './components/Navbar.jsx'
import HeroSection from './components/Hero.jsx'
import About from './components/About.jsx'
import Features from './components/Features.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login.jsx';
import GetStarted from './components/GetStarted.jsx';
import Sidebar from './components/Sidebar.jsx'
import Dashboard from './components/Dashboard.jsx'
import News from './components/News.jsx';
import Quizzes from './components/Quiz.jsx'
import Leaderboard from './components/Leaderboard.jsx';

function App() {
  
  return (
    <>
      <Routes>
        <Route path="/" element={
          <>
            <Navbar />
            <HeroSection />
            <About />
            <Features />
            <Contact />
            <Footer />
          </>
        } />
        <Route path='/about' element={<About/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/dashboard" element={
          <>
            <Sidebar />
            <Dashboard/>
          </>
        } />
        <Route path="/news" element={
          <>
            <Sidebar />
            <News/>
          </>
        } />
        <Route path="/quizzes" element={
          <>
            <Sidebar />
            <Quizzes/>
          </>
        } />
        <Route path="/leaderboard" element={
          <>
            <Sidebar />
            <Leaderboard/>
          </>
        } />
      </Routes>
    </>
    
  );
}

export default App
