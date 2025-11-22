import React from "react";
import Image from "next/image";
import { Phone, Star } from "lucide-react";

interface User {
  name: string;
  phone: string;
  photo?: string;
  coins: number;
  createdAt: string;
}

interface UserProfileHeaderProps {
  user: User;
}

export default function UserProfileHeader({ user }: UserProfileHeaderProps) {
  const memberSince = new Date(user.createdAt).getFullYear();
  const tier = user.coins > 1000 ? "Gold" : user.coins > 500 ? "Silver" : "Bronze";

  const formatPhone5x5 = (num: string) => {
  const digits = num.replace(/\D/g, ""); // Ensure only numbers
  if (digits.length <= 5) return digits;
  return digits.slice(0, 5) + " " + digits.slice(5, 10);
};

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden mb-8">
      
      {/* Background Section */}
      <div className="relative w-full h-32 sm:h-40 bg-gradient-to-r from-primary to-indigo-600">
        
        {/* Profile Image */}
        <div className="absolute left-1/2 -bottom-8 sm:-bottom-12 transform -translate-x-1/2">
          <div className="w-20 h-20 sm:w-28 sm:h-28 bg-gray-300 rounded-full border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
            {user.photo ? (
              <Image
                src={user.photo}
                alt={user.name}
                width={112}
                height={112}
                className="rounded-full object-cover"
              />
            ) : (
              <span className="text-gray-600 text-xl font-bold">
                {user.name?.split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="pt-10 sm:pt-16 pb-6 sm:pb-8 px-4 sm:px-6 text-center">

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          {user.name}
        </h1>

        {/* Phone + Member Since */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-6 text-gray-600 mb-6">
          <div className="flex items-center gap-1">
            <Phone className="w-4 h-4" />
            <span>+91 {formatPhone5x5(user.phone)}</span>
          </div>

          <div className="hidden sm:block text-gray-300">•</div>

          <div className="flex items-center gap-1">
            <Star className="w-4 h-4" />
            <span>Member since {memberSince}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Total Coins</p>
            <p className="text-xl text-yellow-600 font-bold">{user.coins}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Member Tier</p>
            <p className="text-xl text-purple-600 font-bold">{tier}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Coin Value</p>
            <p className="text-xl text-green-600 font-bold">
              ₹{(user.coins * 0.3).toFixed(2)}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Savings</p>
            <p className="text-xl text-blue-600 font-bold">
              ₹{(user.coins * 0.3 * 3).toFixed(0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
