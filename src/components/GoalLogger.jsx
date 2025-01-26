import React from 'react';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const GoalLogger = ({ goalData, userId, onSuccess, onError }) => {
  const logGoals = async () => {
    // Add validation check
    if (!userId) {
      console.error('No userId provided to GoalLogger');
      if (onError) {
        onError(new Error('No userId provided'));
      }
      return;
    }

    // Debug logs
    console.log('Attempting to log goals with:', {
      userId,
      goalData
    });

    try {
      const db = getFirestore();
      
      // Create the goal entry
      const goalEntry = {
        calories: goalData.calories || 0,
        protein: goalData.protein || 0,
        carbs: goalData.carbs || 0,
        fat: goalData.fat || 0,
        lastUpdated: new Date().toISOString()
      };

      console.log('Goal entry created:', goalEntry);

      // Get reference to the user's goals document
      const userGoalsDocRef = doc(db, 'users', userId.trim(), 'goals', 'current');
      
      // Set the document (this will create it if it doesn't exist, or update it if it does)
      await setDoc(userGoalsDocRef, goalEntry);
      
      console.log('Goals updated successfully');
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error) {
      console.error('Error updating goals: ', error);
      if (onError) {
        onError(error);
      }
      throw error;
    }
  };

  return (
    <div>
      <button
        onClick={logGoals}
        disabled={!userId}
        className={`w-full ${userId ? 'bg-orange-500 hover:bg-orange-600' : 'bg-gray-400'} text-white px-4 py-2 rounded-lg font-medium`}
      >
        Save Goals
      </button>
    </div>
  );
};

export default GoalLogger;