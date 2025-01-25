const MacroCircle = ({ calories, type, color = "border-orange-400" }) => {
  return (
    <div className="flex flex-col items-center w-full">
      <div className={`mx-auto w-48 h-48 rounded-full border-8 ${color} flex items-center justify-center`}>
        <span className="text-3xl font-semibold">{calories}</span>
      </div>
      <span className="mt-2 text-gray-600">{type}</span>
    </div>
  )
}

export default MacroCircle;