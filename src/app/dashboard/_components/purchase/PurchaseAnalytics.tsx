"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { name: 'Mon', revenue: 4000 },
  { name: 'Tue', revenue: 3000 },
  { name: 'Wed', revenue: 5000 },
  { name: 'Thu', revenue: 2780 },
  { name: 'Fri', revenue: 6890 },
  { name: 'Sat', revenue: 8390 },
  { name: 'Sun', revenue: 7490 },
];

const PurchaseAnalytics = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Revenue Trends</h2>
        <select className="text-sm border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50">
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
        </select>
      </div>

      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6B7280', fontSize: 12 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6B7280', fontSize: 12 }} 
            />
            <Tooltip 
              cursor={{ fill: '#F9FAFB' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            />
            <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index === data.length - 1 ? '#4F46E5' : '#818CF8'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="p-3 rounded-lg bg-green-50 border border-green-100">
          <p className="text-xs text-green-700 font-medium uppercase">Online Split</p>
          <p className="text-lg font-bold text-green-800">65%</p>
        </div>
        <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
          <p className="text-xs text-gray-600 font-medium uppercase">Peak Hour</p>
          <p className="text-lg font-bold text-gray-800">7 PM</p>
        </div>
      </div>
    </div>
  );
};

export default PurchaseAnalytics;