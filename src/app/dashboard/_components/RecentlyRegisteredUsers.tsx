"use client";

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { 
  Users, Calendar, TrendingUp, DollarSign, Coins, RefreshCw, 
  Search, ChevronDown, Shield, User
} from 'lucide-react';
import Image from 'next/image';

// --- Types ---
interface UserData {
  _id: string;
  phone: string;
  name: string;
  dob?: string;
  photo?: string;
  coins: number;
  coinValue: number;
  totalSpent: number;
  weeklySpent: number;
  monthlySpent: number;
  createdAt: string;
  email?: string;
  isActive?: boolean;
  lastActive?: string;
}

interface SummaryStats {
  totalUsers: number;
  totalCoins: number;
  totalSpent: number;
  avgCoinValue: number;
  avgWeeklySpent: number;
  avgMonthlySpent: number;
}

interface RecentlyRegisteredUsersProps {
  limit?: number;
  autoRefresh?: boolean;
  showFilters?: boolean;
}

type SortField = 'createdAt' | 'coins' | 'totalSpent' | 'monthlySpent' | 'name';
type SortDirection = 'asc' | 'desc';
type UserStatus = 'all' | 'active' | 'inactive';

// --- Skeleton Loader ---
const UserTableSkeleton = () => (
  <div className="space-y-3">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex items-center space-x-4 p-3 border border-gray-100 rounded-lg">
        <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
          <div className="h-3 bg-gray-100 rounded w-24 animate-pulse" />
        </div>
      </div>
    ))}
  </div>
);

// --- Avatar Component ---
const UserAvatar = ({ photo, name }: { photo?: string; name: string; size?: number }) => {
  if (photo) {
    return (
      <Image
        src={photo}
        alt={name}
        width="50"
        height="50"
        className="rounded-full border-2 border-primary/20 object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
          (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
        }}
      />
    );
  }
  
  return (
    <div className={`w-[3rem] h-[3rem] rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20`}>
      <User className={`w-[1rem] h-[1rem] text-primary/60`} />
    </div>
  );
};

