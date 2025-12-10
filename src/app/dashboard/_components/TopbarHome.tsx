"use client";

import React, { useEffect, useState } from "react";
import {
  Users,
  Calendar,
  Trophy,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Loader2, // Added for loading state
} from "lucide-react";

// --- TypeScript Interfaces ---

interface ChangeData {
  value: string;
  isPositive: boolean;
  label: string;
}

interface CardData {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change: ChangeData;
  color: "primary" | "secondary" | "indigo" | "black";
}

interface DashboardData {
  totalCustomers: CardData;
  thisMonthTotal: CardData;
  winners: CardData;
  revenues: CardData;
}

// Shape of the API response expected from /api/admin/stats/overview
interface ApiResponse {
  totalCustomers: string | number;
  monthlyRevenue: string | number;
  winners: string | number;
  distributedCoins: string | number;
  changes: {
    totalCustomers: string;
    monthlyRevenue: string;
    winners: string;
    distributedCoins: string;
  };
}

// --- Configuration ---

const COLORS = {
  primary: "#7B61FF",
  secondary: "#14171A",
  accent: "#F3ECFF",
};

// --- Helper Functions ---

const getBorderStyle = (color: CardData["color"]) => {
  switch (color) {
    case "primary": return { borderLeftColor: COLORS.primary };
    case "secondary": return { borderLeftColor: COLORS.secondary };
    case "black": return { borderLeftColor: "#000000" };
    case "indigo": return { borderLeftColor: "#4F46E5" };
    default: return { borderLeftColor: COLORS.primary };
  }
};

const getIconBgStyle = (color: CardData["color"]) => {
  switch (color) {
    case "primary": return { backgroundColor: COLORS.accent };
    case "secondary": return { backgroundColor: "#F3F4F6" }; // gray-100
    case "black": return { backgroundColor: "#E5E7EB" }; // gray-200
    case "indigo": return { backgroundColor: "#EEF2FF" }; // indigo-50
    default: return { backgroundColor: COLORS.accent };
  }
};

const getIconColorStyle = (color: CardData["color"]) => {
  switch (color) {
    case "primary": return { color: COLORS.primary };
    case "secondary": return { color: COLORS.secondary };
    case "black": return { color: "#111827" }; // gray-900
    case "indigo": return { color: "#4F46E5" }; // indigo-600
    default: return { color: COLORS.primary };
  }
};

// --- Data Transformer ---

function transformApiData(data: ApiResponse): DashboardData {
  return {
    totalCustomers: {
      title: "Total Customers",
      value: data.totalCustomers,
      icon: <Users className="w-5 h-5" />,
      change: {
        value: data.changes.totalCustomers,
        isPositive: true, // You might want to calculate this dynamically based on string parsing if needed
        label: "Since last year",
      },
      color: "primary",
    },
    thisMonthTotal: {
      title: "This Month Total",
      value: `₹${data.monthlyRevenue}`,
      icon: <Calendar className="w-5 h-5" />,
      change: {
        value: data.changes.monthlyRevenue,
        isPositive: true,
        label: "From last month",
      },
      color: "secondary",
    },
    winners: {
      title: "Winners",
      value: data.winners,
      icon: <Trophy className="w-5 h-5" />,
      change: {
        value: data.changes.winners,
        isPositive: true,
        label: "More Winners",
      },
      color: "black",
    },
    revenues: {
      title: "Coins Distributed",
      value: data.distributedCoins,
      icon: <DollarSign className="w-5 h-5" />,
      change: {
        value: data.changes.distributedCoins,
        isPositive: true,
        label: "Lifetime",
      },
      color: "indigo",
    },
  };
}

// --- Main Component ---

export default function TopbarHome() {
  const [stats, setStats] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats/overview");
        if (!res.ok) throw new Error("Failed to fetch");
        
        const data: ApiResponse = await res.json();
        setStats(transformApiData(data));
      } catch (err) {
        console.error("Stats fetch error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // 1. Loading State
  if (loading) {
    return (
      <div className="w-full h-32 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  // 2. Error State (Optional fallback)
  if (error || !stats) {
    return (
      <div className="w-full p-6 text-center text-red-500">
        Failed to load dashboard statistics.
      </div>
    );
  }

  // 3. Success State (Render Cards)
  return (
    <div className="w-full p-4 md:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {Object.entries(stats).map(([key, card]) => (
          <div
            key={key}
            className="bg-white rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow duration-200 border-l-4"
            style={getBorderStyle(card.color)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className="p-2 rounded-lg"
                  style={getIconBgStyle(card.color)}
                >
                  <div style={getIconColorStyle(card.color)}>
                    {card.icon}
                  </div>
                </div>
                <div>
                  <h3 className="text-gray-600 text-sm font-medium">
                    {card.title}
                  </h3>
                  <p className="text-gray-900 text-2xl font-bold mt-1">
                    {card.value}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center mt-4">
              <div
                className={`flex items-center ${
                  card.change.isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {card.change.isPositive ? (
                  <TrendingUp className="w-4 h-4 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-1" />
                )}
                <span className="text-sm font-medium">
                  {card.change.value}
                </span>
              </div>
              <span className="text-gray-600 text-sm ml-2">
                {card.change.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}