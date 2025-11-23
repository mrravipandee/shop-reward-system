"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Trophy, Gift, Search, ChevronLeft, ChevronRight,
  TrendingUp, Star, Calendar, TrendingDown, Clock,
} from "lucide-react";

// --- Types & Mock Data ---
interface Winner {
  id: number;
  name: string;
  prize: string;
  rank: string;
  rankNumber: number;
  date: string; // YYYY-MM-DD
  amount: string; // e.g., "₹250"
}

const winnersData: Winner[] = [
  { id: 1, name: "Andro Kiwok", prize: "₹50 Cashback", rank: "1st", rankNumber: 1, date: "2024-01-15", amount: "₹250" }, // Updated Name
  { id: 2, name: "Sneha Patel", prize: "Free Gift", rank: "2nd", rankNumber: 2, date: "2024-01-15", amount: "₹180" },
  { id: 3, name: "Ajay Kumar", prize: "₹100 Bill Free", rank: "3rd", rankNumber: 3, date: "2024-01-15", amount: "₹500" },
  { id: 4, name: "Pooja More", prize: "₹30 Coins", rank: "4th", rankNumber: 4, date: "2024-01-15", amount: "₹120" },
  { id: 5, name: "Rajesh Singh", prize: "Choco Pack", rank: "5th", rankNumber: 5, date: "2024-01-15", amount: "₹350" },
  { id: 6, name: "Meera Desai", prize: "₹75 Cashback", rank: "6th", rankNumber: 6, date: "2024-01-15", amount: "₹280" },
  { id: 7, name: "Vikram Joshi", prize: "1kg Sugar", rank: "7th", rankNumber: 7, date: "2024-01-14", amount: "₹450" },
  { id: 8, name: "Anita Reddy", prize: "₹200 Voucher", rank: "8th", rankNumber: 8, date: "2024-01-14", amount: "₹600" },
  { id: 9, name: "Sanjay Verma", prize: "Tea Pack", rank: "9th", rankNumber: 9, date: "2024-01-14", amount: "₹190" },
  { id: 10, name: "Priya Nair", prize: "₹150 Coins", rank: "10th", rankNumber: 10, date: "2024-01-14", amount: "₹320" },
  { id: 11, name: "Amit Shah", prize: "Biscuit Pack", rank: "11th", rankNumber: 11, date: "2024-01-14", amount: "₹140" },
  { id: 12, name: "Neha Gupta", prize: "₹80 Cashback", rank: "12th", rankNumber: 12, date: "2024-01-14", amount: "₹260" }
];

const ITEMS_PER_PAGE = 8;

// --- Helper Functions ---
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

// --- PODIUM (Enhanced with Indigo/Yellow) ---
const Podium = ({ winners }: { winners: Winner[] }) => {
  const topWinners = useMemo(() => {
    return winners
      .filter(w => w.rankNumber <= 3)
      .sort((a, b) => a.rankNumber - b.rankNumber);
  }, [winners]);

  const first = topWinners.find(w => w.rankNumber === 1);
  const second = topWinners.find(w => w.rankNumber === 2);
  const third = topWinners.find(w => w.rankNumber === 3);

  if (!first) return null;

  // Order for display: 2nd, 1st, 3rd
  const displayOrder = [second, first, third].filter((w): w is Winner => w !== undefined);

  return (
    <div className="flex flex-row justify-center items-end gap-3 md:gap-8 mb-8 pt-8 px-2">
      {displayOrder.map((winner) => {
        const rank = winner.rankNumber;
        let heightClass = '';
        if (rank === 1) heightClass = "h-48 sm:h-72 md:h-80";
        else if (rank === 2) heightClass = "h-40 sm:h-56 md:h-64";
        else if (rank === 3) heightClass = "h-32 sm:h-48 md:h-56";
        
        return <PodiumCard key={winner.id} winner={winner} rank={rank} height={heightClass} />;
      })}
    </div>
  );
};

