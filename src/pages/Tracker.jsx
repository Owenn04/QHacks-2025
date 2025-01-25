import React, { useState, useEffect, useContext } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs, onSnapshot, orderBy } from "firebase/firestore";
import Header from "../components/Header";
import { UserContext } from "../App";

function TrackerPage() {
  const [foodLogs, setFoodLogs] = useState([]);
  const [timeframe, setTimeframe] = useState("today"); // Default timeframe
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const user = useContext(UserContext); // Get the logged-in user

  useEffect(() => {
    if (user?.user?.uid) {
      const now = new Date();
      let startDate;

      switch (timeframe) {
        case "today":
          startDate = new Date(now.setHours(0, 0, 0, 0)).toISOString();
          break;
        case "thisWeek":
          startDate = new Date(now.setDate(now.getDate() - now.getDay())).toISOString();
          break;
        case "thisMonth":
          startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
          break;
        default:
          startDate = new Date(0).toISOString();
      }

      const foodLogsRef = collection(db, `users/${user.user.uid}/foodLogs`);
      const q = query(
        foodLogsRef,
        where("timestamp", ">=", startDate),
        orderBy("timestamp", "desc") 
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const logs = [];
        querySnapshot.forEach((doc) => {
          logs.push({ id: doc.id, ...doc.data() });
        });
        setFoodLogs(logs);
      });

      return () => unsubscribe(); // Clean up the listener
    }
  }, [timeframe, user]);

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

  const totals = calculateTotals();

  return (
    <div className="min-h-screen bg-offwhite">
      <Header />
      <div className="p-4">
        <h1 className="text-2xl font-semibold mb-4">History</h1>

        {/* Timeframe Selector */}
        <div className="mb-4">
          <select
            id="timeframe"
            className="mt-1 block w-full p-2 border border-orange-400 rounded-lg"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
          >
            <option value="today">Today</option>
            <option value="thisWeek">This Week</option>
            <option value="thisMonth">This Month</option>
          </select>
        </div>

        {/* Totals */}
        <div className="mb-4 p-4 bg-orange-400 rounded-lg shadow-sm">
          <h2 className="text-lg text-white font-semibold mb-2">Totals</h2>
          <ul className="space-y-1">
            <li className="text-sm text-white">Calories: {totals.calories.toFixed(2)} kcal</li>
            <li className="text-sm text-white">Fat: {totals.fat.toFixed(2)} g</li>
            <li className="text-sm text-white">Carbs: {totals.carbs.toFixed(2)} g</li>
            <li className="text-sm text-white">Protein: {totals.protein.toFixed(2)} g</li>
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
                {new Date(log.timestamp).toLocaleString()}
              </p>
              <ul className="mt-2 space-y-1">
                <li className="text-sm text-gray-700">Calories: {log.calories} kcal</li>
                <li className="text-sm text-gray-700">Fat: {log.fat} g</li>
                <li className="text-sm text-gray-700">Carbs: {log.carbs} g</li>
                <li className="text-sm text-gray-700">Protein: {log.protein} g</li>
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TrackerPage;