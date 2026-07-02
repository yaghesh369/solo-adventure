import { useState, createContext, useContext } from 'react';
import './App.css'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import StoryLoader from './components/StoryLoader';
import StoryGenerator from './components/StoryGenerator';

const ChoiceContext = createContext();

export function useChoiceContext() {
  return useContext(ChoiceContext);
}

export function ChoiceProvider({ children }) {
  const [totalChoices, setTotalChoices] = useState(0);
  const [currentDepth, setCurrentDepth] = useState(0);
  const [pathHistory, setPathHistory] = useState([]);

  const addChoice = (label) => {
    setTotalChoices(prev => prev + 1);
    setCurrentDepth(prev => prev + 1);
    setPathHistory(prev => [...prev, label]);
  };

  const resetChoices = () => {
    setTotalChoices(0);
    setCurrentDepth(0);
    setPathHistory([]);
  };

  return (
    <ChoiceContext.Provider value={{ totalChoices, currentDepth, pathHistory, addChoice, resetChoices }}>
      {children}
    </ChoiceContext.Provider>
  );
}

function Particles() {
  const [particles] = useState(() =>
    Array.from({ length: 25 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 3 + 2}px`,
      duration: `${Math.random() * 18 + 10}s`,
      delay: `${Math.random() * 12}s`,
    }))
  );

  return (
    <div className="particles">
      {particles.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            animationDuration: p.duration,
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  );
}

function App() {
  return (
    <ChoiceProvider>
      <Router>
        <Particles />
        <div className="app-container">
          <header>
            <h1>Interactive Story Generator</h1>
            <p>Choose Your Own Adventure</p>
          </header>
          <main>
            <Routes>
              <Route path="/story/:id" element={<StoryLoader/>}/>
              <Route path="/" element={<StoryGenerator/>}/>
            </Routes>
          </main>
        </div>
      </Router>
    </ChoiceProvider>
  )
}

export default App
