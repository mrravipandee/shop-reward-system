"use client";

import React, { useEffect, useState, useCallback, ChangeEvent, FormEvent } from 'react';
import { 
  Users, TrendingUp, DollarSign, Coins, RefreshCw, 
  Search, MessageCircle, Edit, Lock, Camera, X, 
  ChevronLeft, ChevronRight, Save, User, Send
} from 'lucide-react';
import Image from 'next/image';

// --- Types & Interfaces ---

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
  lastActive?: string;
}

interface UserUpdatePayload {
  _id: string;
  name: string;
  dob: string;
  password?: string;
  photo?: File | null;
  photoPreview?: string;
}

interface SummaryStats {
  totalUsers: number;
  totalCoins: number;
  totalSpent: number;
  avgCoinValue: number;
  avgMonthlySpent: number;
}

interface PaginationState {
  page: number;
  limit: number;
  totalPages: number;
  totalDocs: number;
}

type SortField = 'createdAt' | 'coins' | 'totalSpent' | 'monthlySpent' | 'name';
type SortDirection = 'asc' | 'desc';
type UserStatus = 'all' | 'active' | 'inactive';

// --- Avatar Component ---
const UserAvatar = ({ photo, name, size = 40 }: { photo?: string; name: string; size?: number }) => {
  const [error, setError] = useState(false);

  if (photo && !error) {
    return (
      <Image
        src={photo}
        alt={name}
        width={size}
        height={size}
        className="rounded-full border-2 border-primary/20 object-cover"
        style={{ width: size, height: size }}
        onError={() => setError(true)}
      />
    );
  }
  
  return (
    <div 
      style={{ width: size, height: size }}
      className="rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20 text-primary/60"
    >
      <User size={size * 0.5} />
    </div>
  );
};

// --- Edit User Modal ---
interface EditUserModalProps {
  user: UserData | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedData: UserUpdatePayload) => Promise<void>; 
}

