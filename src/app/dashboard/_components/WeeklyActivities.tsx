"use client";

import React, { useEffect, useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell
} from 'recharts';
import { Loader2 } from 'lucide-react';

// --- Interfaces ---

interface ActivityData {
  day: string;
  activities: number;
}

interface WeeklyStats {
  total: number;
  average: number;
  peakDay: string;
  growth: number;
}

interface ApiResponse {
  chartData: ActivityData[];
  stats: WeeklyStats;
}

// FIX: Define a strict interface for the Custom Tooltip props
interface CustomTooltipProps {
  active?: boolean;
  payload?: { value: number }[]; // Strictly typed payload array
  label?: string;
}

// --- Component ---

const WeeklyActivities = () => {
  const [data, setData] = useState<ActivityData[]>([]);
  const [stats, setStats] = useState<WeeklyStats>({
    total: 0,
    average: 0,
    peakDay: '-',
    growth: 0
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/admin/stats/weekly-activity");
        if (!res.ok) throw new Error("Failed to fetch");
        
        const jsonData: ApiResponse = await res.json();
        setData(jsonData.chartData);
        setStats(jsonData.stats);
      } catch (error) {
        console.error("Error fetching weekly activities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- Type-Safe Custom Tooltip ---
  // Using the custom interface instead of the library's generic TooltipProps
  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length > 0) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
          <p className="text-gray-800 font-medium">{label}</p>
          <p className="text-primary text-sm">
            Activities: <span className="font-bold">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 h-full w-full md:w-[60%] border border-gray-200 flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 h-full w-full md:w-[60%] border-2 border-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Weekly Activity</h2>
          <p className="text-gray-600 text-sm mt-1">Total activities overview</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
            <span className="text-sm text-gray-600">Transactions</span>
          </div>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 10,
              left: -20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis 
              dataKey="day" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
            />
            {/* Pass the custom tooltip */}
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F3F4F6' }} />
            <Bar 
              dataKey="activities" 
              radius={[4, 4, 0, 0]}
              barSize={32}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={index === data.length - 1 ? '#4F46E5' : '#7B61FF'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-gray-600 text-sm">Total Activities</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">
              {stats.total.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Avg. Daily</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">
              {stats.average.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Peak Day</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">
              {stats.peakDay}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Growth</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              +{stats.growth}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyActivities;