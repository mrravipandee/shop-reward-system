"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Trophy, Crown, Gift, IndianRupee, Sparkles, Star, Calendar, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";

// Mock data for winners
const winnersData = [
  {
    id: 1,
    name: "Ravi Sharma",
    prize: "₹50 Cashback",
    image: "/winner/winner-1.png",
    rank: "1st",
    icon: <Crown className="w-4 h-4" />,
    color: "bg-yellow-100 border-yellow-200 text-yellow-700",
    time: "10:30 AM",
    date: "2024-01-15",
    phone: "+91 98765 43210",
    amount: "₹250"
  },
  {
    id: 2,
    name: "Sneha Patel",
    prize: "Free Soap Gift",
    image: "/winner/winner-2.png",
    rank: "2nd",
    icon: <Trophy className="w-4 h-4" />,
    color: "bg-gray-100 border-gray-200 text-gray-700",
    time: "11:15 AM",
    date: "2024-01-15",
    phone: "+91 98765 43211",
    amount: "₹180"
  },
  {
    id: 3,
    name: "Ajay Kumar",
    prize: "₹100 Bill Free",
    image: "/winner/winner-3.png",
    rank: "3rd",
    icon: <Gift className="w-4 h-4" />,
    color: "bg-orange-100 border-orange-200 text-orange-700",
    time: "2:45 PM",
    date: "2024-01-15",
    phone: "+91 98765 43212",
    amount: "₹500"
  },
  {
    id: 4,
    name: "Pooja More",
    prize: "₹30 Coins Reward",
    image: "/winner/winner-4.png",
    rank: "4th",
    icon: <IndianRupee className="w-4 h-4" />,
    color: "bg-green-100 border-green-200 text-green-700",
    time: "4:20 PM",
    date: "2024-01-15",
    phone: "+91 98765 43213",
    amount: "₹120"
  },
  {
    id: 5,
    name: "Rajesh Singh",
    prize: "Free Chocolate Pack",
    image: "/winner/winner-5.png",
    rank: "5th",
    icon: <Gift className="w-4 h-4" />,
    color: "bg-blue-100 border-blue-200 text-blue-700",
    time: "5:30 PM",
    date: "2024-01-15",
    phone: "+91 98765 43214",
    amount: "₹350"
  },
  {
    id: 6,
    name: "Meera Desai",
    prize: "₹75 Cashback",
    image: "/winner/winner-6.png",
    rank: "6th",
    icon: <IndianRupee className="w-4 h-4" />,
    color: "bg-purple-100 border-purple-200 text-purple-700",
    time: "6:45 PM",
    date: "2024-01-15",
    phone: "+91 98765 43215",
    amount: "₹280"
  },
  {
    id: 7,
    name: "Vikram Joshi",
    prize: "1kg Sugar Free",
    image: "/winner/winner-7.png",
    rank: "7th",
    icon: <Gift className="w-4 h-4" />,
    color: "bg-red-100 border-red-200 text-red-700",
    time: "7:15 PM",
    date: "2024-01-14",
    phone: "+91 98765 43216",
    amount: "₹450"
  },
  {
    id: 8,
    name: "Anita Reddy",
    prize: "₹200 Shopping Voucher",
    image: "/winner/winner-8.png",
    rank: "8th",
    icon: <Trophy className="w-4 h-4" />,
    color: "bg-pink-100 border-pink-200 text-pink-700",
    time: "8:30 PM",
    date: "2024-01-14",
    phone: "+91 98765 43217",
    amount: "₹600"
  },
  {
    id: 9,
    name: "Sanjay Verma",
    prize: "Free Tea Pack",
    image: "/winner/winner-9.png",
    rank: "9th",
    icon: <Gift className="w-4 h-4" />,
    color: "bg-indigo-100 border-indigo-200 text-indigo-700",
    time: "9:00 AM",
    date: "2024-01-14",
    phone: "+91 98765 43218",
    amount: "₹190"
  },
  {
    id: 10,
    name: "Priya Nair",
    prize: "₹150 Coins Bonus",
    image: "/winner/winner-10.png",
    rank: "10th",
    icon: <IndianRupee className="w-4 h-4" />,
    color: "bg-teal-100 border-teal-200 text-teal-700",
    time: "10:20 AM",
    date: "2024-01-14",
    phone: "+91 98765 43219",
    amount: "₹320"
  },
  {
    id: 11,
    name: "Amit Shah",
    prize: "Free Biscuit Pack",
    image: "/winner/winner-11.png",
    rank: "11th",
    icon: <Gift className="w-4 h-4" />,
    color: "bg-amber-100 border-amber-200 text-amber-700",
    time: "11:45 AM",
    date: "2024-01-14",
    phone: "+91 98765 43220",
    amount: "₹140"
  },
  {
    id: 12,
    name: "Neha Gupta",
    prize: "₹80 Cashback",
    image: "/winner/winner-12.png",
    rank: "12th",
    icon: <IndianRupee className="w-4 h-4" />,
    color: "bg-cyan-100 border-cyan-200 text-cyan-700",
    time: "1:30 PM",
    date: "2024-01-14",
    phone: "+91 98765 43221",
    amount: "₹260"
  }
];

