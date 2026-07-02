import { useState, useEffect, useRef, useCallback } from 'react';
import { useChoiceContext } from '../App';

function TypewriterText({ text, speed = 30, onComplete }) {
  const [displayed, setDisplayed] = useState('');
  const [isDone, setIsDone] = useState(false);
  const indexRef = useRef(0);
  const timerRef = useRef(null);

  useEffect(() => {
    setDisplayed('');
    indexRef.current = 0;
    setIsDone(false);

    timerRef.current = setInterval(() => {
      if (indexRef.current < text.length) {
        setDisplayed(text.slice(0, indexRef.current + 1));
        indexRef.current++;
      } else {
        clearInterval(timerRef.current);
        setIsDone(true);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(timerRef.current);
  }, [text, speed]);

  const skip = useCallback(() => {
    clearInterval(timerRef.current);
    setDisplayed(text);
    indexRef.current = text.length;
    setIsDone(true);
    onComplete?.();
  }, [text, onComplete]);

  return (
    <div className="story-text" onClick={skip} style={{ cursor: 'pointer' }}>
      {displayed}
      {!isDone && <span className="typewriter-cursor" />}
    </div>
  );
}

function Confetti() {
  const pieces = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    color: ['#f0a85e', '#a78bdb', '#6bcb7a', '#e74c5c', '#f5c58e', '#7c5cbf'][Math.floor(Math.random() * 6)],
    duration: `${Math.random() * 2 + 2}s`,
    delay: `${Math.random() * 1.5}s`,
    size: `${Math.random() * 6 + 4}px`,
  }));

  return (
    <div className="confetti-container">
      {pieces.map(p => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: p.left,
            background: p.color,
            animationDuration: p.duration,
            animationDelay: p.delay,
            width: p.size,
            height: p.size,
          }}
        />
      ))}
    </div>
  );
}

function StoryGame({ story, onNewStory }) {
  const { totalChoices, pathHistory, addChoice, resetChoices } = useChoiceContext();
  const [currentNodeId, setCurrentNodeId] = useState(null);
  const [currentNode, setCurrentNode] = useState(null);
  const [currentOptions, setCurrentOptions] = useState([]);
  const [isEnding, setIsEnding] = useState(false);
  const [isWinningEnding, setIsWinningEnding] = useState(false);
  const [typingDone, setTypingDone] = useState(false);
  const topRef = useRef(null);
  const storyIdRef = useRef(null);

  useEffect(() => {
    if (story && story.root_node) {
      if (story.id !== storyIdRef.current) {
        resetChoices();
        storyIdRef.current = story.id;
      }
      setCurrentNodeId(story.root_node.id);
    }
  }, [story]);

  useEffect(() => {
    if (currentNodeId && story && story.all_nodes) {
      setTypingDone(false);
      const node = story.all_nodes[currentNodeId];
      const timer = setTimeout(() => {
        setCurrentNode(node);
        setIsEnding(node.is_ending);
        setIsWinningEnding(node.is_winning_ending);
        if (!node.is_ending && node.options && node.options.length > 0) {
          setCurrentOptions(node.options);
        } else {
          setCurrentOptions([]);
        }
        if (topRef.current) {
          topRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [currentNodeId, story]);

  const handleChooseOption = (optionId, optionText) => {
    if (optionId == null) return;
    addChoice(optionText);
    setCurrentNodeId(optionId);
  };

  const handleRestart = () => {
    resetChoices();
    if (story && story.root_node) {
      setCurrentNodeId(story.root_node.id);
    }
  };

  const getOptionIcon = (index) => {
    const icons = ['🗡️', '🧪', '🔮', '🏹', '📜', '⚗️'];
    return icons[index % icons.length];
  };

  const getTruncated = (text, len = 18) => text.length > len ? text.slice(0, len) + '…' : text;

  return (
    <div className="story-game" ref={topRef}>
      <div className="story-path-bar">
        {pathHistory.length > 0 ? (
          <>
            <span>Path:</span>
            {pathHistory.map((step, i) => (
              <span key={i} className="path-step">
                {i > 0 && <span className="path-arrow">→</span>}
                <span className={`step-label ${i === pathHistory.length - 1 ? 'active' : ''}`}>
                  {getTruncated(step)}
                </span>
              </span>
            ))}
          </>
        ) : (
          <span style={{ color: 'var(--text-muted)' }}>Your adventure awaits...</span>
        )}
      </div>

      <header className="story-header">
        <h2>{story.title}</h2>
        <div className="story-meta">
          <span>📖 {totalChoices > 0 ? `${totalChoices} choices made` : 'New journey'}</span>
          {currentNodeId !== story.root_node?.id && totalChoices > 0 && (
            <span>📍 Step {totalChoices}</span>
          )}
        </div>
      </header>

      <div className="story-content">
        {currentNode && (
          <div className="story-node">
            <TypewriterText
              key={currentNodeId}
              text={currentNode.content}
              speed={25}
              onComplete={() => setTypingDone(true)}
            />

            {isEnding ? (
              <div className={`story-ending ${isWinningEnding ? 'winning' : 'losing'}`}>
                {isWinningEnding && <Confetti />}
                <span className="ending-emoji">{isWinningEnding ? '🏆' : '💀'}</span>
                <h3>{isWinningEnding ? 'Victory!' : 'The End'}</h3>
                <p>
                  {isWinningEnding
                    ? 'You found the winning path. Well played, adventurer!'
                    : 'Your journey ends here. Try a different path next time.'}
                </p>
              </div>
            ) : (
              typingDone && (
                <div className="story-options">
                  <h3>What will you do?</h3>
                  <div className="options-list">
                    {currentOptions.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleChooseOption(option.node_id, option.text)}
                        className="option-btn"
                      >
                        <span className="option-icon">{getOptionIcon(index)}</span>
                        <span className="option-text">{option.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        )}

        <div className="story-controls">
          <button onClick={handleRestart} className="reset-btn">🔄 Restart Story</button>
          {onNewStory && (
            <button className="new-story-btn" onClick={onNewStory}>✨ New Story</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default StoryGame;
