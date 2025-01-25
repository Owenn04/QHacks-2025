
import React from 'react'
import MacroCircle from '../components/MacroCircle'
import MacroBar from '../components/MacroBar'
import MealItem from '../components/MealItem'
import Header from '../components/Header'

function Home() {
  return (
    <div className="min-h-screen bg-offwhite">
      <Header />
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Today</h1>
        
        <div className="mb-8">
          <MacroCircle calories={826} type="Remaining" />
        </div>
 
        <div className="space-y-4 mb-8">
          <MacroBar current={205} total={250} type="Carbs" />
          <MacroBar current={35} total={103} type="Protein" />
          <MacroBar current={32} total={69} type="Fat" />
        </div>
 
        <div className="space-y-4">
          <MealItem name="Breakfast" calories={565} icon="/breakfast-icon.png" />
          <MealItem name="Lunch" calories={847} icon="/lunch-icon.png" />
          <MealItem name="Dinner" calories={529} icon="/dinner-icon.png" />
          <MealItem name="Snacks" calories={105} icon="/snack-icon.png" />
        </div>
      </div>
    </div>
  )
}

export default Home