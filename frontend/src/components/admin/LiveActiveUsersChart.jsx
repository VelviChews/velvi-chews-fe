import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const LiveActiveUsersChart = ({ data = [], totalActive = 0 }) => {
  return (
    <div className="bg-white rounded-lg border shadow-sm p-4 w-full h-[300px] flex flex-col">
      <div className="mb-2">
        <h2 className="text-sm font-semibold text-gray-800">Live Active Users</h2>
        <div className="text-3xl font-bold text-gray-900 mt-1">{totalActive}</div>
      </div>
      
      <div className="flex-1 w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6B7280' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6B7280' }} />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            />
            <Area type="monotone" dataKey="logins" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorActive)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
