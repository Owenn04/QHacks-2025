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

        // Create precise date range for today
        const now = new Date();
        const startOfDayISO = now.toISOString().split('T')[0];
        
        const foodLogsRef = collection(db, 'users', user.user.uid, 'foodLogs');
        const q = query(
          foodLogsRef,
          where('timestamp', '>=', `${startOfDayISO}T00:00:00.000Z`),
          where('timestamp', '<', `${startOfDayISO}T23:59:59.999Z`),
          orderBy('timestamp', 'desc')
        );

        console.log('Fetching items from:', startOfDayISO);
        
        const querySnapshot = await getDocs(q);
        console.log('Query returned:', querySnapshot.size, 'items');

        // Calculate totals and store items
        const totals = {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0
        };

        const items = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          
          // Safely parse string values to floats
          const safeParseFloat = (val) => {
            const parsed = parseFloat(val);
            return isNaN(parsed) ? 0 : parsed;
          };

          // Add macros using safeParseFloat
          totals.calories += safeParseFloat(data.calories);
          totals.protein += safeParseFloat(data.protein);
          totals.carbs += safeParseFloat(data.carbs);
          totals.fat += safeParseFloat(data.fat);
          
          return {
            ...data,
            calories: safeParseFloat(data.calories),
            protein: safeParseFloat(data.protein),
            carbs: safeParseFloat(data.carbs),
            fat: safeParseFloat(data.fat)
          };
        });

        console.log('Final totals:', totals);
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