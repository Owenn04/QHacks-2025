import React, { useContext, useEffect, useState } from 'react';
import { getFirestore, doc, getDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import MacroCircle from '../components/MacroCircle';
import MacroBar from '../components/MacroBar';
import HistoryItem from '../components/HistoryItem';
import AddButtons from '../components/AddButtons';
import Header from '../components/Header';
import { UserContext } from '../App';

function Home() {
  const user = useContext(UserContext);
  const [goals, setGoals] = useState({
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 70
  });
  const [todayTotals, setTodayTotals] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  });
  const [todayItems, setTodayItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.user?.uid) return;

      try {
        const db = getFirestore();
        
        // Fetch goals
        const goalsDocRef = doc(db, 'users', user.user.uid, 'goals', 'current');
        const goalsDoc = await getDoc(goalsDocRef);
        if (goalsDoc.exists()) {
          setGoals(goalsDoc.data());
        }

        // Get today's date at midnight for comparison
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Fetch today's nutrition entries
        const nutritionRef = collection(db, 'users', user.user.uid, 'nutritiondata');
        const q = query(
          nutritionRef, 
          where('timestamp', '>=', today.toISOString()),
          orderBy('timestamp', 'desc')
        );
        const querySnapshot = await getDocs(q);

        // Calculate totals and store items
        const totals = {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0
        };

        const items = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          totals.calories += Number(data.calories) || 0;
          totals.protein += Number(data.protein) || 0;
          totals.carbs += Number(data.carbs) || 0;
          totals.fat += Number(data.fat) || 0;
          
          items.push(data);
        });

        setTodayItems(items);
        setTodayTotals(totals);
        setIsLoading(false);

      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return (
    <div className="min-h-screen bg-offwhite">
      <Header />
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Today</h1>
        
        {isLoading ? (
          <div className="text-center text-gray-500">Loading your progress...</div>
        ) : (
          <>
            <div className="mb-8">
              <MacroCircle 
                calories={todayTotals.calories}
                goal={goals.calories}
                type="Calories Consumed"
                color="border-orange-400"
              />
            </div>
    
            <div className="space-y-4 mb-8">
              <MacroBar current={todayTotals.carbs} total={goals.carbs} type="Carbs" />
              <MacroBar current={todayTotals.protein} total={goals.protein} type="Protein" />
              <MacroBar current={todayTotals.fat} total={goals.fat} type="Fat" />
            </div>

            <AddButtons />
    
            {/* History Section */}
            <div className="space-y-3">
              <h2 className="text-lg font-medium text-gray-800">Today's Log</h2>
              {todayItems.length === 0 ? (
                <p className="text-gray-500 text-sm">No items logged today</p>
              ) : (
                <div className="space-y-2">
                  {todayItems.map((item, index) => (
                    <HistoryItem key={index} item={item} />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Home;