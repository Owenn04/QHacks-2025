import React, { useState, useContext, useEffect } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import Header from '../components/Header';
import { UserContext } from '../App';
import GoalLogger from '../components/GoalLogger';

const Goals = () => {
  const user = useContext(UserContext);
  const [goals, setGoals] = useState({
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 70
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentGoals = async () => {
      if (!user?.user?.uid) return;

      try {
        const db = getFirestore();
        const goalsDocRef = doc(db, 'users', user.user.uid, 'goals', 'current');
        const goalsDoc = await getDoc(goalsDocRef);

        if (goalsDoc.exists()) {
          const data = goalsDoc.data();
          setGoals({
            calories: data.calories || 2000,
            protein: data.protein || 150,
            carbs: data.carbs || 250,
            fat: data.fat || 70
          });
        }
      } catch (error) {
        console.error('Error fetching goals:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentGoals();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGoals(prev => ({
      ...prev,
      [name]: Number(value)
    }));
  };

  const handleSuccess = () => {
    console.log('Goals saved successfully!');
  };

  const handleError = (error) => {
    console.error('Failed to save goals:', error);
  };

  return (
    <div className="min-h-screen bg-offwhite">
      <Header />
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Daily Goals</h1>

        <div className="space-y-6">
          {isLoading ? (
            <div className="text-center text-gray-500">Loading your goals...</div>
          ) : (
            <>
              {/* Calories Card */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-medium text-gray-800 mb-4">Daily Calorie Target</h2>
                <div className="relative">
                  <input
                    type="text"
                    name="calories"
                    value={goals.calories}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-orange-400 rounded-lg text-lg"
                    min="0"
                    step="50"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                    kcal
                  </span>
                </div>
              </div>

              {/* Macros Card */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-medium text-gray-800 mb-4">Macro Goals</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Protein
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="protein"
                        value={goals.protein}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-orange-400 rounded-lg"
                        min="0"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">g</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Carbohydrates
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="carbs"
                        value={goals.carbs}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-orange-400 rounded-lg"
                        min="0"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">g</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fat
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="fat"
                        value={goals.fat}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-orange-400 rounded-lg"
                        min="0"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">g</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Goal Logger */}
              {user && (
                <GoalLogger
                  goalData={goals}
                  userId={user.user.uid}
                  onSuccess={handleSuccess}
                  onError={handleError}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Goals;