import { useState } from "react";
import { useStudy } from "../context/StudyContext";
import { useNavigate } from "react-router-dom";
import StudyPlanFormatter from "./StudyPlanFormatter";
import ProgressCard from "./ProgressCard";
import StudyPlansHistory from "./StudyPlansHistory";

export default function Dashboard() {
  const { studyPlan, profile, savedContent, clearSavedContent, studyPlans, setStudyPlan } = useStudy();
  const navigate = useNavigate();
  const [showHistory, setShowHistory] = useState(false);

  const selectPlan = (plan: string) => {
    setStudyPlan(plan);
  };

  if (!studyPlan) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <h2 className="text-xl font-semibold mb-4">No Study Plan Found</h2>
            <p className="text-gray-600 mb-6">Create a study plan to get started with your learning journey.</p>
            <button
              onClick={() => navigate("/setup")}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
            >
              Create Study Plan
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <div className="flex gap-3">
            {studyPlans.length > 0 && (
              <button
                onClick={() => setShowHistory(true)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
              >
                📚 History ({studyPlans.length})
              </button>
            )}
            <button
              onClick={() => navigate("/setup")}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              ➕ New Plan
            </button>
          </div>
        </div>

        {profile && (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">Study Profile</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <span className="text-sm text-gray-600">Subject</span>
                <p className="font-medium">{profile.subject}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Goal</span>
                <p className="font-medium">{profile.goal}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Level</span>
                <p className="font-medium">{profile.level}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Daily Hours</span>
                <p className="font-medium">{profile.timePerDay}h</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <ProgressCard 
            title="Daily Progress" 
            description="Today's study completion" 
            progress={0} 
            color="blue" 
          />
          <ProgressCard 
            title="Weekly Goal" 
            description="This week's milestones" 
            progress={0} 
            color="green" 
          />
          <ProgressCard 
            title="Overall Progress" 
            description="Course completion" 
            progress={0} 
            color="purple" 
          />
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b bg-gradient-to-r from-indigo-50 to-blue-50">
            <h2 className="text-2xl font-bold text-gray-800">📚 Your Personalized Study Plan</h2>
            <p className="text-gray-600 mt-1">AI-generated plan tailored to your goals</p>
          </div>
          <div className="p-6">
            <StudyPlanFormatter content={studyPlan} />
          </div>
        </div>

        {/* Saved Content Section */}
        {savedContent.length > 0 && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="p-6 border-b bg-gradient-to-r from-yellow-50 to-orange-50">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">💾 Saved Study Content</h2>
                <button
                  onClick={clearSavedContent}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Clear All
                </button>
              </div>
              <p className="text-gray-600 mt-1">Content saved from your AI Tutor sessions</p>
            </div>
            <div className="p-6">
              <div className="space-y-4 max-h-60 overflow-y-auto">
                {savedContent.map((content, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-700 line-clamp-3">
                      {content.substring(0, 200)}...
                    </p>
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => navigate("/quiz", { state: { fromContent: content } })}
                        className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600"
                      >
                        🧠 Create Quiz
                      </button>
                      <button
                        onClick={() => navigate("/flashcards", { state: { fromContent: content } })}
                        className="bg-purple-500 text-white px-3 py-1 rounded text-xs hover:bg-purple-600"
                      >
                        🃏 Create Cards
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <button
            onClick={() => navigate("/tutor")}
            className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl hover:from-blue-600 hover:to-blue-700 text-center transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            <div className="text-3xl mb-3">🤖</div>
            <h3 className="text-lg font-semibold mb-2">AI Tutor</h3>
            <p className="text-sm opacity-90">Get personalized explanations</p>
          </button>
          <button
            onClick={() => navigate("/quiz")}
            className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl hover:from-green-600 hover:to-green-700 text-center transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            <div className="text-3xl mb-3">🧠</div>
            <h3 className="text-lg font-semibold mb-2">Take Quiz</h3>
            <p className="text-sm opacity-90">Test your knowledge</p>
          </button>
          <button
            onClick={() => navigate("/flashcards")}
            className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl hover:from-purple-600 hover:to-purple-700 text-center transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            <div className="text-3xl mb-3">🃏</div>
            <h3 className="text-lg font-semibold mb-2">Flashcards</h3>
            <p className="text-sm opacity-90">Review key concepts</p>
          </button>
          <button
            onClick={() => navigate("/notebook")}
            className="bg-gradient-to-br from-orange-500 to-red-500 text-white p-6 rounded-xl hover:from-orange-600 hover:to-red-600 text-center transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            <div className="text-3xl mb-3">📓</div>
            <h3 className="text-lg font-semibold mb-2">Notebook</h3>
            <p className="text-sm opacity-90">Save and organize notes</p>
          </button>
        </div>
      </div>
      
      {/* Study Plans History Modal */}
      {showHistory && (
        <StudyPlansHistory 
          onSelectPlan={selectPlan}
          onClose={() => setShowHistory(false)}
        />
      )}
    </div>
  );
}
