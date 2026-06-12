import React from "react";

const StatCard = ({ title, value, percentage, isPositive, subtitle, icon, sparklineData }) => {
  return (
    <div className="bg-white rounded-lg border p-4 shadow-sm flex flex-col justify-between">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        {icon && <span className="text-gray-400">{icon}</span>}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-gray-800">{value}</span>
        {percentage && (
          <span className={`text-xs font-semibold ${isPositive ? "text-green-500" : "text-red-500"}`}>
            {isPositive ? "+" : ""}{percentage}%
          </span>
        )}
      </div>
      {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
      
      {sparklineData && (
        <div className="mt-4 h-10 w-full flex items-end gap-1">
          {sparklineData.map((val, i) => (
             <div 
               key={i} 
               className="bg-indigo-500 rounded-t-sm flex-1 opacity-80" 
               style={{ height: `${val}%` }}
             ></div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StatCard;
