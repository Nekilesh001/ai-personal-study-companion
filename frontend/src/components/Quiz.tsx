import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStudy } from "../context/StudyContext";
import { api } from "../services/api";

interface Question {
  question: string;
  options: string[];
  correct: number;
}

const LEVELS = ["easy", "medium", "hard"] as const;
type Level = typeof LEVELS[number];

export default function Quiz() {
  const navigate = useNavigate();
  const { profile, savedContent, increaseProgress } = useStudy();

  const [levelIndex, setLevelIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<number[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showReview, setShowReview] = useState(false);

  const currentLevel: Level = LEVELS[levelIndex];

  /* ---------- GENERATE QUIZ ---------- */

  const generateQuiz = async () => {
    setLoading(true);
    setQuestions([]);
    setAnswers([]);
    setCurrentQuestion(0);
    setShowReview(false);

    try {
      if (savedContent.length > 0) {
        const res = await api.post("/quiz-from-content", {
          content: savedContent.join("\n\n"),
          difficulty: currentLevel,
          count: 10
        });
        setQuestions(res.data.questions.slice(0, 10));
      } else {
        const res = await api.post("/quiz", {
          subject: profile?.subject || "General",
          level: currentLevel,
          count: 10
        });
        setQuestions(res.data.questions.slice(0, 10));
      }
    } catch {
      setQuestions([
        {
          question: "Learning happens when you:",
          options: [
            "Memorize only",
            "Understand concepts",
            "Skip practice",
            "Avoid mistakes"
          ],
          correct: 1
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateQuiz();
  }, [levelIndex]);

  /* ---------- ANSWERING ---------- */

  const answerQuestion = (index: number) => {
    const updated = [...answers];
    updated[currentQuestion] = index;
    setAnswers(updated);

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowReview(true);
      increaseProgress("QUIZ_COMPLETE");
    }
  };

  /* ---------- NEXT LEVEL ---------- */

  const nextLevel = () => {
    if (levelIndex < LEVELS.length - 1) {
      setLevelIndex(levelIndex + 1);
    } else {
      navigate("/dashboard");
    }
  };

  /* ---------- UI ---------- */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Generating {currentLevel} quiz…</p>
      </div>
    );
  }

  if (showReview) {
    return (
      <div className="min-h-screen p-6 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 capitalize">
          {currentLevel} Level Complete 🎉
        </h1>

        {questions.map((q, i) => (
          <div key={i} className="mb-4 p-4 border rounded">
            <p className="font-semibold">{q.question}</p>
            <p className="text-green-600">
              Correct: {q.options[q.correct]}
            </p>
            <p className="text-gray-600">
              Your answer: {q.options[answers[i]]}
            </p>
          </div>
        ))}

        <button
          onClick={nextLevel}
          className="mt-6 bg-indigo-600 text-white px-6 py-3 rounded"
        >
          {levelIndex < 2 ? "Next Level →" : "Finish Quiz"}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 capitalize">
        {currentLevel} Quiz ({currentQuestion + 1}/10)
      </h1>

      <div className="p-6 border rounded">
        <p className="text-lg mb-4">
          {questions[currentQuestion]?.question}
        </p>

        {questions[currentQuestion]?.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => answerQuestion(i)}
            className="block w-full mb-2 p-3 border rounded hover:bg-indigo-50"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