const PodiumCard = ({ winner, rank, height }: { winner: Winner, rank: number, height: string }) => {
  const isFirst = rank === 1;
  
  // Indigo (Primary) and Yellow (Accent)
  const pillarBg = isFirst ? `bg-indigo-700 shadow-xl shadow-indigo-200/50` : 'bg-gray-100 shadow-lg shadow-gray-200/50';
  const pillarText = isFirst ? `text-white` : 'text-slate-800';
  const avatarRing = isFirst ? `border-4 border-yellow-400 shadow-lg shadow-yellow-300/50` : 'border-2 border-slate-300';
  const rankBadgeBg = isFirst ? `bg-yellow-400 text-indigo-900` : 'bg-white text-slate-700';

  return (
    <div className={`relative flex flex-col items-center w-24 sm:w-36 md:w-44 ${height} transition-all duration-500 group`}>
      
      {/* Avatar Section */}
      <div className={`relative z-20 mb-3 transition-transform duration-300 ${isFirst ? 'scale-110 -translate-y-2' : 'group-hover:-translate-y-1'}`}>
        <div className={`
          flex items-center justify-center rounded-full bg-white 
          ${isFirst ? 'w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24' : 'w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20'} 
          ${avatarRing}
        `}>
          <span className={`${isFirst ? 'text-2xl sm:text-3xl font-extrabold text-indigo-600' : 'text-xl sm:text-2xl font-bold text-slate-600'}`}>
            {winner.name.charAt(0)}
          </span>
        </div>
        
        {/* Rank Badge */}
        <div className={`
          absolute -bottom-1 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] sm:text-xs font-extrabold tracking-wider border-2 border-white
          ${rankBadgeBg}
        `}>
          <Trophy className="w-3 h-3 inline mr-1" />
          #{rank}
        </div>
      </div>

      {/* Pillar */}
      <div className={`
        w-full flex-1 rounded-t-xl flex flex-col items-center justify-start pt-6 sm:pt-8 pb-3 sm:pb-4 px-2
        ${pillarBg} ${pillarText}
        transition-all duration-300
      `}>
        <p className={`font-extrabold text-center leading-tight ${isFirst ? 'text-lg sm:text-xl' : 'text-sm sm:text-base'}`}>
          {winner.name.split(' ')[0]}
        </p>
        <p className={`text-[10px] sm:text-xs mt-1 font-medium ${isFirst ? `text-indigo-200` : 'text-slate-500'}`}>
          {winner.amount} Spent
        </p>
        
        <div className={`
          mt-auto w-full text-center py-1.5 rounded-b-lg text-[10px] sm:text-xs font-semibold flex items-center justify-center gap-1.5
          ${isFirst ? 'bg-indigo-800/80 text-yellow-300' : 'bg-gray-200 text-slate-700'}
        `}>
          <Gift className="w-3.5 h-3.5" />
          {winner.prize}
        </div>
      </div>
    </div>
  );
};

// --- Stat Card ---
interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}

const StatCard = ({ icon: Icon, label, value }: StatCardProps) => (
  <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-100 shadow-md flex items-center gap-4 transition-all duration-300 hover:shadow-lg hover:border-indigo-200">
    <div className={`p-3 rounded-xl bg-indigo-100 text-indigo-600`}>
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{label}</p>
      <h3 className="text-xl font-extrabold text-slate-900">{value}</h3>
    </div>
  </div>
);

// --- Main Component ---

