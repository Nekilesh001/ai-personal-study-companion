#  AI Personal Study Companion

An **AI-powered personalized learning assistant** designed to help students learn smarter by combining an AI Tutor, adaptive quizzes, flashcards, progress tracking, and a notebook-based learning memory.

---

##  Features

###   AI Tutor (Memory-Enabled)
- Ask questions in natural language
- AI explanations are **automatically saved** to the Notebook
- Builds a personal learning memory
- No manual saving required

---

###  Notebook (Learning Memory)
- Stores AI tutor explanations automatically
- Acts as a lightweight **RAG-style knowledge base**
- Used to generate quizzes and flashcards
- Fully user-controlled

---

### Smart Quiz System
- Generated from:
  - Notebook content (preferred)
  - Subject profile (fallback)
- Structured difficulty levels:
  - Easy — 10 questions
  - Medium — 10 questions
  - Hard — 10 questions
- Correct answers shown at the end
- Quiz completion updates progress automatically

---

###  Flashcards (User-Controlled)
- Generated from Notebook or subject profile
- User chooses how many cards to study
- Progress is session-based (not per card)
- Completing a session updates progress

---

###  Progress Tracking (Deterministic Logic)
No machine learning — clear, rule-based progress tracking.

| Action | Progress |
|------|---------|
| Tutor answer auto-saved | +2% |
| Quiz completed | +10% |
| Flashcards session completed | +5% |
| **Maximum Progress** | **100%** |

---

###  Adaptive Weekly Study Plan (Planned)
- Total duration: **5 weeks**
- Only **Week 1** is generated initially
- Daily tasks with completion checkboxes
- Completing a week unlocks the next week
- Prevents overload and improves consistency

---

##  Tech Stack

### Frontend
- React + TypeScript
- Tailwind CSS
- React Context API
- Axios
- React Router

### Backend
- FastAPI
- Gemini API (Google Generative AI)
- Python

---

##  Project Structure

ai-personal-study-companion/
│
├── frontend/
│ ├── components/
│ ├── context/
│ ├── services/
│ └── App.tsx
│
├── backend/
│ ├── main.py
│ ├── gemini.py
│ └── routes/
│
└── README.md


---

##  Installation & Setup

###  Clone the Repository

bash
git clone https://github.com/Nekilesh001/ai-personal-study-companion.git
cd ai-personal-study-companion
2️ Frontend Setup
cd frontend
npm install
npm run dev

  Backend Setup
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt
uvicorn main:app --reload

 
  Environment Variables

Create a .env file inside the backend/ folder:

GEMINI_API_KEY=your_api_key_here

 API Quota Note

The Gemini API free tier has request limits.
If the quota is exceeded, the application automatically falls back to default quiz and flashcard generation.

   Why This Project Stands Out

Real learning memory, not just chat

Context-aware quizzes and flashcards

Transparent, deterministic progress system

Adaptive weekly learning roadmap

Hackathon-ready and scalable design

  Future Enhancements

Dark / Light theme toggle

Persistent progress storage (database)

User authentication system

Learning streak tracking

Notebook export feature
