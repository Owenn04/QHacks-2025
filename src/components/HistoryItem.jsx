import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const HistoryItem = ({ item }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Format the timestamp
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
      >
        <div className="flex items-center justify-between flex-1">
          <span className="font-medium">{item.name}</span>
          <span className="text-gray-600">{item.calories} kcal</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="ml-2 text-gray-400 w-5 h-5" />
        ) : (
          <ChevronDown className="ml-2 text-gray-400 w-5 h-5" />
        )}
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 text-sm text-gray-600 border-t">
          <div className="pt-3 space-y-1">
            <p>Protein: {item.protein}g</p>
            <p>Carbs: {item.carbs}g</p>
            <p>Fat: {item.fat}g</p>
            <p className="text-gray-400 text-xs mt-2">
              Logged at {formatDate(item.timestamp)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryItem;