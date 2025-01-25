const MacroBar = ({ current, total, type }) => {
  // Cap the percentage at 100 for the visual bar
  const percentage = Math.min((current/total) * 100, 100);
  
  // Determine if we're over/under by more than 10%
  const isWarning = current > total * 1.1 || current < total * 0.9;
  
  return (
    <div className="w-full">
      <div className="flex justify-between text-sm mb-1">
        <span className={isWarning ? 'text-yellow-600' : 'text-gray-600'}>{type}</span>
        <span className={isWarning ? 'text-yellow-600' : 'text-gray-600'}>
          {current}/{total}g {current > total && '(Over)'}
        </span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${isWarning ? 'bg-yellow-400' : 'bg-orange-400'} rounded-full transition-all duration-500 ease-out`}
          style={{width: `${percentage}%`}}
        />
      </div>
    </div>
  );
};

export default MacroBar;