import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import Landing from "./components/Landing";
import ProfileSetup from "./components/ProfileSetup";
import Dashboard from "./components/Dashboard";
import Tutor from "./components/Tutor";
import Quiz from "./components/Quiz";
import AnswerGenerator from "./components/AnswerGenerator";
import Flashcards from "./components/Flashcards";
import Notebook from "./components/Notebook";

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/setup" element={<ProfileSetup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tutor" element={<Tutor />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/answers" element={<AnswerGenerator />} />
        <Route path="/flashcards" element={<Flashcards />} />
        <Route path="/notebook" element={<Notebook />} />
        <Route path="*" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">404 - Page Not Found</h1></div>} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
