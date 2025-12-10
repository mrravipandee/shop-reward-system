"use client";

import {
  Bell,
  Search,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Check,
  X,
  Moon,
  Sun,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Img from "../../../../public/images/ravikirana-hero.png";

// Click outside reusable hook
const useClickOutside = (
  ref: React.RefObject<HTMLDivElement | null>,
  fn: () => void
) => {
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) fn();
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [ref, fn]);
};

export default function TopBar() {
  const router = useRouter();
  const [openNotif, setOpenNotif] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, msg: "New feature released 🎉", time: "2h", read: false },
    { id: 2, msg: "Security patch updated", time: "1d", read: true },
    { id: 3, msg: "Your subscription will expire soon", time: "3d", read: false },
  ]);

  const notifRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside(notifRef, () => setOpenNotif(false));
  useClickOutside(menuRef, () => setOpenMenu(false));

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = async () => {
    const loading = toast.loading("Logging out...");
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      toast.update(loading, {
        render: "Logged out successfully!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      router.push("/login");
    } catch (err) {
      toast.update(loading, {
        render: "Logout failed",
        type: "error",
        isLoading: false,
      });
    }
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const clearNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  return (
    <>
      <ToastContainer 
        position="top-right"
        theme="light"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <nav className="w-full px-4 md:px-6 py-4 flex justify-end sticky top-0 z-50 bg-gradient-to-r from-primary/10 via-indigo-50 to-accent border-b border-gray-200/50 backdrop-blur-lg">
        <div className="bg-white/70 border border-gray-500/60 backdrop-blur-xl px-4 md:px-6 py-2.5 rounded-2xl shadow-sm shadow-gray-200/50 flex items-center gap-4 hover:shadow-md hover:shadow-gray-300/30 transition-all duration-300">
          {/* Search with expandable effect */}
          <div className={`hidden md:flex items-center transition-all duration-300 ${searchFocused ? 'w-72' : 'w-64'}`}>
            <div className="relative w-full">
              <Search className={`h-4 w-4 absolute left-3.5 top-1/2 transform -translate-y-1/2 transition-colors ${searchFocused ? 'text-indigo-500' : 'text-gray-400'}`} />
              <input
                type="text"
                placeholder="Search tasks, projects..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50/80 rounded-xl outline-none border border-gray-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 placeholder:text-gray-400"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
              {searchFocused && (
                <X 
                  className="h-4 w-4 absolute right-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600" 
                  onClick={() => setSearchFocused(false)}
                />
              )}
            </div>
          </div>

          {/* Mobile search button */}
          <button className="md:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors">
            <Search className="h-5 w-5" />
          </button>

          {/* Divider */}
          <div className="h-6 w-px bg-gray-200 hidden md:block" />

          {/* Notification with improved UI */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => {
                setOpenNotif(!openNotif);
                setOpenMenu(false);
              }}
              className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors relative group"
            >
              <Bell className="h-5 w-5 group-hover:scale-110 transition-transform" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-[10px] font-semibold text-white px-1 animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {openNotif && (
              <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white rounded-2xl shadow-xl shadow-gray-300/30 border border-gray-100 overflow-hidden animate-scale-in">
                <div className="p-4 bg-gradient-to-r from-indigo-50 to-violet-50 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                      <Bell className="h-4 w-4 text-indigo-500" />
                      Notifications
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 text-xs bg-indigo-500 text-white rounded-full">
                          {unreadCount} new
                        </span>
                      )}
                    </h4>
                    {unreadCount > 0 && (
                      <button 
                        onClick={markAllAsRead}
                        className="text-xs text-indigo-600 font-medium hover:text-indigo-700 transition-colors"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`flex items-start justify-between p-4 border-b border-gray-50 last:border-b-0 hover:bg-gray-50/50 transition-colors group ${
                          !n.read ? "bg-indigo-50/30" : ""
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-3">
                            <div className={`mt-0.5 h-2 w-2 rounded-full ${!n.read ? 'bg-indigo-500 animate-pulse' : 'bg-gray-300'}`} />
                            <div>
                              <p className="text-sm font-medium text-gray-800">{n.msg}</p>
                              <span className="text-xs text-gray-500 mt-1">{n.time} ago</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!n.read && (
                            <button
                              onClick={() => markAsRead(n.id)}
                              className="p-1.5 hover:bg-green-100 rounded-lg transition-colors"
                              title="Mark as read"
                            >
                              <Check className="h-3 w-3 text-green-600" />
                            </button>
                          )}
                          <button
                            onClick={() => clearNotification(n.id)}
                            className="p-1.5 hover:bg-red-100 rounded-lg transition-colors"
                            title="Dismiss"
                          >
                            <X className="h-3 w-3 text-red-500" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <Bell className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">No notifications</p>
                    </div>
                  )}
                </div>
                
                <div className="p-3 border-t border-gray-100 bg-gray-50/50">
                  <Link 
                    href="/notifications" 
                    className="text-xs text-center text-gray-600 hover:text-indigo-600 font-medium block transition-colors"
                  >
                    View all notifications
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Profile Menu with enhanced design */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => {
                setOpenMenu(!openMenu);
                setOpenNotif(false);
              }}
              className="flex items-center gap-3 pr-1 pl-3 py-1.5 rounded-2xl hover:bg-gray-100 transition-all duration-300 group"
            >
              <div className="relative">
                <Image
                  src={Img}
                  alt="User"
                  height={36}
                  width={36}
                  className="rounded-full border-2 border-gray-200 group-hover:border-indigo-300 transition-all duration-300"
                />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 rounded-full border border-white"></span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-800">Ravii Pandey</p>
                <p className="text-xs text-gray-500">Admin</p>
              </div>
              <ChevronDown
                className={`h-4 w-4 text-gray-500 transition-transform duration-300 ${
                  openMenu && "rotate-180"
                } group-hover:text-indigo-500`}
              />
            </button>

            {openMenu && (
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl shadow-gray-300/30 border border-gray-100 overflow-hidden animate-scale-in">
                <div className="p-4 bg-gradient-to-r from-indigo-400 to-primary/80 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <Image
                      src={Img}
                      alt="User"
                      height={40}
                      width={40}
                      className="rounded-full border-2 border-white"
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-100">Ravii Pandey</p>
                      <p className="text-xs text-gray-200">imravipanday@gmail.com</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-2">
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl text-sm text-gray-700 hover:text-indigo-600 transition-all group"
                  >
                    <div className="p-2 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
                      <User className="h-4 w-4 text-indigo-600" />
                    </div>
                    <span>My Profile</span>
                  </Link>
                  
                  <Link
                    href="/settings"
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl text-sm text-gray-700 hover:text-indigo-600 transition-all group"
                  >
                    <div className="p-2 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
                      <Settings className="h-4 w-4 text-indigo-600" />
                    </div>
                    <span>Settings</span>
                  </Link>
                  
                  <div className="h-px bg-gray-100 my-1 mx-3" />
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 p-3 hover:bg-red-50 rounded-xl text-sm text-red-600 hover:text-red-700 transition-all group"
                  >
                    <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                      <LogOut className="h-4 w-4" />
                    </div>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}