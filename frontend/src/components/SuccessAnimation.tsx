import { useEffect, useState } from 'react';

interface SuccessAnimationProps {
  onComplete: () => void;
}

export default function SuccessAnimation({ onComplete }: SuccessAnimationProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setStep(1), 500);
    const timer2 = setTimeout(() => setStep(2), 1500);
    const timer3 = setTimeout(() => setStep(3), 2500);
    const timer4 = setTimeout(() => onComplete(), 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex items-center justify-center z-50">
      <div className="text-center text-white">
        {/* Success Icon */}
        <div className="relative mb-8">
          <div className={`w-32 h-32 mx-auto rounded-full bg-white bg-opacity-20 flex items-center justify-center transform transition-all duration-1000 ${
            step >= 1 ? 'scale-100 rotate-0' : 'scale-0 rotate-180'
          }`}>
            <div className={`text-6xl transform transition-all duration-500 ${
              step >= 1 ? 'scale-100' : 'scale-0'
            }`}>
              ✅
            </div>
          </div>
          
          {/* Floating particles */}
          {step >= 2 && (
            <>
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-4 h-4 bg-yellow-300 rounded-full animate-ping"
                  style={{
                    top: `${20 + Math.sin(i * 45 * Math.PI / 180) * 60}px`,
                    left: `${20 + Math.cos(i * 45 * Math.PI / 180) * 60}px`,
                    animationDelay: `${i * 0.1}s`
                  }}
                >
                  ✨
                </div>
              ))}
            </>
          )}
        </div>

        {/* Success Messages */}
        <div className="space-y-4">
          <h1 className={`text-4xl font-bold transform transition-all duration-700 ${
            step >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            🎉 Success!
          </h1>
          
          <p className={`text-xl transform transition-all duration-700 delay-300 ${
            step >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            Your personalized study plan is ready!
          </p>
          
          <div className={`text-lg transform transition-all duration-700 delay-500 ${
            step >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <div className="flex items-center justify-center gap-2 mb-2">
              <span>📚</span>
              <span>Tailored to your goals</span>
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <span>⏰</span>
              <span>Optimized for your schedule</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span>🎯</span>
              <span>Ready to boost your learning!</span>
            </div>
          </div>
        </div>

        {/* Loading dots */}
        <div className="mt-8 flex justify-center space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 bg-white rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}