export default function WinnersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("all");
  const [filteredWinners, setFilteredWinners] = useState(winnersData);

  const uniqueDates = useMemo(() => ["all", ...new Set(winnersData.map(winner => winner.date))].sort().reverse(), []);

  // Filter Logic
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
    setFilteredWinners(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedDate]);

  const totalPages = Math.ceil(filteredWinners.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentDisplayWinners = filteredWinners.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const showPodium = useMemo(() => currentPage === 1 && !searchTerm && selectedDate === 'all', 
    [currentPage, searchTerm, selectedDate]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      window.scrollTo({ top: mainContent.offsetTop - 30, behavior: 'smooth' });
    }
  }, []);


  // Winner List Card Component
  const WinnerCard = ({ winner }: { winner: Winner }) => (
    <div 
      className="group bg-white rounded-xl border border-slate-100 p-4 sm:p-5 shadow-sm transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:border-indigo-300"
    >
      <div className="flex justify-between items-center mb-3">
        {/* Avatar */}
        <div className={`w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xl border-2 border-indigo-200`}>
          {winner.name.charAt(0)}
        </div>
        
        {/* Rank Badge */}
        <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${
            winner.rankNumber <= 3 
            ? 'bg-yellow-400 text-indigo-900 border-yellow-500 shadow-md' 
            : 'bg-slate-50 text-slate-600 border-slate-100'
          }`}>
          #{winner.rankNumber}
        </span>
      </div>
      
      <h3 className="font-extrabold text-lg text-slate-800 mb-1 leading-snug truncate">
        {winner.name}
      </h3>
      <p className="text-sm font-medium text-slate-500 mb-4 flex items-center gap-1">
        <Clock className="w-3.5 h-3.5" /> {formatDate(winner.date)}
      </p>
      
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className={`flex items-center gap-1.5 text-base font-bold text-indigo-700`}>
           <Gift className="w-4 h-4" />
           {winner.prize}
        </div>
      </div>
    </div>
  );


  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-900 selection:bg-indigo-200/70">
      
      {/* Header with Pattern */}
      <div className="pt-24 pb-16 sm:pt-32 sm:pb-24 bg-white border-b border-indigo-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#f3f4f6_1px,transparent_1px)] [background-size:16px_16px] opacity-70" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center items-center text-center relative z-10">
          <div className={`inline-flex items-center gap-2 bg-yellow-400 px-3 py-1 rounded-full mb-4 shadow-lg animate-in fade-in duration-500`}>
            <Star className={`w-3 h-3 text-indigo-900`} />
            <span className={`text-xs font-bold text-indigo-900 uppercase tracking-wider`}>WINNER PROOF</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight mb-4 animate-in fade-in slide-in-from-top-4 duration-700">
            Ravi Kirana <span className="text-indigo-600">Hall of Fame</span>
          </h1>
          <p className="text-slate-500 max-w-xl text-lg sm:text-xl animate-in fade-in duration-900">
            Showcasing the verified champions who earned rewards in our daily competition.
          </p>
        </div>
      </div>

      <div id="main-content" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-20 relative z-20 pb-20">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <StatCard icon={Trophy} label="Total Winners" value="50+" />
          <StatCard icon={Gift} label="Prize Value" value="₹12k" />
          <StatCard icon={TrendingUp} label="Total Entries" value="1.2k" />
          <StatCard icon={Star} label="Top Reward" value="TV Set" />
        </div>

        {/* Podium Section */}
        {showPodium && filteredWinners.length >= 3 && (
          <div className="mb-16 md:mb-20 bg-white rounded-2xl p-4 md:p-8 border border-indigo-100 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-900">
             <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-indigo-700">🏆 Top 3 Winners 🏆</h2>
                <p className="text-slate-500 text-sm mt-1">Based on highest purchase amount on the latest day.</p>
                <div className={`w-20 h-1 bg-yellow-400 mx-auto mt-3 rounded-full`} />
             </div>
            <Podium winners={filteredWinners} />
          </div>
        )}

        {/* Controls (Improved Mobile Layout) */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-8 shadow-lg flex flex-col md:flex-row justify-between items-center gap-4">
           
           {/* Search Input */}
           <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text"
                placeholder="Search by name or prize..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 text-sm font-medium outline-none placeholder:text-slate-400 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-colors"
              />
           </div>
           
           {/* Date Filter Dropdown */}
           <div className="flex w-full md:w-auto items-center">
              <div className="relative w-full">
                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full md:w-48 pl-3 pr-10 py-2.5 bg-slate-50 text-sm font-medium text-slate-600 outline-none cursor-pointer appearance-none rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                >
                  <option value="all">All Dates ({uniqueDates.length - 1})</option>
                  {uniqueDates.filter(d => d !== 'all').map(date => (
                    <option key={date} value={date}>
                      {formatDate(date)}
                    </option>
                  ))}
                </select>
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
              </div>
           </div>
        </div>

        {/* List Grid (Mobile: 2 cols, Tablet: 3 cols, Desktop: 4 cols) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 animate-in fade-in duration-500">
          {currentDisplayWinners.length > 0 ? (
            currentDisplayWinners.map((winner) => (
              <WinnerCard key={winner.id} winner={winner} />
            ))
          ) : (
             <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-slate-200 shadow-inner text-slate-500">
                <TrendingDown className="w-10 h-10 mx-auto mb-3 text-red-400" />
                <p className="font-bold text-lg">No winners found!</p>
                <p className="text-sm">Try broadening your search or selecting &quot;All Dates&quot;.</p>
             </div>
          )}
        </div>

        {/* Pagination (Mobile Friendly) */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center gap-2 sm:gap-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-indigo-600 hover:text-white disabled:opacity-50 transition-all bg-white shadow-md font-semibold`}
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            {/* Page number display */}
            <span className="text-sm font-semibold text-slate-500 px-4 py-2 bg-white rounded-xl shadow-inner border border-slate-100">
              Page <span className="text-indigo-700 font-extrabold">{currentPage}</span> of {totalPages}
            </span>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-indigo-600 hover:text-white disabled:opacity-50 transition-all bg-white shadow-md font-semibold`}
              aria-label="Next Page"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}