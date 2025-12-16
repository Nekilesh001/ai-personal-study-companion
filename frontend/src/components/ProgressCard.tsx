interface ProgressCardProps {
  title: string;
  description: string;
  progress: number;
  color: string;
}

export default function ProgressCard({ title, description, progress, color }: ProgressCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <span className={`text-2xl font-bold text-${color}-600`}>{progress}%</span>
      </div>
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`bg-${color}-600 h-2 rounded-full transition-all duration-300`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}