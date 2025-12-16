import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-600 text-white">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">
          AI Personal Study Companion
        </h1>
        <p className="text-lg">
          Your personalized AI tutor
        </p>
        <button
          onClick={() => navigate("/setup")}
          className="bg-white text-indigo-600 px-6 py-2 rounded font-semibold hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
        >
          Start Studying
        </button>
      </div>
    </div>
  );
}
