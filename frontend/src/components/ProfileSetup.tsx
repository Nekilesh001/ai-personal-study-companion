import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useStudy } from "../context/StudyContext";
import LoadingSpinner from "./LoadingSpinner";
import SuccessAnimation from "./SuccessAnimation";

export default function ProfileSetup() {
  const navigate = useNavigate();
  const { setStudyPlan, setProfile, addStudyPlan } = useStudy();

  const [subject, setSubject] = useState("");
  const [goal, setGoal] = useState("");
  const [level, setLevel] = useState("");
  const [timePerDay, setTimePerDay] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const validateForm = () => {
    if (!subject.trim()) return "Subject is required";
    if (!goal.trim()) return "Goal is required";
    if (!level.trim()) return "Level is required";
    const time = Number(timePerDay);
    if (!timePerDay || isNaN(time) || time <= 0) return "Valid study time is required";
    return null;
  };

  const generateStudyPlan = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const time = Number(timePerDay);
      const profileData = { subject, goal, level, timePerDay: time };
      
      const response = await api.post("/study-plan", {
        subject,
        goal,
        level,
        time_per_day: time,
      });

      if (!response.data?.study_plan) {
        throw new Error("Invalid response from server");
      }

      setProfile(profileData);
      setStudyPlan(response.data.study_plan);
      addStudyPlan(profileData, response.data.study_plan);
      setLoading(false);
      setShowSuccess(true);
    } catch (error: any) {
      console.error("Failed to generate study plan", error);
      if (error.response?.status === 400) {
        setError(error.response.data.detail || "Invalid input data");
      } else if (error.response?.status === 503) {
        setError("Service temporarily unavailable. Please try again later.");
      } else {
        setError("Failed to generate study plan. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (showSuccess) {
    return <SuccessAnimation onComplete={() => navigate("/dashboard")} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="text-4xl mb-4">🎓</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Setup Your Study Profile
          </h1>
          <p className="text-gray-600">Tell us about your learning goals</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">📚 Subject</label>
            <input
              className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
              placeholder="e.g. Deep Learning, Physics, Mathematics"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">🎯 Goal</label>
            <input
              className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
              placeholder="e.g. Semester Exam, Certification, Job Interview"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">📈 Current Level</label>
            <select
              className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              <option value="">Select your level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">⏰ Daily Study Time</label>
            <input
              type="number"
              min="1"
              max="12"
              className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
              placeholder="Hours per day (1-12)"
              value={timePerDay}
              onChange={(e) => setTimePerDay(e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={generateStudyPlan}
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-4 rounded-lg hover:from-indigo-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed font-semibold text-lg transform hover:scale-105 transition-all duration-200 shadow-lg"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </span>
          ) : (
            "🎆 Generate My Study Plan"
          )}
        </button>
      </div>
    </div>
  );
}