const EditUserModal: React.FC<EditUserModalProps> = ({ user, isOpen, onClose, onSave }) => {
  // Initialize state only once
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    password: '',
    photo: null as File | null,
    photoPreview: ''
  });
  const [loading, setLoading] = useState(false);

  // FIX: Cascading Render Error Fixed here
  // We depend on user?._id (primitive string) instead of user object to prevent loop
  // We also check isOpen to ensure we only sync when opening
  useEffect(() => {
    if (isOpen && user) {
      setFormData({
        name: user.name || '',
        dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : '',
        password: '', // Always empty for security
        photo: null,
        photoPreview: user.photo || ''
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id, isOpen]); // Only re-run if ID changes or modal opens

  if (!isOpen || !user) return null;

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({
        ...prev,
        photo: file,
        photoPreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleSendPasswordWhatsApp = () => {
    if (!formData.password) {
      alert("Please type a new password first.");
      return;
    }

    let phone = user.phone.replace(/\s+/g, '').replace(/-/g, '');
    if (!phone.startsWith('91') && !phone.startsWith('+')) phone = '91' + phone;

    const message = `Hello ${formData.name},\n\nYour password for Ravi Kirana has been updated.\n\nNew Password: *${formData.password}*\n\nPlease login and change it if needed.`;
    
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSave({ ...formData, _id: user._id });
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
          <h3 className="font-semibold text-gray-800">Edit Customer</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex flex-col items-center mb-6">
            <div className="relative group cursor-pointer">
              <UserAvatar photo={formData.photoPreview} name={formData.name} size={80} />
              <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="text-white w-6 h-6" />
                <input type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
              </label>
            </div>
            <span className="text-xs text-gray-500 mt-2">Click to change photo</span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <input
              type="date"
              value={formData.dob}
              onChange={(e) => setFormData({...formData, dob: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reset Password
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3 w-4 h-4 text-gray-400" />
              <input
                type="text" // Changed to text so admin can see what they are sending
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="Type new password"
                className="w-full pl-9 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
              {/* WhatsApp Button inside input */}
              <button
                type="button"
                onClick={handleSendPasswordWhatsApp}
                disabled={!formData.password}
                className="absolute right-2 p-1.5 bg-green-50 text-green-600 rounded-md hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Send Password via WhatsApp"
              >
                <Send size={16} />
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Type a new password and click <Send className="inline w-3 h-3"/> to send it to user.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors disabled:opacity-70"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Main Page Component ---
const CustomersPage = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [summary, setSummary] = useState<SummaryStats | null>(null);
  
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalDocs: 0
  });
  const [statusFilter, setStatusFilter] = useState<UserStatus>('all');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  // --- Helpers ---
  const calculateAge = useCallback((dob?: string): number => {
    if (!dob) return 0;
    try {
      const birthDate = new Date(dob);
      const ageDifMs = Date.now() - birthDate.getTime();
      const ageDate = new Date(ageDifMs);
      return Math.abs(ageDate.getUTCFullYear() - 1970);
    } catch { return 0; }
  }, []);

  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric'
      });
    } catch { return ""; }
  };

  const daysSinceRegistration = (dateString: string): number => {
    const now = new Date();
    const created = new Date(dateString);
    const diffTime = Math.abs(now.getTime() - created.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // --- Data Fetching ---
  const fetchUsers = useCallback(async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    else setRefreshing(true);

    try {
      const res = await fetch(`/api/admin/users/all`);
      if (!res.ok) throw new Error(`Failed to fetch`);
      const data = await res.json();
      
      const allUsers = data.users as UserData[]; 

      // --- Filter Logic ---
      let filtered = allUsers.filter((u) => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.phone.includes(searchTerm)
      );
      
      if (statusFilter !== 'all') {
        filtered = filtered.filter((u) => {
           const isActive = daysSinceRegistration(u.createdAt) < 30;
           return statusFilter === 'active' ? isActive : !isActive;
        });
      }

      // --- Sort Logic ---
      filtered.sort((a, b) => {
        let valA: number | string = '';
        let valB: number | string = '';

        if (sortField === 'createdAt') {
          valA = new Date(a.createdAt).getTime();
          valB = new Date(b.createdAt).getTime();
        } else if (sortField === 'name') {
          valA = a.name.toLowerCase();
          valB = b.name.toLowerCase();
        } else {
          valA = a[sortField];
          valB = b[sortField];
        }

        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });

      // --- Pagination Logic ---
      const start = (pagination.page - 1) * pagination.limit;
      const paginatedUsers = filtered.slice(start, start + pagination.limit);

      setUsers(paginatedUsers);
      setSummary(data.summary);
      setPagination(prev => ({
        ...prev,
        totalDocs: filtered.length,
        totalPages: Math.ceil(filtered.length / prev.limit) || 1
      }));

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [pagination.page, pagination.limit, searchTerm, statusFilter, sortField, sortDirection]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // --- Handlers ---
  const handleWhatsApp = (user: UserData) => {
    let phone = user.phone.replace(/\s+/g, '').replace(/-/g, '');
    if (!phone.startsWith('91') && !phone.startsWith('+')) phone = '91' + phone;
    
    const message = `Welcome to Ravi Kirana! 🛒\n\nHello ${user.name}, your current Coin Score is *${user.coinValue}* 🪙.\n\nDo more shopping to earn more rewards! Get *FREE Delivery* on orders above ₹200. Order now via our app or WhatsApp.`;
    
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleEditClick = (user: UserData) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleSaveUser = async (updatedData: UserUpdatePayload) => {
    try {
      console.log("Saving user:", updatedData);
      
      // Update local state optimistically
      setUsers(prev => prev.map(u => 
        u._id === updatedData._id 
          ? { 
              ...u, 
              name: updatedData.name, 
              dob: updatedData.dob, 
              photo: updatedData.photoPreview || u.photo 
            } 
          : u
      ));
      
      alert("Customer updated successfully!");
    } catch (error) {
      alert("Failed to update customer");
      console.error("Update Error:", error);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  // --- Render Loading State ---
  if (loading && !refreshing && users.length === 0) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 h-full flex justify-center items-center">
        <div className="flex flex-col items-center gap-2">
          <RefreshCw className="w-8 h-8 animate-spin text-primary" />
          <p className="text-gray-500">Loading customers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 min-h-screen border border-gray-200 flex flex-col">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
          <p className="text-gray-500 mt-1">Manage all your registered customers and their rewards.</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
           <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPagination(p => ({...p, page: 1})); }}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all w-64"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as UserStatus)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <button
            onClick={() => fetchUsers(true)}
            disabled={refreshing}
            className="p-2 text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
          >
            <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex justify-between items-center">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{summary.totalUsers.toLocaleString()}</p>
            </div>
            <Users className="text-primary opacity-80" />
          </div>
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 flex justify-between items-center">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">Total Coins</p>
              <p className="text-2xl font-bold text-gray-900">{summary.totalCoins.toLocaleString()}</p>
            </div>
            <Coins className="text-amber-500 opacity-80" />
          </div>
          <div className="p-4 rounded-xl bg-green-50 border border-green-100 flex justify-between items-center">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹{summary.totalSpent.toLocaleString()}</p>
            </div>
            <DollarSign className="text-green-500 opacity-80" />
          </div>
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 flex justify-between items-center">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">Avg. Monthly</p>
              <p className="text-2xl font-bold text-gray-900">₹{Math.round(summary.avgMonthlySpent).toLocaleString()}</p>
            </div>
            <TrendingUp className="text-blue-500 opacity-80" />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="flex-1 overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="w-full min-w-[1000px] border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Customer</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Contact</th>
              <th 
                className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase cursor-pointer hover:text-gray-700 select-none" 
                onClick={() => { setSortField('coins'); setSortDirection(s => s === 'asc' ? 'desc' : 'asc'); }}
              >
                Coins Reward
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Spending</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Joined</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.length > 0 ? (
              users.map((user) => {
                const age = calculateAge(user.dob);
                return (
                  <tr key={user._id} className="hover:bg-gray-50 group transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <UserAvatar photo={user.photo} name={user.name} />
                        <div>
                          <p className="font-semibold text-gray-900">{user.name}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                             {age > 0 && <span>{age} yrs</span>}
                             <span>•</span>
                             <span className={daysSinceRegistration(user.createdAt) < 30 ? 'text-green-600 font-medium' : 'text-gray-500'}>
                               {daysSinceRegistration(user.createdAt) < 30 ? 'New' : 'Regular'}
                             </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm font-medium text-gray-900">{user.phone}</p>
                      <p className="text-xs text-gray-500">{user.email || 'No email'}</p>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="flex items-center gap-1 font-bold text-gray-900">
                          <Coins className="w-3 h-3 text-amber-500" />
                          {user.coins.toLocaleString()}
                        </span>
                        <span className="text-xs text-primary font-medium">₹{user.coinValue} Value</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">₹{user.totalSpent.toLocaleString()}</span>
                        <span className="text-xs text-green-600 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" /> 
                          ₹{user.monthlySpent.toLocaleString()} /mo
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-gray-700">{formatDate(user.createdAt)}</p>
                      <p className="text-xs text-gray-400">{daysSinceRegistration(user.createdAt)} days ago</p>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleWhatsApp(user)}
                          className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors tooltip"
                          title="Send WhatsApp Message"
                        >
                          <MessageCircle size={18} />
                        </button>
                        <button 
                          onClick={() => handleEditClick(user)}
                          className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                          title="Edit Customer"
                        >
                          <Edit size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <Search className="w-10 h-10 text-gray-300 mb-2" />
                    <p>No customers found matching your search.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
        <p>
          Showing <span className="font-medium">{Math.min((pagination.page - 1) * pagination.limit + 1, pagination.totalDocs)}</span> to <span className="font-medium">{Math.min(pagination.page * pagination.limit, pagination.totalDocs)}</span> of <span className="font-medium">{pagination.totalDocs}</span> customers
        </p>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ChevronLeft size={16} />
          </button>
          
          {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
            let pageNum = i + 1;
            if (pagination.totalPages > 5 && pagination.page > 3) {
              pageNum = pagination.page - 2 + i;
            }
            if (pageNum > pagination.totalPages) return null;

            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                  pagination.page === pageNum 
                    ? 'bg-primary text-white border-primary' 
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button 
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
            className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && selectedUser && (
        <EditUserModal 
          isOpen={isEditModalOpen}
          user={selectedUser}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveUser}
        />
      )}
    </div>
  );
};

export default CustomersPage;