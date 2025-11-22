"use client";
import { useState } from "react";
import { Coins, Sparkles, Gift, Trophy, ChevronLeft, ChevronRight, Zap, Crown, IndianRupee, Wallet } from "lucide-react";

interface RewardHistory {
  id: string;
  date: string;
  coinsEarned?: number;
  coinsRedeemed?: number;
  cashEarned?: number;
  type: "purchase" | "spin" | "lucky-draw" | "redemption" | "cash-reward";
  description: string;
  status: "earned" | "redeemed";
  rewardType: "coins" | "cash" | "both";
}

export default function RewardHistory() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Enhanced reward history data including cash rewards
  const rewardHistory: RewardHistory[] = [
    {
      id: "1",
      date: "2024-01-15T10:30:00",
      coinsEarned: 12,
      type: "purchase",
      description: "Grocery Shopping - ₹250",
      status: "earned",
      rewardType: "coins"
    },
    {
      id: "2",
      date: "2024-01-15T09:15:00",
      coinsEarned: 25,
      type: "spin",
      description: "Spin Reward - Lucky Wheel",
      status: "earned",
      rewardType: "coins"
    },
    {
      id: "3",
      date: "2024-01-14T18:45:00",
      coinsEarned: 42,
      type: "purchase",
      description: "Monthly Supplies - ₹500",
      status: "earned",
      rewardType: "coins"
    },
    {
      id: "4",
      date: "2024-01-14T14:20:00",
      cashEarned: 50,
      type: "lucky-draw",
      description: "Lucky Draw Winner 🎉",
      status: "earned",
      rewardType: "cash"
    },
    {
      id: "5",
      date: "2024-01-13T16:30:00",
      coinsRedeemed: 200,
      type: "redemption",
      description: "Redeemed - 1kg Sugar",
      status: "redeemed",
      rewardType: "coins"
    },
    {
      id: "6",
      date: "2024-01-13T11:00:00",
      coinsEarned: 28,
      type: "purchase",
      description: "Kitchen Items - ₹350",
      status: "earned",
      rewardType: "coins"
    },
    {
      id: "7",
      date: "2024-01-12T19:15:00",
      cashEarned: 100,
      coinsEarned: 35,
      type: "spin",
      description: "Spin Reward - Mega Win!",
      status: "earned",
      rewardType: "both"
    },
    {
      id: "8",
      date: "2024-01-12T15:45:00",
      coinsEarned: 85,
      type: "purchase",
      description: "Weekly Groceries - ₹1200",
      status: "earned",
      rewardType: "coins"
    },
    {
      id: "9",
      date: "2024-01-11T12:30:00",
      coinsRedeemed: 300,
      type: "redemption",
      description: "Redeemed - ₹100 Cashback",
      status: "redeemed",
      rewardType: "coins"
    },
    {
      id: "10",
      date: "2024-01-10T17:20:00",
      cashEarned: 200,
      type: "lucky-draw",
      description: "Grand Lucky Draw Winner 🏆",
      status: "earned",
      rewardType: "cash"
    },
    {
      id: "11",
      date: "2024-01-10T14:15:00",
      cashEarned: 25,
      type: "cash-reward",
      description: "Instant Cash Reward",
      status: "earned",
      rewardType: "cash"
    },
    {
      id: "12",
      date: "2024-01-09T16:45:00",
      coinsEarned: 15,
      cashEarned: 10,
      type: "spin",
      description: "Daily Spin Bonus",
      status: "earned",
      rewardType: "both"
    }
  ];

  // Calculate pagination
  const totalPages = Math.ceil(rewardHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = rewardHistory.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "purchase":
        return <Coins className="w-4 h-4" />;
      case "spin":
        return <Sparkles className="w-4 h-4" />;
      case "lucky-draw":
        return <Trophy className="w-4 h-4" />;
      case "redemption":
        return <Gift className="w-4 h-4" />;
      case "cash-reward":
        return <Wallet className="w-4 h-4" />;
      default:
        return <Coins className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string, status: string) => {
    if (status === "redeemed") {
      return "bg-orange-100 text-orange-700 border-orange-200";
    }
    
    switch (type) {
      case "purchase":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "spin":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "lucky-draw":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "redemption":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "cash-reward":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getRewardIcon = (rewardType: string) => {
    switch (rewardType) {
      case "coins":
        return <Coins className="w-4 h-4 text-yellow-500" />;
      case "cash":
        return <IndianRupee className="w-4 h-4 text-green-500" />;
      case "both":
        return (
          <div className="flex gap-1">
            <Coins className="w-3 h-3 text-yellow-500" />
            <IndianRupee className="w-3 h-3 text-green-500" />
          </div>
        );
      default:
        return <Coins className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    return status === "earned" ? "text-green-600" : "text-orange-600";
  };

  const getStatusIcon = (status: string) => {
    return status === "earned" ? 
      <Zap className="w-4 h-4 text-green-500" /> : 
      <Gift className="w-4 h-4 text-orange-500" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTotalCoinsEarned = () => {
    return rewardHistory
      .filter(item => item.status === "earned")
      .reduce((total, item) => total + (item.coinsEarned || 0), 0);
  };

  const getTotalCoinsRedeemed = () => {
    return rewardHistory
      .filter(item => item.status === "redeemed")
      .reduce((total, item) => total + (item.coinsRedeemed || 0), 0);
  };

  const getTotalCashEarned = () => {
    return rewardHistory
      .filter(item => item.status === "earned")
      .reduce((total, item) => total + (item.cashEarned || 0), 0);
  };

  const getNetCoins = () => {
    return getTotalCoinsEarned() - getTotalCoinsRedeemed();
  };

  const getRewardDisplay = (reward: RewardHistory) => {
    if (reward.status === "redeemed") {
      return {
        amount: reward.coinsRedeemed || 0,
        prefix: "-",
        type: "coins" as const
      };
    }

    if (reward.rewardType === "coins") {
      return {
        amount: reward.coinsEarned || 0,
        prefix: "+",
        type: "coins" as const
      };
    }

    if (reward.rewardType === "cash") {
      return {
        amount: reward.cashEarned || 0,
        prefix: "+",
        type: "cash" as const
      };
    }

    // For "both" type, show coins as primary with cash indicator
    return {
      amount: reward.coinsEarned || 0,
      prefix: "+",
      type: "both" as const,
      cashAmount: reward.cashEarned || 0
    };
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Coins className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Rewards & Transactions</h3>
            <p className="text-gray-600 text-sm">Track your coins and cash rewards</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="flex items-center gap-2 text-primary mb-1">
            <Coins className="w-5 h-5" />
            <span className="text-lg font-bold">{getNetCoins()}</span>
          </div>
          <div className="flex items-center gap-2 text-green-600">
            <IndianRupee className="w-4 h-4" />
            <span className="text-sm font-bold">{getTotalCashEarned()}</span>
          </div>
          <p className="text-gray-600 text-xs">Total Rewards</p>
        </div>
      </div>

      {/* Enhanced Stats Bar */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="bg-blue-50 rounded-xl p-3 text-center border border-blue-200">
          <div className="flex items-center justify-center gap-1 text-blue-700 mb-1">
            <Coins className="w-4 h-4" />
            <span className="font-bold text-lg">{getTotalCoinsEarned()}</span>
          </div>
          <div className="text-blue-600 text-xs font-medium">Coins Earned</div>
        </div>
        <div className="bg-green-50 rounded-xl p-3 text-center border border-green-200">
          <div className="flex items-center justify-center gap-1 text-green-700 mb-1">
            <IndianRupee className="w-4 h-4" />
            <span className="font-bold text-lg">{getTotalCashEarned()}</span>
          </div>
          <div className="text-green-600 text-xs font-medium">Cash Earned</div>
        </div>
        <div className="bg-orange-50 rounded-xl p-3 text-center border border-orange-200">
          <div className="flex items-center justify-center gap-1 text-orange-700 mb-1">
            <Gift className="w-4 h-4" />
            <span className="font-bold text-lg">{getTotalCoinsRedeemed()}</span>
          </div>
          <div className="text-orange-600 text-xs font-medium">Coins Used</div>
        </div>
        <div className="bg-purple-50 rounded-xl p-3 text-center border border-purple-200">
          <div className="flex items-center justify-center gap-1 text-purple-700 mb-1">
            <Wallet className="w-4 h-4" />
            <span className="font-bold text-lg">{getNetCoins()}</span>
          </div>
          <div className="text-purple-600 text-xs font-medium">Available Coins</div>
        </div>
      </div>

      {/* Enhanced History List */}
      <div className="space-y-3 mb-6">
        {currentItems.map((reward) => {
          const rewardDisplay = getRewardDisplay(reward);
          
          return (
            <div
              key={reward.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-white hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex items-center gap-4 flex-1">

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900 text-sm">
                      {reward.description}
                    </span>
                    {reward.type === "lucky-draw" && (
                      <Crown className="w-4 h-4 text-yellow-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-600">
                    <span>{formatDate(reward.date)}</span>
                    <span className={`px-2 py-1 rounded-full font-medium ${getTypeColor(reward.type, reward.status)}`}>
                      {reward.type.replace('-', ' ')}
                    </span>
                    <div className="flex items-center gap-1">
                      {getRewardIcon(reward.rewardType)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Reward Amount */}
              <div className="text-right">
                <div className={`flex items-center gap-2 font-bold text-lg ${getStatusColor(reward.status)}`}>
                  {getStatusIcon(reward.status)}
                  <div className="flex items-center gap-1">
                    {rewardDisplay.type === "cash" && <IndianRupee className="w-4 h-4" />}
                    <span>
                      {rewardDisplay.prefix}
                      {rewardDisplay.amount}
                    </span>
                    
                  </div>
                </div>
                
                {/* Additional cash amount for "both" type */}
                {rewardDisplay.type === "both" && rewardDisplay.cashAmount && (
                  <div className="flex items-center gap-1 text-green-600 text-sm font-medium mt-1">
                    <IndianRupee className="w-3 h-3" />
                    <span>+{rewardDisplay.cashAmount} cash</span>
                  </div>
                )}
                
                <div className={`text-xs font-medium ${getStatusColor(reward.status)}`}>
                  {reward.status === "earned" ? "Reward Earned" : "Coins Used"}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Enhanced Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col gap-4 items-center justify-between border-t border-gray-200 pt-6">
          {/* Page Info */}
          <div className="text-gray-600 text-sm">
            Page {currentPage} of {totalPages} • {rewardHistory.length} transactions
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm">Previous</span>
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 rounded-xl font-medium transition-all duration-200 text-sm ${
                    currentPage === page
                      ? 'bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
            >
              <span className="text-sm">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Enhanced Empty State */}
      {rewardHistory.length === 0 && (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Coins className="w-10 h-10 text-gray-400" />
          </div>
          <h4 className="text-lg font-semibold text-gray-600 mb-2">
            No Rewards Yet
          </h4>
          <p className="text-gray-500 text-sm mb-4">
            Start earning coins and cash by shopping and participating in rewards!
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <Sparkles className="w-4 h-4" />
            <span>Shop to earn • Spin for rewards • Win cash prizes</span>
          </div>
        </div>
      )}

      {/* Enhanced Type Breakdown */}
      <div className="grid grid-cols-5 gap-3 mt-6 pt-6 border-t border-gray-200">
        <div className="text-center">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Coins className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-sm font-bold text-gray-900">
            {rewardHistory.filter(r => r.type === 'purchase').length}
          </div>
          <div className="text-gray-600 text-xs">Purchases</div>
        </div>
        <div className="text-center">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Sparkles className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-sm font-bold text-gray-900">
            {rewardHistory.filter(r => r.type === 'spin').length}
          </div>
          <div className="text-gray-600 text-xs">Spin Wins</div>
        </div>
        <div className="text-center">
          <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Trophy className="w-4 h-4 text-yellow-600" />
          </div>
          <div className="text-sm font-bold text-gray-900">
            {rewardHistory.filter(r => r.type === 'lucky-draw').length}
          </div>
          <div className="text-gray-600 text-xs">Lucky Draws</div>
        </div>
        <div className="text-center">
          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Gift className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-sm font-bold text-gray-900">
            {rewardHistory.filter(r => r.type === 'redemption').length}
          </div>
          <div className="text-gray-600 text-xs">Redemptions</div>
        </div>
        <div className="text-center">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Wallet className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-sm font-bold text-gray-900">
            {rewardHistory.filter(r => r.type === 'cash-reward').length}
          </div>
          <div className="text-gray-600 text-xs">Cash Rewards</div>
        </div>
      </div>
    </div>
  );
}