# Solo Adventure

An AI-powered **Choose Your Own Adventure** story generator. Enter a theme and explore branching narratives generated on the fly — every choice shapes your unique journey.

**Live Demo:** [https://solo-adventure-livid.vercel.app](https://solo-adventure-livid.vercel.app)

---

## Stack

| Layer | Technology | Hosting |
|---|---|---|
| **Frontend** | React + Vite | Vercel |
| **Backend** | FastAPI + SQLAlchemy | Render |
| **Database** | PostgreSQL (Neon) | Neon |
| **AI** | Groq (Llama 3.3 70B) | Groq API |

## Features

- **AI-generated stories** — dynamic branching narratives via Llama 3.3 70B
- **Typewriter text** — immersive content reveal with smooth animations
- **Choices matter** — each decision leads to different paths and endings
- **Winning & losing endings** — find the victory path to complete your adventure
- **Path tracking** — visual history of the choices you've made
- **Confetti celebration** — celebratory effects on winning endings
- **Persistent sessions** — stories tied to your browser session
- **Dark fantasy UI** — themed design with particle background effects

## Project Structure

```
solo-adventure/
├── backend/                  # FastAPI backend
│   ├── core/                 # Config, prompts, story generator
│   ├── db/                   # Database connection & setup
│   ├── models/               # SQLAlchemy models (Story, StoryNode, StoryJob)
│   ├── routers/              # API endpoints (stories, jobs)
│   ├── schemas/              # Pydantic request/response schemas
│   ├── main.py               # App entry point
│   └── requirements.txt
├── frontend/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/       # StoryGenerator, StoryGame, StoryLoader, etc.
│   │   ├── App.jsx           # Router & choice context
│   │   ├── utils.js          # API base URL config
│   │   └── App.css           # Full application styles
│   ├── public/               # Static assets (favicon, logos)
│   ├── index.html
│   ├── vercel.json           # Vercel rewrites config
│   └── package.json
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/stories/create` | Submit a theme to generate a story |
| `GET` | `/api/jobs/{job_id}` | Poll generation job status |
| `GET` | `/api/stories/{id}/complete` | Fetch full story tree |

## Getting Started (Local Dev)

### Backend

```bash
cd backend
python -m venv .venv && .venv\Scripts\activate  # Windows
pip install -r requirements.txt
# Create .env with your DATABASE_URL and GROQ_API_KEY
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The Vite dev server proxies `/api` requests to `localhost:8000` automatically.

## Deployment

- **Backend** — deployed on Render. Build: `pip install -r requirements.txt`, Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Frontend** — deployed on Vercel. Vite build outputs to `dist/`. API requests are proxied via Vercel rewrites in `vercel.json`.

## License

MIT
