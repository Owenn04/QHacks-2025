import React, { useState, useEffect, useContext } from "react";
import { db } from "../firebase";
import { collection, query, where, onSnapshot, orderBy, doc, getDoc } from "firebase/firestore";
import Header from "../components/Header";
import { UserContext } from "../App";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";

function TrackerPage() {
  const [foodLogs, setFoodLogs] = useState([]);
  const [timeframe, setTimeframe] = useState("today"); // Default timeframe
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [goals, setGoals] = useState({
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 70,
  });
  const [selectedStat, setSelectedStat] = useState("calories"); // Default stat to display
  const user = useContext(UserContext); // Get the logged-in user

  // Fetch user goals
  useEffect(() => {
    if (user?.user?.uid) {
      const fetchGoals = async () => {
        const goalsDocRef = doc(db, "users", user.user.uid, "goals", "current");
        const goalsDoc = await getDoc(goalsDocRef);
        if (goalsDoc.exists()) {
          setGoals(goalsDoc.data());
        }
      };
      fetchGoals();
    }
  }, [user]);

  // Set up a real-time listener for food logs
  useEffect(() => {
    if (user?.user?.uid) {
      setLoading(true);
      setError("");

      const now = new Date();
      let startDate;

      switch (timeframe) {
        case "today":
          startDate = new Date(now.setHours(0, 0, 0, 0)).toISOString(); // Convert to ISO string
          break;
        case "thisWeek":
          startDate = new Date(now.setDate(now.getDate() - now.getDay())).toISOString(); // Convert to ISO string
          break;
        case "thisMonth":
          startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString(); // Convert to ISO string
          break;
        default:
          startDate = new Date(0).toISOString(); // All time, converted to ISO string
      }

      const foodLogsRef = collection(db, `users/${user.user.uid}/foodLogs`);
      const q = query(
        foodLogsRef,
        where("timestamp", ">=", startDate), // Compare ISO strings
        orderBy("timestamp", "desc") // Order by timestamp
      );

      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const logs = [];
          querySnapshot.forEach((doc) => {
            logs.push({ id: doc.id, ...doc.data() });
          });
          setFoodLogs(logs);
          setLoading(false);
        },
        (err) => {
          setError("Failed to fetch food logs. Please try again.");
          console.error("Fetch Error:", err);
          setLoading(false);
        }
      );

      return () => unsubscribe(); // Clean up the listener
    }
  }, [timeframe, user]);

  // Calculate totals for calories, fat, carbs, and protein
  const calculateTotals = () => {
    const totals = {
      calories: 0,
      fat: 0,
      carbs: 0,
      protein: 0,
    };

    foodLogs.forEach((log) => {
      totals.calories += parseFloat(log.calories) || 0;
      totals.fat += parseFloat(log.fat) || 0;
      totals.carbs += parseFloat(log.carbs) || 0;
      totals.protein += parseFloat(log.protein) || 0;
    });

    return totals;
  };

  // Prepare data for the graph (weekly or monthly)
  const prepareGraphData = () => {
    const groupedData = {};

    foodLogs.forEach((log) => {
      const date = new Date(log.timestamp).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' }); 
      if (!groupedData[date]) {
        groupedData[date] = {
          date,
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
        };
      }
      groupedData[date].calories += parseFloat(log.calories) || 0;
      groupedData[date].protein += parseFloat(log.protein) || 0;
      groupedData[date].carbs += parseFloat(log.carbs) || 0;
      groupedData[date].fat += parseFloat(log.fat) || 0;
    });

    return Object.values(groupedData);
  };

  const graphData = prepareGraphData();

  // Get the goal for the selected stat
  const goal = goals[selectedStat];

  return (
    <div className="min-h-screen bg-offwhite">
      <Header />
      <div className="p-4">
        <h1 className="text-2xl font-semibold mb-4">Food Tracker</h1>

        {/* Timeframe Selector */}
        <div className="mb-4">
          <label htmlFor="timeframe" className="block text-sm font-medium text-gray-700">
            Select Timeframe:
          </label>
          <select
            id="timeframe"
            className="mt-1 block w-full p-2 border border-orange-400 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors duration-200"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
          >
            <option value="today">Today</option>
            <option value="thisWeek">This Week</option>
            <option value="thisMonth">This Month</option>
          </select>
        </div>

        {/* Stat Selector */}
        {timeframe !== "today" && (
          <div className="mb-4">
            <select
              id="stat"
              className="mt-1 block w-full p-2 border border-orange-400 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors duration-200"
              value={selectedStat}
              onChange={(e) => setSelectedStat(e.target.value)}
            >
              <option value="calories">Calories</option>
              <option value="protein">Protein</option>
              <option value="carbs">Carbs</option>
              <option value="fat">Fat</option>
            </select>
          </div>
        )}

        {/* Graph (Only for "This Week" or "This Month") */}
        {timeframe !== "today" && (
          <div className="mb-4 p-4 bg-white rounded-lg shadow-sm">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={graphData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" reversed={true} tick={false}/>
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey={selectedStat}
                  stroke="#fb923c" // Orange for the selected stat
                  name={selectedStat.toUpperCase()}
                />
                {/* Goal Line */}
                <ReferenceLine
                  y={goal}
                  stroke="#3b82f6" // Blue for the goal line
                  strokeDasharray="5 5"
                  label={`Goal: ${goal}`}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Totals */}
        <div className="mb-4 p-4 bg-orange-400 rounded-lg shadow-sm">
          <h2 className="text-lg text-white font-semibold mb-2">Totals</h2>
          <ul className="space-y-1">
            <li className="text-sm text-white">Calories: {calculateTotals().calories.toFixed(2)} / {goals.calories} kcal</li>
            <li className="text-sm text-white">Protein: {calculateTotals().protein.toFixed(2)} / {goals.protein} g</li>
            <li className="text-sm text-white">Carbs: {calculateTotals().carbs.toFixed(2)} / {goals.carbs} g</li>
            <li className="text-sm text-white">Fat: {calculateTotals().fat.toFixed(2)} / {goals.fat} g</li>
          </ul>
        </div>

        {/* Food Logs */}
        {loading && <p className="text-sm text-gray-500">Loading...</p>}
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <ul className="space-y-3">
          {foodLogs.map((log) => (
            <li key={log.id} className="p-4 border border-orange-400 rounded-lg bg-white shadow-sm">
              <p className="font-medium">{log.name}</p>
              <p className="text-sm text-gray-500">
                {new Date(log.timestamp).toLocaleString()} {/* Parse ISO string to display */}
              </p>
              <ul className="mt-2 space-y-1">
                <li className="text-sm text-gray-700">Calories: {log.calories} kcal</li>
                <li className="text-sm text-gray-700">Protein: {log.protein} g</li>
                <li className="text-sm text-gray-700">Carbs: {log.carbs} g</li>
                <li className="text-sm text-gray-700">Fat: {log.fat} g</li>
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TrackerPage;