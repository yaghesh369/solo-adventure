import { useState } from 'react'

const SUGGESTIONS = [
  { label: 'Pirates', emoji: '🏴‍☠️' },
  { label: 'Space', emoji: '🚀' },
  { label: 'Medieval', emoji: '🏰' },
  { label: 'Cyberpunk', emoji: '🤖' },
  { label: 'Dragons', emoji: '🐉' },
  { label: 'Underwater', emoji: '🌊' },
  { label: 'Time Travel', emoji: '⏳' },
  { label: 'Mythology', emoji: '⚡' },
];

function ThemeInput({ onSubmit }) {
  const [theme, setTheme] = useState('')
  const [error, setError] = useState('')
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!theme.trim()) {
      setError('Please enter a theme')
      return
    }
    setError('')
    onSubmit(theme)
  }
  return (
    <div className="theme-input-container">
      <h2>Generate Your Adventure</h2>
      <p>Enter a theme for your interactive story</p>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            value={theme}
            onChange={(e) => { setTheme(e.target.value); setError(''); }}
            placeholder="Enter a theme (eg. pirates, space, medieval...)"
            className={error ? 'error' : ''}
          />
          {error && <p className="error-text">{error}</p>}
        </div>
        <button type="submit" className="generate-btn">
          Generate Story
        </button>
      </form>
      <div className="theme-suggestions">
        <p>Quick picks</p>
        <div className="theme-grid">
          {SUGGESTIONS.map(s => (
            <button
              key={s.label}
              type="button"
              className="theme-card"
              onClick={() => { setTheme(s.label); setError(''); }}
            >
              <span className="emoji">{s.emoji}</span>
              <span className="label">{s.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ThemeInput