const ITEMS_PER_PAGE = 8;

export default function WinnersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("all");
  const [winners, setWinners] = useState(winnersData);

  // Get unique dates for filter
  const uniqueDates = ["all", ...new Set(winnersData.map(winner => winner.date))];

  // Filter winners based on search and date
  useEffect(() => {
    let filtered = winnersData;
    
    if (searchTerm) {
      filtered = filtered.filter(winner =>
        winner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        winner.prize.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedDate !== "all") {
      filtered = filtered.filter(winner => winner.date === selectedDate);
    }
    
    setWinners(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, selectedDate]);

  // Calculate pagination
  const totalPages = Math.ceil(winners.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentWinners = winners.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-secondary/5 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12 mt-14">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary font-medium text-sm sm:text-base mb-4">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Daily Winners</span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-secondary mb-4 sm:mb-6 leading-tight">
            Our <span className="text-primary">Lucky Winners</span> 🎉
          </h1>
          
          <p className="text-secondary/80 text-base sm:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
            Celebrating our amazing customers who won exciting rewards. Your next purchase could make you a winner!
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {[
            { number: "50+", label: "Daily Winners", icon: Trophy },
            { number: "₹1000+", label: "Rewards Given", icon: IndianRupee },
            { number: "500+", label: "Happy Customers", icon: Star },
            { number: "24/7", label: "Rewards Active", icon: Sparkles }
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center shadow-lg border border-secondary/10">
              <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary mx-auto mb-2 sm:mb-3" />
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary mb-1">{stat.number}</div>
              <div className="text-secondary/70 text-xs sm:text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-secondary/10 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            {/* Search Input */}
            <div className="flex-1 w-full sm:max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary/40 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search winners by name or prize..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-secondary/20 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all duration-200"
                />
              </div>
            </div>

            {/* Date Filter */}
            <div className="w-full sm:w-auto">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary/40 w-5 h-5" />
                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full sm:w-48 pl-10 pr-4 py-3 border border-secondary/20 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none appearance-none bg-white transition-all duration-200"
                >
                  {uniqueDates.map(date => (
                    <option key={date} value={date}>
                      {date === "all" ? "All Dates" : formatDate(date)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div className="text-secondary/60 text-sm sm:text-base">
              {winners.length} {winners.length === 1 ? 'winner' : 'winners'} found
            </div>
          </div>
        </div>

        {/* Winners Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {currentWinners.map((winner) => (
            <div
              key={winner.id}
              className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-secondary/10 group transform hover:-translate-y-1"
            >
              {/* Rank Badge */}
              <div className={`absolute -top-2 -right-2 ${winner.color} border-2 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center font-bold text-xs sm:text-sm z-10`}>
                <div className="flex items-center gap-1">
                  {winner.icon}
                  <span className="hidden xs:inline">{winner.rank}</span>
                </div>
              </div>

              {/* Winner Image */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 mx-auto mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-sm"></div>
                <div className="relative w-full h-full bg-secondary/10 rounded-full flex items-center justify-center">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </div>

              {/* Winner Details */}
              <div className="text-center space-y-2 sm:space-y-3">
                <h3 className="font-bold text-secondary text-lg sm:text-xl group-hover:text-primary transition-colors duration-300">
                  {winner.name}
                </h3>
                
                <div className="flex items-center justify-center gap-2 text-primary font-semibold text-base sm:text-lg">
                  <IndianRupee className="w-4 h-4" />
                  <span>{winner.prize}</span>
                </div>

                <div className="space-y-1 text-xs sm:text-sm text-secondary/60">
                  <div className="flex items-center justify-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(winner.date)}</span>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <span>🛒 Purchase: {winner.amount}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="inline-flex items-center gap-1 bg-primary/5 text-primary rounded-full py-1 px-3 text-xs font-medium">
                    <Star className="w-3 h-3" />
                    Lucky Customer
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {winners.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg border border-secondary/10">
            <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-secondary/40" />
            </div>
            <h3 className="text-lg font-semibold text-secondary/60 mb-2">
              No winners found
            </h3>
            <p className="text-secondary/40">
              Try adjusting your search criteria
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-secondary/10">
            {/* Page Info */}
            <div className="text-secondary/60 text-sm sm:text-base">
              Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, winners.length)} of {winners.length} winners
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-2">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border border-secondary/20 text-secondary hover:bg-secondary/5 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Previous</span>
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg font-medium transition-all duration-200 ${
                      currentPage === page
                        ? 'bg-primary text-white shadow-lg'
                        : 'text-secondary hover:bg-secondary/5 border border-secondary/20'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border border-secondary/20 text-secondary hover:bg-secondary/5 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="text-center mt-8 sm:mt-12">
          <p className="text-secondary/80 text-lg sm:text-xl mb-6 font-medium">
            Your next purchase could make you a winner! 🎊
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <a
              href="#offers"
              className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
            >
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              Shop & Win Rewards
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 border border-primary text-primary px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:bg-primary hover:text-white transition-all duration-300 text-sm sm:text-base"
            >
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
              Visit Store
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}