// --- Enhanced Component ---
const RecentlyRegisteredUsers: React.FC<RecentlyRegisteredUsersProps> = ({ 
  limit = 10,
  autoRefresh = false,
  showFilters = true
}) => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [summary, setSummary] = useState<SummaryStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [statusFilter, setStatusFilter] = useState<UserStatus>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [showExport, setShowExport] = useState(false);

  // Memoized calculations
  const calculateAge = useCallback((dob?: string): number => {
    if (!dob) return 0;
    const birthDate = new Date(dob);
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }, []);

  const formatDate = useCallback((dateString: string, format: 'short' | 'long' = 'short'): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: format === 'short' ? 'short' : 'short',
        year: format === 'long' ? 'numeric' : undefined
      });
    } catch {
      return "";
    }
  }, []);

  const daysSinceRegistration = useCallback((dateString: string): number => {
    const now = new Date();
    const created = new Date(dateString);
    const diffTime = Math.abs(now.getTime() - created.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, []);

  const getUserStatus = useCallback((user: UserData): 'active' | 'inactive' => {
    if (user.lastActive) {
      const lastActive = new Date(user.lastActive);
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      return lastActive > thirtyDaysAgo ? 'active' : 'inactive';
    }
    return daysSinceRegistration(user.createdAt) < 30 ? 'active' : 'inactive';
  }, [daysSinceRegistration]);

  const getUserLevel = useCallback((coins: number): { label: string; color: string; bgColor: string } => {
    if (coins >= 5000) return { label: 'Diamond', color: 'text-blue-500', bgColor: 'bg-blue-100' };
    if (coins >= 2000) return { label: 'Gold', color: 'text-yellow-500', bgColor: 'bg-yellow-100' };
    if (coins >= 1000) return { label: 'Silver', color: 'text-gray-500', bgColor: 'bg-gray-100' };
    return { label: 'Bronze', color: 'text-amber-700', bgColor: 'bg-amber-100' };
  }, []);

  // Filter and sort users
  const filteredAndSortedUsers = useMemo(() => {
    const filtered = users.filter(user => {
      const matchesSearch = !searchTerm || 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || getUserStatus(user) === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    return [...filtered].sort((a, b) => {
      const aVal = sortField === 'createdAt' 
        ? new Date(a[sortField]).getTime() 
        : a[sortField];
      const bVal = sortField === 'createdAt' 
        ? new Date(b[sortField]).getTime() 
        : b[sortField];

      return sortDirection === 'desc' 
        ? (bVal as number) - (aVal as number)
        : (aVal as number) - (bVal as number);
    }).slice(0, limit);
  }, [users, searchTerm, statusFilter, sortField, sortDirection, limit, getUserStatus]);

  // Fetch users once on mount
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/users/recent?limit=${limit}`);
      if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
      
      const data = await res.json();
      setUsers(data.users);
      setSummary(data.summary);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchUsers();
  }, []); // Empty dependency array ensures it runs only once on mount

  const handleSort = (field: SortField) => {
    setSortField(field);
    setSortDirection(prev => prev === 'asc' && field === sortField ? 'desc' : 'asc');
  };

  const handleExport = () => {
    const csvContent = [
      ['Name', 'Phone', 'Email', 'Age', 'Coins', 'Total Spent', 'Joined Date', 'Status'],
      ...filteredAndSortedUsers.map(user => [
        user.name,
        user.phone,
        user.email || '',
        calculateAge(user.dob).toString(),
        user.coins.toString(),
        user.totalSpent.toString(),
        formatDate(user.createdAt, 'long'),
        getUserStatus(user)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExport(false);
  };

  if (loading) return (
    <div className="bg-white rounded-xl shadow-sm p-6 h-full border border-gray-200">
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-48 mb-6" />
        <UserTableSkeleton />
      </div>
    </div>
  );

  if (error) return (
    <div className="bg-white rounded-xl shadow-sm p-6 h-full border border-gray-200 flex flex-col items-center justify-center min-h-[400px]">
      <Shield className="w-12 h-12 text-red-400 mb-4" />
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Unable to Load Users</h3>
      <p className="text-gray-600 text-center mb-4">{error}</p>
      <button
        onClick={fetchUsers}
        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
      >
        Try Again
      </button>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 h-full border border-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Recently Registered Users</h2>
            <p className="text-sm text-gray-600">
              Showing {filteredAndSortedUsers.length} of {users.length} users
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={fetchUsers}
            disabled={refreshing}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowExport(!showExport)}
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span>Export</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            
            {showExport && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <button
                  onClick={handleExport}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  Export as CSV
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, phone, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as UserStatus)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive</option>
            </select>
            
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setSortField('createdAt');
                setSortDirection('desc');
              }}
              className="px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {filteredAndSortedUsers.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-600">No users found matching your criteria</p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="mt-2 text-primary hover:text-primary/80 transition-colors"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="md:hidden space-y-3">
            {filteredAndSortedUsers.map((user) => {
              const status = getUserStatus(user);
              const level = getUserLevel(user.coins);
              const age = calculateAge(user.dob);
              
              return (
                <div key={user._id} className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <UserAvatar photo={user.photo} name={user.name} size={48} />
                        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center ${status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}>
                          <div className="w-1.5 h-1.5 bg-white rounded-full" />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{user.name}</h3>
                          <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${level.color} ${level.bgColor}`}>
                            {level.label}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{user.phone}</p>
                        {user.email && <p className="text-xs text-gray-500 truncate max-w-[200px]">{user.email}</p>}
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mt-4">
                    <div className="text-center p-2 bg-amber-50 rounded-lg border border-amber-100">
                      <Coins className="w-4 h-4 text-amber-500 mx-auto mb-1" />
                      <p className="text-sm font-bold text-gray-900">{user.coins.toLocaleString()}</p>
                      <p className="text-xs text-gray-600">Coins</p>
                    </div>
                    <div className="text-center p-2 bg-blue-50 rounded-lg border border-blue-100">
                      <DollarSign className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                      <p className="text-sm font-bold text-gray-900">₹{user.totalSpent.toLocaleString()}</p>
                      <p className="text-xs text-gray-600">Spent</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-lg border border-gray-100">
                      <Calendar className="w-4 h-4 text-gray-500 mx-auto mb-1" />
                      <p className="text-sm font-bold text-gray-900">{age > 0 ? age : 'N/A'}</p>
                      <p className="text-xs text-gray-600">Age</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      ₹{user.monthlySpent.toLocaleString()}/mo
                    </span>
                    <span>Joined {formatDate(user.createdAt, 'short')}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full min-w-[1000px]">
              <thead className="bg-gray-50">
                <tr className="border-b border-gray-200">
                  {[
                    { field: 'name' as SortField, label: 'User' },
                    { field: 'phone' as SortField, label: 'Contact' },
                    { field: 'coins' as SortField, label: 'Coins' },
                    { field: 'totalSpent' as SortField, label: 'Total Spent' },
                    { field: 'monthlySpent' as SortField, label: 'Monthly' },
                    { field: 'createdAt' as SortField, label: 'Joined' },
                  ].map(({ field, label }) => (
                    <th 
                      key={field}
                      className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort(field)}
                    >
                      <div className="flex items-center gap-1">
                        {label}
                        {sortField === field && (
                          <ChevronDown className={`w-3 h-3 transition-transform ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                        )}
                      </div>
                    </th>
                  ))}
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredAndSortedUsers.map((user) => {
                  const status = getUserStatus(user);
                  const level = getUserLevel(user.coins);
                  const age = calculateAge(user.dob);
                  const daysRegistered = daysSinceRegistration(user.createdAt);
                  
                  return (
                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <UserAvatar photo={user.photo} name={user.name} size={40} />
                            <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`} />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{user.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-xs font-medium ${level.color}`}>
                                {level.label}
                              </span>
                              {age > 0 && <span className="text-xs text-gray-500">• {age} years</span>}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm text-gray-600">{user.phone}</p>
                          {user.email && <p className="text-xs text-gray-500 truncate max-w-[150px]">{user.email}</p>}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <Coins className="w-4 h-4 text-amber-500" />
                          <div>
                            <p className="font-semibold text-gray-900">{user.coins.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">₹{user.coinValue.toLocaleString()} value</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-semibold text-gray-900">₹{user.totalSpent.toLocaleString()}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <TrendingUp className="w-3 h-3 text-green-500" />
                            <span className="text-xs text-green-600">₹{user.weeklySpent.toLocaleString()} this week</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          {user.monthlySpent > 1000 ? (
                            <TrendingUp className="w-4 h-4 text-green-500" />
                          ) : user.monthlySpent > 0 ? (
                            <TrendingUp className="w-4 h-4 text-yellow-500" />
                          ) : (
                            <TrendingUp className="w-4 h-4 text-gray-400" />
                          )}
                          <span className="font-medium text-gray-900">₹{user.monthlySpent.toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm text-gray-900">{formatDate(user.createdAt, 'long')}</p>
                          <p className="text-xs text-gray-500 mt-1">{daysRegistered} day{daysRegistered !== 1 ? 's' : ''} ago</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {summary && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Summary</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 font-medium">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{summary.totalUsers.toLocaleString()}</p>
                </div>
                <Users className="w-8 h-8 text-primary/60" />
              </div>
            </div>
            
            <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 font-medium">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">₹{summary.totalSpent.toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-500" />
              </div>
            </div>
            
            <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl border border-amber-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 font-medium">Avg Coins</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{Math.round(summary.totalCoins / summary.totalUsers).toLocaleString()}</p>
                </div>
                <Coins className="w-8 h-8 text-amber-500" />
              </div>
            </div>
            
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 font-medium">Avg Monthly</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">₹{Math.round(summary.avgMonthlySpent).toLocaleString()}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-500" />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 flex items-center justify-between text-sm text-gray-600">
        <button
          onClick={fetchUsers}
          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </button>
        <div className="flex items-center gap-4">
          <span>Sort by: <strong className="text-gray-900">{sortField} ({sortDirection})</strong></span>
        </div>
      </div>
    </div>
  );
};

export default RecentlyRegisteredUsers;