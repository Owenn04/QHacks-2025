const MealItem = ({ name, calories, icon }) => {
    return (
      <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
        <div className="flex items-center gap-3">
          <img src={icon} alt={name} className="w-8 h-8 rounded-full"/>
          <span>{name}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-600">{calories} Cal</span>
          <button className="text-orange-400 text-xl">+</button>
        </div>
      </div>
    )
}

export default MealItem