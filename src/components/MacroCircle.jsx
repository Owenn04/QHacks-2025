const MacroCircle = ({ calories, goal, type }) => {
  // Calculate percentage filled (0-100)
  const percentage = Math.min((calories / goal) * 100, 100);
  
  return (
    <div className="flex flex-col items-center w-full">
      <div className="relative mx-auto w-48 h-48">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="96"
            cy="96"
            r="88"
            fill="none"
            strokeWidth="8"
            className="stroke-current text-gray-200"
          />
          <circle
            cx="96"
            cy="96"
            r="88"
            fill="none"
            strokeWidth="8"
            className="stroke-current text-orange-400 transition-all duration-500 ease-out"
            strokeDasharray={`${percentage * 5.52} 552`}
          />
        </svg>
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
          <span className="text-3xl font-semibold">{calories}</span>
        </div>
      </div>
      <span className="mt-2 text-gray-600">{type}</span>
    </div>
  );
};

export default MacroCircle;