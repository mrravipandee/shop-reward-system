import React from "react";
import Image from "next/image";
import { Phone, Star } from "lucide-react";
interface User {
  name: string;
  phone: string;
  memberSince: string;
  photo?: string;
  coins: number;
  tier: string;
}

interface UserProfileHeaderProps {
  user: User;
}

export default function UserProfileHeader({ user }: UserProfileHeaderProps) {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden mb-8">
      {/* Background Image Section */}
      <div className="relative w-full h-32 sm:h-40 bg-gradient-to-r from-primary to-purple-600">
        {/* Profile Image - Centered over background */}
        <div className="absolute left-1/2 -bottom-8 sm:-bottom-12 transform -translate-x-1/2">
            <div className="w-full h-full bg-gray-300 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
              {user.photo ? (
                <Image src={user.photo} alt={user.name} className="w-full h-full rounded-full object-cover" width={96} height={96} />
              ) : (
                <span className="text-gray-600 text-lg sm:text-xl font-bold">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </span>
              )}
            </div>
          </div>
        </div>

      {/* User Info Section */}
      <div className="pt-10 sm:pt-16 pb-6 sm:pb-8 px-4 sm:px-6 text-center">
        {/* Name */}
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          {user.name}
        </h1>
        
        {/* Phone and Member Since */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-1 sm:gap-6 text-gray-600 mb-6 text-sm sm:text-base">
          <div className="flex items-center gap-1">
            <span><Phone /></span>
            <span>{user.phone}</span>
          </div>
          <div className="hidden sm:block text-gray-300">•</div>
          <div className="flex items-center gap-1">
            <span><Star /></span>
            <span>Member since {user.memberSince}</span>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {/* Total Coins */}
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 shadow-sm">
            <div className="text-xs sm:text-sm text-gray-500 mb-1">Total Coins</div>
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-600">
              {user.coins.toLocaleString()}
            </div>
          </div>

          {/* Member Tier */}
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 shadow-sm">
            <div className="text-xs sm:text-sm text-gray-500 mb-1">Member Tier</div>
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-500">
              {user.tier}
            </div>
          </div>

          {/* Coin Value */}
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 shadow-sm">
            <div className="text-xs sm:text-sm text-gray-500 mb-1">Coin Value</div>
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-green-600">
              ₹{(user.coins * 0.3).toFixed(2)}
            </div>
          </div>

          {/* Today's Purchases */}
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 shadow-sm">
            <div className="text-xs sm:text-sm text-gray-500 mb-1">Savings</div>
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600">
              ₹{(user.coins * 0.3 * 3).toFixed(0)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}