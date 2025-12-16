import { useStudy } from "../context/StudyContext";
import StudyPlanFormatter from "./StudyPlanFormatter";

interface StudyPlansHistoryProps {
  onSelectPlan: (plan: string) => void;
  onClose: () => void;
}

export default function StudyPlansHistory({ onSelectPlan, onClose }: StudyPlansHistoryProps) {
  const { studyPlans } = useStudy();

  if (studyPlans.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-2xl max-w-md mx-4 p-6">
          <div className="text-center">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-xl font-bold mb-2">No Study Plans Yet</h2>
            <p className="text-gray-600 mb-4">Create your first study plan to see it here!</p>
            <button
              onClick={onClose}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">📚 Study Plans History</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ✕
            </button>
          </div>
          <p className="text-gray-600 mt-1">View and reuse your previous study plans</p>
        </div>

        {/* Plans List */}
        <div className="overflow-y-auto max-h-[70vh]">
          <div className="p-6 space-y-4">
            {studyPlans.map((plan, index) => (
              <div key={plan.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                {/* Plan Header */}
                <div className="bg-gray-50 p-4 border-b">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        Plan #{studyPlans.length - index} - {plan.profile.subject}
                      </h3>
                      <div className="text-sm text-gray-600 mt-1 space-y-1">
                        <div>🎯 Goal: {plan.profile.goal}</div>
                        <div>📊 Level: {plan.profile.level}</div>
                        <div>⏰ Daily Time: {plan.profile.timePerDay}h</div>
                        <div>📅 Created: {plan.createdAt.toLocaleDateString()}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        onSelectPlan(plan.plan);
                        onClose();
                      }}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm"
                    >
                      Use This Plan
                    </button>
                  </div>
                </div>

                {/* Plan Preview */}
                <div className="p-4 bg-white">
                  <div className="max-h-32 overflow-hidden">
                    <div className="text-sm text-gray-700">
                      {plan.plan.substring(0, 200)}...
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t">
                    <details className="cursor-pointer">
                      <summary className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                        View Full Plan
                      </summary>
                      <div className="mt-4 max-h-96 overflow-y-auto border rounded-lg p-4 bg-gray-50">
                        <StudyPlanFormatter content={plan.plan} />
                      </div>
                    </details>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}