import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useStudy } from "../context/StudyContext";
import { api } from "../services/api";

interface Flashcard {
  id: number;
  front: string;
  back: string;
  difficulty: "easy" | "medium" | "hard";
}

export default function Flashcards() {
  const navigate = useNavigate();
  const location = useLocation();

  // 🔥 Added savedContent
  const { profile, savedContent } = useStudy();

  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [studyStarted, setStudyStarted] = useState(false);
  const [studyComplete, setStudyComplete] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  // If flashcards passed via navigation
  useEffect(() => {
    if (location.state?.flashcards) {
      setFlashcards(location.state.flashcards);
      setStudyStarted(true);
    }
  }, [location.state]);

  // 🔹 RAG-BASED FLASHCARD GENERATOR
  const generateFlashcards = async () => {
    setLoading(true);
    try {
      // ✅ Use Notebook memory if available
      if (savedContent.length > 0) {
        const response = await api.post("/flashcards-from-content", {
          content: savedContent.join("\n\n")
        });
        setFlashcards(response.data.flashcards);
      } else {
        // Fallback to subject-based flashcards
        const response = await api.post("/flashcards", {
          subject: profile?.subject || "General",
          level: profile?.level || "Beginner"
        });
        setFlashcards(response.data.flashcards);
      }

      setStudyStarted(true);
    } catch (error) {
      // Safe fallback
      const fallbackCards: Flashcard[] = [
        {
          id: 1,
          front: "What does learning mean?",
          back: "Learning is the process of understanding and applying knowledge.",
          difficulty: "easy"
        }
      ];
      setFlashcards(fallbackCards);
      setStudyStarted(true);
    } finally {
      setLoading(false);
    }
  };

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  const markCorrect = () => {
    setCorrectCount(prev => prev + 1);
    nextCard();
  };

  const nextCard = () => {
    if (currentCard + 1 < flashcards.length) {
      setCurrentCard(prev => prev + 1);
      setIsFlipped(false);
    } else {
      setStudyComplete(true);
    }
  };

  const resetStudy = () => {
    setFlashcards([]);
    setCurrentCard(0);
    setIsFlipped(false);
    setStudyStarted(false);
    setStudyComplete(false);
    setCorrectCount(0);
  };

  // 🔹 UI STATES (UNCHANGED)
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Creating Your Flashcards</h2>
          <p className="text-gray-600">Generating personalized study cards...</p>
        </div>
      </div>
    );
  }

  if (studyComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
        <div className="max-w-2xl mx-auto p-6">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold mb-4">Study Session Complete!</h2>
            <p className="text-xl mb-6">
              You got {correctCount} out of {flashcards.length} cards right!
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={resetStudy}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
              >
                Study Again
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!studyStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">🃏 Flashcards</h1>
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              Back to Dashboard
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-6">🧠</div>
            <h2 className="text-2xl font-bold mb-4">
              Ready to revise what you learned?
            </h2>
            <p className="text-gray-600 mb-6">
              {savedContent.length > 0
                ? "Flashcards will be generated from your Notebook"
                : "Flashcards will be generated from your study profile"}
            </p>
            <button
              onClick={generateFlashcards}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg hover:from-purple-700 hover:to-pink-700 font-semibold text-lg transform hover:scale-105 transition-all duration-200"
            >
              🎆 Generate Flashcards
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentFlashcard = flashcards[currentCard];
  const difficultyColors = {
    easy: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    hard: "bg-red-100 text-red-800"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <div className="max-w-4xl mx-auto p-6">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-500">
              {currentCard + 1} of {flashcards.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
              style={{
                width: `${((currentCard + 1) / flashcards.length) * 100}%`
              }}
            ></div>
          </div>
        </div>

        {/* Flashcard */}
        <div className="perspective-1000 mb-8">
          <div
            className={`relative w-full h-96 transform-style-preserve-3d transition-transform duration-700 cursor-pointer ${
              isFlipped ? "rotate-y-180" : ""
            }`}
            onClick={flipCard}
          >
            {/* Front */}
            <div className="absolute inset-0 w-full h-full backface-hidden">
              <div className="bg-white rounded-xl shadow-xl p-8 h-full flex flex-col justify-center items-center border-2 border-purple-200">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${difficultyColors[currentFlashcard.difficulty]}`}
                >
                  {currentFlashcard.difficulty.toUpperCase()}
                </span>
                <div className="text-2xl my-4">❓</div>
                <h2 className="text-xl font-semibold text-center">
                  {currentFlashcard.front}
                </h2>
                <p className="mt-6 text-sm text-gray-500">
                  Click to reveal answer
                </p>
              </div>
            </div>

            {/* Back */}
            <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl shadow-xl p-8 h-full flex flex-col justify-center items-center">
                <div className="text-2xl mb-4">💡</div>
                <p className="text-lg text-center leading-relaxed">
                  {currentFlashcard.back}
                </p>
                <p className="mt-6 text-sm opacity-80">
                  Click to flip back
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        {isFlipped && (
          <div className="text-center space-y-4">
            <p className="font-medium text-gray-700">
              Did you get it right?
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={nextCard}
                className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
              >
                ❌ Need More Practice
              </button>
              <button
                onClick={markCorrect}
                className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
              >
                ✅ Got It Right!
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
