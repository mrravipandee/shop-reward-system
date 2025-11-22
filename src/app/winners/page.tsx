"use client";
import { useState, useEffect } from "react";
import { 
  Trophy, Crown, Gift, Search, Filter, ChevronLeft, ChevronRight, 
  Medal, TrendingUp, Star, Sparkles, Calendar
} from "lucide-react";

// --- Types & Mock Data ---
interface Winner {
  id: number;
  name: string;
  prize: string;
  rank: string;
  rankNumber: number;
  date: string;
  amount: string;
}

const winnersData: Winner[] = [
  { id: 1, name: "Ravi Sharma", prize: "₹50 Cashback", rank: "1st", rankNumber: 1, date: "2024-01-15", amount: "₹250" },
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

// --- Helper Components ---

const Podium = ({ winners }: { winners: Winner[] }) => {
  const first = winners.find(w => w.rankNumber === 1);
  const second = winners.find(w => w.rankNumber === 2);
  const third = winners.find(w => w.rankNumber === 3);

  if (!first) return null;

  return (
    <div className="flex flex-col-reverse sm:flex-row justify-center items-end gap-4 sm:gap-6 mb-16 pt-8 px-4">
      {/* 2nd Place */}
      {second && <PodiumCard winner={second} rank={2} height="h-48 sm:h-64" />}
      
      {/* 1st Place */}
      <PodiumCard winner={first} rank={1} height="h-60 sm:h-80" />
      
      {/* 3rd Place */}
      {third && <PodiumCard winner={third} rank={3} height="h-40 sm:h-56" />}
    </div>
  );
};

const PodiumCard = ({ winner, rank, height }: { winner: Winner, rank: number, height: string }) => {
  const isFirst = rank === 1;
  
  return (
    <div className={`relative flex flex-col items-center w-full sm:w-48 ${height} transition-all duration-500 group`}>
      
      {/* Avatar Section */}
      <div className={`relative z-20 mb-4 transition-transform duration-300 ${isFirst ? 'scale-110 -translate-y-2' : 'group-hover:-translate-y-1'}`}>
        <div className={`
          flex items-center justify-center rounded-full border-4 shadow-xl
          ${isFirst 
            ? 'w-24 h-24 bg-white border-purple-600 text-purple-700' 
            : 'w-20 h-20 bg-white border-slate-200 text-slate-500'}
        `}>
          <span className="text-2xl font-bold">{winner.name.charAt(0)}</span>
        </div>
        
        {/* Rank Badge */}
        <div className={`
          absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-bold tracking-wider shadow-sm border
          ${isFirst 
            ? 'bg-purple-600 text-white border-purple-600' 
            : 'bg-white text-slate-600 border-slate-200'}
        `}>
          #{rank}
        </div>
      </div>

      {/* Pillar */}
      <div className={`
        w-full flex-1 rounded-t-lg flex flex-col items-center justify-start pt-8 pb-4 px-2 shadow-sm border-x border-t
        ${isFirst 
          ? 'bg-purple-600 border-purple-600 text-white' 
          : 'bg-white border-slate-200 text-slate-800'}
      `}>
        <p className={`font-bold text-center leading-tight ${isFirst ? 'text-lg' : 'text-sm'}`}>
          {winner.name}
        </p>
        <p className={`text-xs mt-1 font-medium ${isFirst ? 'text-purple-200' : 'text-slate-400'}`}>
          {winner.amount} Spent
        </p>
        
        <div className={`
          mt-auto px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5
          ${isFirst ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}
        `}>
          <Gift className="w-3 h-3" />
          {winner.prize}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value }: any) => (
  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
    <div className="p-3 rounded-lg bg-purple-50 text-purple-600">
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide">{label}</p>
      <h3 className="text-xl font-bold text-slate-900">{value}</h3>
    </div>
  </div>
);

// --- Main Component ---

export default function WinnersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("all");
  const [filteredWinners, setFilteredWinners] = useState(winnersData);

  const uniqueDates = ["all", ...new Set(winnersData.map(winner => winner.date))];

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
  const showPodium = currentPage === 1 && !searchTerm && selectedDate === 'all';

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: showPodium ? 400 : 0, behavior: 'smooth' });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-purple-200">
      
      {/* Minimalist Header Pattern */}
      <div className="h-64 bg-white border-b border-slate-200 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-50" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center items-center text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-100 px-3 py-1 rounded-full mb-4">
            <Sparkles className="w-3 h-3 text-purple-600" />
            <span className="text-xs font-semibold text-purple-700 uppercase tracking-wide">Daily Rewards</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight mb-4">
            Hall of Fame
          </h1>
          <p className="text-slate-500 max-w-xl text-lg">
            Recognizing our most valued customers.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20 pb-20">
        
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <StatCard icon={Trophy} label="Winners" value="50+" />
          <StatCard icon={Gift} label="Prizes" value="₹12k" />
          <StatCard icon={TrendingUp} label="Entries" value="1.2k" />
          <StatCard icon={Star} label="Top Reward" value="TV Set" />
        </div>

        {/* Podium */}
        {showPodium && filteredWinners.length >= 3 && (
          <div className="mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
             <div className="text-center mb-8">
                <h2 className="text-xl font-semibold text-slate-800">Top Performers</h2>
                <div className="w-12 h-1 bg-purple-600 mx-auto mt-2 rounded-full" />
             </div>
            <Podium winners={filteredWinners} />
          </div>
        )}

        {/* Controls */}
        <div className="bg-white rounded-lg border border-slate-200 p-1.5 mb-6 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-2">
           <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text"
                placeholder="Filter by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
           </div>
           
           <div className="flex w-full sm:w-auto items-center border-t sm:border-t-0 sm:border-l border-slate-100 pt-2 sm:pt-0 sm:pl-2">
              <div className="relative w-full">
                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full sm:w-32 pl-3 pr-8 py-2 bg-transparent text-sm font-medium text-slate-600 outline-none cursor-pointer appearance-none"
                >
                  {uniqueDates.map(date => (
                    <option key={date} value={date}>
                      {date === "all" ? "All Dates" : formatDate(date)}
                    </option>
                  ))}
                </select>
                <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-3 h-3 pointer-events-none" />
              </div>
           </div>
        </div>

        {/* List Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {currentDisplayWinners.map((winner) => (
            <div 
              key={winner.id}
              className="group bg-white rounded-xl border border-slate-200 p-5 hover:border-purple-600/50 hover:shadow-md transition-all duration-200"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold border border-slate-200 group-hover:bg-purple-50 group-hover:text-purple-600 transition-colors">
                  {winner.name.charAt(0)}
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded border ${
                    winner.rankNumber <= 3 
                    ? 'bg-purple-50 text-purple-700 border-purple-100' 
                    : 'bg-slate-50 text-slate-600 border-slate-100'
                  }`}>
                  #{winner.rankNumber}
                </span>
              </div>
              
              <h3 className="font-bold text-slate-800 mb-1">{winner.name}</h3>
              <p className="text-xs text-slate-500 mb-4 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {formatDate(winner.date)}
              </p>
              
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-sm font-semibold text-purple-700">
                   <Gift className="w-3.5 h-3.5" />
                   {winner.prize}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center gap-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-md border border-slate-200 text-slate-500 hover:bg-white hover:text-purple-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors bg-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm font-medium text-slate-500">
              Page <span className="text-slate-900">{currentPage}</span> of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-md border border-slate-200 text-slate-500 hover:bg-white hover:text-purple-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors bg-white"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}