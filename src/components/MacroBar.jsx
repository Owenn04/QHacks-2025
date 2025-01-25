const MacroBar = ({ current, total, type }) => {
    const percentage = (current/total) * 100
    return (
      <div className="w-full">
        <div className="flex justify-between text-sm mb-1">
          <span>{type}</span>
          <span>{current}/{total}g</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div 
            className="h-full bg-orange-400 rounded-full"
            style={{width: `${percentage}%`}}
          />
        </div>
      </div>
    )
}

export default MacroBar