import React, { useState, useEffect } from 'react';
import { Star, Send, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import './App.css';

function App() {
  const [wish, setWish] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  // Countdown Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  function calculateTimeLeft() {
    const christmas = new Date(new Date().getFullYear(), 11, 25);
    if (new Date() > christmas) {
      christmas.setFullYear(christmas.getFullYear() + 1);
    }
    const difference = +christmas - +new Date();
    
    let timeLeft = {};
    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  }

  // Handle Wishing
  const handleSendWish = (e) => {
    e.preventDefault();
    if (!wish.trim()) return;

    setIsSent(true);
    triggerConfetti();
    
    // Reset after animation
    setTimeout(() => {
      setIsSent(false);
      setWish('');
    }, 3000);
  };

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
  };

  return (
    <div className="app-container">
      {/* Background Snow Effect (CSS based) */}
      <div className="snow"></div>
      <div className="snow mid"></div>
      <div className="snow close"></div>

      <main className="content">
        
        {/* The Main Star */}
        <motion.div 
          className="star-container"
          animate={{ 
            scale: isSent ? [1, 1.5, 1] : [1, 1.1, 1],
            rotate: isSent ? 360 : 0,
            filter: isSent ? "drop-shadow(0 0 50px #ffd700)" : "drop-shadow(0 0 15px #ffd700)"
          }}
          transition={{ 
            duration: isSent ? 1 : 4, 
            repeat: isSent ? 0 : Infinity,
            type: "spring"
          }}
        >
          <Star size={120} color="#ffd700" fill="#ffd700" strokeWidth={1} />
        </motion.div>

        {/* Title */}
        <h1 className="title">The Christmas Star</h1>
        <p className="subtitle">Make a wish and light up the sky</p>

        {/* Countdown */}
        <div className="countdown">
          <div className="time-box">
            <span>{timeLeft.days || 0}</span>
            <label>Days</label>
          </div>
          <div className="time-box">
            <span>{timeLeft.hours || 0}</span>
            <label>Hours</label>
          </div>
          <div className="time-box">
            <span>{timeLeft.minutes || 0}</span>
            <label>Mins</label>
          </div>
          <div className="time-box">
            <span>{timeLeft.seconds || 0}</span>
            <label>Secs</label>
          </div>
        </div>

        {/* Input Form */}
        <form className="wish-form" onSubmit={handleSendWish}>
          <input 
            type="text" 
            placeholder="Type your Christmas wish..." 
            value={wish}
            onChange={(e) => setWish(e.target.value)}
            disabled={isSent}
          />
          <button type="submit" disabled={isSent || !wish}>
            {isSent ? <Sparkles className="icon-spin" /> : <Send />}
          </button>
        </form>

        {isSent && <p className="success-message">Your wish has been sent to the stars!</p>}
      </main>
      
      <footer className="footer">
        Created for the Competition
      </footer>
    </div>
  );
}

export default App;
