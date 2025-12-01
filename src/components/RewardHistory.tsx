"use client";
import { useEffect, useState, useMemo } from "react";
import { 
  History, Coins, Sparkles, Gift, Trophy, Wallet, 
  IndianRupee, CheckCircle, Clock, XCircle, ShoppingBag 
} from 'lucide-react';

interface User {
  id: string;
  // ... other user properties
}

// Normalized structure for the history item fetched from the API
interface HistoryItem {
  id: string | number; 
  type: "EARN" | "SPEND" | "CASH_EARN"; // Added CASH_EARN for clarity
  title: string;
  subtitle: string;
  coins: number;
  cashAmount?: number; 
  isPositive: boolean; 
  date: string; 
  status: 'APPROVED' | 'PENDING' | 'REJECTED' | 'COMPLETED'; // Simplified status
}

interface RewardHistoryProps {
  user: User;
}


export default function RewardHistoryDynamic({ user }: RewardHistoryProps) {
  const [historyList, setHistoryList] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Data Fetching
  useEffect(() => {
    async function fetchHistory() {
      // Ensure user ID exists before fetching
      if (!user.id) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        // Calls the combined history API route (as used in the first component)
        // Ensure your API returns data matching the HistoryItem structure
        const res = await fetch(`/api/user/history?userId=${user.id}`); 
        
        if (!res.ok) {
           throw new Error(`API error: ${res.status}`);
        }
        
        const data = await res.json();
        
        if (data.history) {
          // Sort by date descending (newest first)
          const sortedHistory = data.history.sort((a: HistoryItem, b: HistoryItem) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          setHistoryList(sortedHistory);
        }
      } catch (e) {
        console.error("Failed to fetch history:", e);
        // Optionally set an error state here
      } finally {
        setIsLoading(false);
      }
    }
    fetchHistory();
    // Re-fetch if user.id changes
  }, [user.id]);

  // 2. Computed Stats (using useMemo for efficiency)
  const stats = useMemo(() => {
    let totalCoinsEarned = 0;
    let totalCoinsRedeemed = 0;
    let totalCashEarned = 0;

    historyList.forEach(item => {
      const coins = item.coins || 0;
      const cash = item.cashAmount || 0;

      if (item.type === 'EARN' && item.isPositive) {
        totalCoinsEarned += coins;
      } else if (item.type === 'CASH_EARN' && item.isPositive) {
         totalCashEarned += cash;
         // Handle combined rewards if your API logic requires it
         if (item.type === 'CASH_EARN' && item.coins > 0) {
            totalCoinsEarned += coins;
         }
      } else if (item.type === 'SPEND' && !item.isPositive) {
        totalCoinsRedeemed += coins;
      }
    });

    const netCoins = totalCoinsEarned - totalCoinsRedeemed;

    return {
      totalCoinsEarned,
      totalCoinsRedeemed,
      totalCashEarned,
      netCoins,
    };
  }, [historyList]);
  
  // Icon for the type of activity
  const getTypeIcon = (title: string, type: HistoryItem['type']) => {
    if (type === 'SPEND') return <Gift size={20} />;
    if (title.toLowerCase().includes('spin')) return <Sparkles size={20} />;
    if (title.toLowerCase().includes('draw') || title.toLowerCase().includes('winner')) return <Trophy size={20} />;
    if (type === 'CASH_EARN') return <Wallet size={20} />;
    return <Coins size={20} />; // Default for EARN
  };

  const getStatusIcon = (status: HistoryItem['status']) => {
    switch (status) {
      case 'APPROVED': 
      case 'COMPLETED': 
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'PENDING': 
        return <Clock className="w-4 h-4 text-yellow-500 animate-pulse" />;
      case 'REJECTED': 
        return <XCircle className="w-4 h-4 text-red-500" />;
      default: 
        return null;
    }
  };

  const getTypeStyle = (item: HistoryItem) => {
    const isSpend = item.type === 'SPEND' || !item.isPositive;
    const isCash = item.type === 'CASH_EARN' && item.cashAmount && item.cashAmount > 0;
    const isEarn = !isSpend && !isCash;

    if (isSpend) {
      return { 
        bg: 'bg-red-100', 
        text: 'text-red-600', 
        primaryColor: 'text-red-500', 
        label: 'Coins Used' 
      };
    }
    if (isCash) {
      return { 
        bg: 'bg-green-100', 
        text: 'text-green-600', 
        primaryColor: 'text-green-600', 
        label: 'Cash Earned' 
      };
    }
    if (isEarn) {
      return { 
        bg: 'bg-blue-100', 
        text: 'text-blue-600', 
        primaryColor: 'text-blue-600', 
        label: 'Coins Earned' 
      };
    }
    
    return { 
        bg: 'bg-gray-100', 
        text: 'text-gray-600', 
        primaryColor: 'text-gray-600', 
        label: 'Activity' 
    };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };


  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
        <div className="text-center py-10 text-gray-500">
          <Clock className="w-8 h-8 mx-auto mb-2 animate-spin text-gray-400" />
          <p>Loading transaction history...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-6 max-w-4xl mx-auto w-full">
      
      {/* Enhanced Header */}
      <div className="flex items-start justify-between mb-6 border-b pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 to-primary rounded-xl flex items-center justify-center shadow-lg">
            <History className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">Activity Log</h3>
            <p className="text-gray-600 text-sm">Your complete earning and spending history</p>
          </div>
        </div>
        
        {/* Current Balances */}
        <div className="text-right flex flex-col gap-1">
          <div className="flex items-center justify-end gap-1 text-primary">
            <Coins className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-base sm:text-lg font-bold">{stats.netCoins}</span>
          </div>
          <div className="flex items-center justify-end gap-1 text-green-600">
            <IndianRupee className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-sm font-bold">{stats.totalCashEarned}</span>
          </div>
          <p className="text-gray-500 text-xs">Total Available</p>
        </div>
      </div>
      
      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard 
          icon={<Coins className="w-4 h-4 text-blue-700" />} 
          title="Coins Earned" 
          value={stats.totalCoinsEarned} 
          bgColor="bg-blue-50" 
          borderColor="border-blue-200" 
        />
        <StatCard 
          icon={<IndianRupee className="w-4 h-4 text-green-700" />} 
          title="Cash Earned" 
          value={stats.totalCashEarned} 
          bgColor="bg-green-50" 
          borderColor="border-green-200" 
        />
        <StatCard 
          icon={<Gift className="w-4 h-4 text-orange-700" />} 
          title="Coins Used" 
          value={stats.totalCoinsRedeemed} 
          bgColor="bg-orange-50" 
          borderColor="border-orange-200" 
        />
        <StatCard 
          icon={<Wallet className="w-4 h-4 text-purple-700" />} 
          title="Net Coins" 
          value={stats.netCoins} 
          bgColor="bg-purple-50" 
          borderColor="border-purple-200" 
        />
      </div>

      {/* History List */}
      <div className="space-y-3">
        {historyList.length === 0 ? (
          <EmptyState />
        ) : (
          historyList.map((item) => {
            const styles = getTypeStyle(item);
            const primaryValue = item.type === 'CASH_EARN' && item.cashAmount && item.cashAmount > 0 ? item.cashAmount : item.coins;
            const primaryIcon = item.type === 'CASH_EARN' && item.cashAmount && item.cashAmount > 0 ? <IndianRupee className="w-4 h-4" /> : <Coins className="w-4 h-4" />;
            const secondaryValue = item.type === 'CASH_EARN' && item.coins && item.coins > 0 ? `+${item.coins} coins` : null;

            return (
              <div 
                key={item.id} 
                className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-white hover:shadow-lg transition-all duration-200 group"
              >
                
                {/* Left Side: Icon and Details */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`p-2 rounded-lg flex-shrink-0 ${styles.bg} ${styles.text}`}>
                    {getTypeIcon(item.title, item.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm sm:text-base text-gray-900 truncate flex items-center gap-2">
                       {item.title} 
                       {getStatusIcon(item.status)}
                    </div>
                    <div className="text-xs text-gray-500 flex flex-wrap gap-x-2">
                       <span>{formatDate(item.date)}</span>
                       <span className="truncate hidden sm:inline">• {item.subtitle}</span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Amount and Status */}
                <div className="text-right flex-shrink-0 ml-3">
                  <div className={`font-bold text-base sm:text-lg flex items-center justify-end gap-1 ${styles.primaryColor}`}>
                    {primaryIcon}
                    <span>
                      {item.isPositive ? '+' : '-'}
                      {primaryValue}
                    </span>
                  </div>
                  
                  {/* Secondary/Combined Reward Display */}
                  {secondaryValue && (
                     <div className="text-xs text-gray-500 font-medium mt-0.5">
                        {secondaryValue}
                     </div>
                  )}

                  <div className={`text-[10px] sm:text-xs uppercase font-bold mt-1 ${styles.primaryColor}`}>
                     {item.status !== 'COMPLETED' ? item.status : styles.label}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      
    </div>
  );
}

interface StatCardProps {
    icon: React.ReactNode;
    title: string;
    value: number;
    bgColor: string;
    borderColor: string;
}
const StatCard: React.FC<StatCardProps> = ({ icon, title, value, bgColor, borderColor }) => (
    <div className={`${bgColor} rounded-xl p-3 text-center border ${borderColor} flex flex-col items-center`}>
        <div className="flex items-center justify-center gap-1 mb-1">
            {icon}
            <span className="font-bold text-lg text-gray-800">{value}</span>
        </div>
        <div className="text-gray-600 text-xs font-medium">{title}</div>
    </div>
);

const EmptyState: React.FC = () => (
    <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-200 shadow-md">
            <Coins className="w-8 h-8 text-gray-400" />
        </div>
        <h4 className="text-lg font-semibold text-gray-600 mb-2">
            No Activity Found
        </h4>
        <p className="text-gray-500 text-sm mb-4">
            It looks like you haven&apos;t earned or redeemed any rewards yet.
        </p>
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <Sparkles className="w-4 h-4" />
            <span>Shop to earn • Check back soon!</span>
        </div>
    </div>
);