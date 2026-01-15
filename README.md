# 🎯 Causal Funnel Quiz Application

A full-stack quiz application that fetches trivia questions from OpenTDB API, lets users take timed quizzes, and stores their scores in MongoDB.

![Quiz Application](./frontend/public/causalfunnelogo.svg)

## 🌐 Live Demo

- **Frontend**: [Deploy your frontend here]
- **Backend API**: https://causal-funnel-sde-assignment-9zcs.vercel.app

## 🏗️ Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  React Frontend │────▶│  Express API    │────▶│    MongoDB      │
│  (Vercel)       │     │  (Vercel)       │     │    (Atlas)      │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                               │
                               ▼
                        ┌─────────────────┐
                        │   OpenTDB API   │
                        │ (Trivia Source) │
                        └─────────────────┘
```

## ✨ Features

### Quiz Flow
1. **Start Page** - User enters email to begin
2. **Quiz Page** - 15 multiple choice questions with 30-minute timer
3. **Report Page** - Detailed results showing score, correct/incorrect answers

### Technical Features
- ⏱️ **30-minute countdown timer** with auto-submit
- 📊 **Question navigation panel** showing answered/visited status
- 🔄 **Real-time progress tracking**
- 💾 **MongoDB persistence** for users and quiz results
- 🔐 **Secure answer validation** (correct answers only sent after submission)

## 📁 Project Structure

```
causalFunnel/
├── frontend/                   # React application
│   ├── public/
│   │   └── causalfunnelogo.svg # App logo
│   └── src/
│       ├── components/
│       │   ├── StartPage.js    # Email entry form
│       │   ├── QuizPage.js     # Quiz interface with timer
│       │   └── ReportPage.js   # Results display
│       ├── context/
│       │   └── QuizContext.js  # Global state management
│       └── styles/             # CSS files
│
├── backend/                    # Express + TypeScript API
│   └── src/
│       ├── config/
│       │   └── database.ts     # MongoDB connection
│       ├── controllers/
│       │   └── quizController.ts # Quiz logic
│       ├── model/
│       │   ├── Quiz.ts         # Quiz session (in-memory)
│       │   ├── User.ts         # User schema (MongoDB)
│       │   └── QuizResult.ts   # Quiz results schema (MongoDB)
│       ├── routes/
│       │   └── quizRoutes.ts   # API routes
│       └── server.ts           # Express server
│
└── .gitignore
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

```bash
cd backend
npm install

# Create .env file
echo "PORT=5000
OPENTDB_API_URL=https://opentdb.com/api.php?amount=15
MONGODB_URI=mongodb://localhost:27017/causalfunnel_quiz" > src/.env

# Start development server
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install

# Start development server
npm start
```

The frontend will run on `http://localhost:3000` and connect to the backend.

## 🔌 API Endpoints

### `POST /api/quiz/start`
Start a new quiz session.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "quizId": "uuid-string",
  "questions": [
    {
      "id": 1,
      "category": "General Knowledge",
      "difficulty": "easy",
      "question": "What is the capital of France?",
      "options": ["London", "Berlin", "Paris", "Madrid"]
    }
  ],
  "timeLimit": 1800
}
```

### `POST /api/quiz/submit`
Submit quiz answers.

**Request:**
```json
{
  "quizId": "uuid-string",
  "answers": { "0": 2, "1": 1, "2": 0 },
  "timeTaken": 450
}
```

**Response:**
```json
{
  "email": "user@example.com",
  "results": [...],
  "correctCount": 10,
  "incorrectCount": 5,
  "totalQuestions": 15,
  "scorePercent": 67,
  "passed": true,
  "timeTaken": 450
}
```

### `GET /health`
Health check endpoint.

## 💾 Database Schema

### Users Collection
```javascript
{
  email: String,      // unique, lowercase
  createdAt: Date     // auto-generated
}
```

### QuizResults Collection
```javascript
{
  quizId: String,           // unique
  userId: ObjectId,         // ref to User
  email: String,
  score: Number,            // percentage
  correctCount: Number,
  totalQuestions: Number,
  passed: Boolean,
  timeTaken: Number,        // seconds
  submittedAt: Date,
  results: [{
    questionId: Number,
    question: String,
    category: String,
    userAnswer: String,
    correctAnswer: String,
    isCorrect: Boolean,
    wasAnswered: Boolean
  }]
}
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, React Context API |
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB with Mongoose |
| API Source | OpenTDB (Open Trivia Database) |
| Deployment | Vercel |

## 📝 Environment Variables

### Backend (.env)
```
PORT=5000
OPENTDB_API_URL=https://opentdb.com/api.php?amount=15
MONGODB_URI=mongodb://localhost:27017/causalfunnel_quiz
```

### Frontend
The API URL is configured in `src/context/QuizContext.js`.

## 🚢 Deployment

### Backend (Vercel)
1. Push to GitHub
2. Import to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Frontend (Vercel)
1. Update API_URL in QuizContext.js to production URL
2. Push to GitHub
3. Import to Vercel
4. Deploy

## 📄 License

This project is part of the CausalFunnel SDE Assignment.

---

Built with ❤️ by Ayush Dwivedi
