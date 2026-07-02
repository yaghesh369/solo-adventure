import { useState, useEffect } from "react";

const MESSAGES = [
  "Forging your path...",
  "Summoning adventures...",
  "Weaving the narrative...",
  "Brewing excitement...",
  "Unfolding mysteries...",
  "Charting unknown lands...",
  "Awakening ancient powers...",
];

function LoadingStatus({ theme }) {
  const [elapsed, setElapsed] = useState(0);
  const [msgIndex, setMsgIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const msgInterval = setInterval(() => {
      setMsgIndex(prev => (prev + 1) % MESSAGES.length);
    }, 3000);
    return () => clearInterval(msgInterval);
  }, []);
  return (
    <div className="loading-container">
      <h2>Crafting Your {theme} Story</h2>
      <p className="loading-subtitle">The AI is weaving an interactive tale just for you...</p>
      <div className="loading-animation">
        <div className="book-spinner">
          <div className="page"></div>
          <div className="page"></div>
          <div className="page"></div>
        </div>
      </div>
      <div className="loading-dots">
        <div className="loading-dot"></div>
        <div className="loading-dot"></div>
        <div className="loading-dot"></div>
      </div>
      <div className="loading-messages">
        <span className="loading-message" key={msgIndex}>{MESSAGES[msgIndex]}</span>
      </div>
      <p className="loading-time">Elapsed time: {elapsed}s</p>
    </div>
  );
}

export default LoadingStatus;
