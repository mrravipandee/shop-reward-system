"use client";
import { useState } from "react";
import { Coins, Zap, Gift, Award, IndianRupee, Star, History, TrendingUp, Settings, X } from 'lucide-react';
import UserProfileHeader from "./UserProfileHeader";

export default function CoinDashboard() {
  const [coins, setCoins] = useState(1350);
  // const [menuOpen, setMenuOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<string | null>(null);

  const COIN_TO_RUPEE = 0.3;
  const coinValue = (coins * COIN_TO_RUPEE).toFixed(2);

  const user = {
    name: "Ravi Sharma",
    phone: "+91 98765 43210",
    memberSince: "2023",
    photo: "/user/avatar.png",
    coins: 1350,
    tier: "Gold", // Add this required property
    level: 7, // Optional: for progress tracking
    progress: 65 // Optional: percentage to next level
  };

  const menus = [
    {id: "cash", label: "Convert to Cash", icon: IndianRupee, description: "Convert your coins into cash rewards"},
    { id: "dashboard", label: "Dashboard", icon: TrendingUp, description: "View your earning analytics and performance" },
    { id: "rewards", label: "Rewards Store", icon: Gift, description: "Browse and redeem your coins for amazing rewards" },
    { id: "history", label: "Reward History", icon: History, description: "Check your redemption history and transactions" },
    { id: "tiers", label: "Member Tiers", icon: Star, description: "Explore membership levels and benefits" },
    { id: "settings", label: "Settings", icon: Settings, description: "Manage your account preferences" },
    { id: "coin-balance", label: "Coin Balance", icon: Coins, description: "Check your current coin balance and value" },
    { id: "earnings", label: "Today's Earnings", icon: Zap, description: "See your daily coin earnings" },
    { id: "redemptions", label: "My Redemptions", icon: Award, description: "View your redeemed items and orders" },
    { id: "earn-more", label: "Earn More", icon: TrendingUp, description: "Discover ways to earn additional coins" },
  ];

  const redeemProducts = [
    {
      id: 1,
      name: "1kg Premium Sugar",
      category: "grocery",
      requiredCoins: 200,
      image: "/products/sugar.png",
      originalPrice: "₹50",
      currentPrice: "₹0",
      stock: 15,
      popular: true,
      savings: "100%",
      rating: 4.5
    },
    {
      id: 2,
      name: "500g Assam Tea",
      category: "grocery",
      requiredCoins: 150,
      image: "/products/tea.png",
      originalPrice: "₹80",
      currentPrice: "₹0",
      stock: 8,
      popular: false,
      savings: "100%",
      rating: 4.2
    },
    {
      id: 3,
      name: "1L Sunflower Oil",
      category: "grocery",
      requiredCoins: 400,
      image: "/products/oil.png",
      originalPrice: "₹180",
      currentPrice: "₹0",
      stock: 12,
      popular: true,
      savings: "100%",
      rating: 4.7
    },
    {
      id: 4,
      name: "2kg Wheat Flour",
      category: "grocery",
      requiredCoins: 300,
      image: "/products/flour.png",
      originalPrice: "₹120",
      currentPrice: "₹0",
      stock: 20,
      popular: false,
      savings: "100%",
      rating: 4.3
    },
    {
      id: 5,
      name: "₹100 Cashback",
      category: "cash",
      requiredCoins: 300,
      image: "/products/cash.png",
      originalPrice: "₹100",
      currentPrice: "₹0",
      stock: 999,
      popular: true,
      savings: "100%",
      rating: 4.9
    },
    {
      id: 6,
      name: "₹200 Cashback",
      category: "cash",
      requiredCoins: 600,
      image: "/products/cash.png",
      originalPrice: "₹200",
      currentPrice: "₹0",
      stock: 999,
      popular: false,
      savings: "100%",
      rating: 4.8
    },
    {
      id: 7,
      name: "Luxury Soap Gift Pack",
      category: "gifts",
      requiredCoins: 250,
      image: "/products/soap.png",
      originalPrice: "₹75",
      currentPrice: "₹0",
      stock: 10,
      popular: false,
      savings: "100%",
      rating: 4.4
    },
    {
      id: 8,
      name: "Premium Chocolate Box",
      category: "gifts",
      requiredCoins: 180,
      image: "/products/chocolate.png",
      originalPrice: "₹60",
      currentPrice: "₹0",
      stock: 5,
      popular: true,
      savings: "100%",
      rating: 4.6
    },
  ];

  const handleRedeem = (product: typeof redeemProducts[0]) => {
    if (coins >= product.requiredCoins) {
      setCoins(coins - product.requiredCoins);
      console.log(`Successfully redeemed ${product.name}!`);
    }
  };


  const handleMenuClick = (menuId: string) => {
    setSelectedMenu(menuId);
  };

  const closeMenuPopup = () => {
    setSelectedMenu(null);
  };

  const getMenuContent = (menuId: string) => {
    const menu = menus.find(m => m.id === menuId);
    if (!menu) return null;

    switch (menuId) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
                <div className="text-green-600 font-bold text-2xl">+25</div>
                <div className="text-green-800 text-sm">Today&apos;s Coins</div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
                <div className="text-blue-600 font-bold text-2xl">+150</div>
                <div className="text-blue-800 text-sm">This Week</div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <h4 className="font-semibold mb-3">Recent Activity</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Grocery Purchase</span>
                  <span className="text-green-600">+10 coins</span>
                </div>
                <div className="flex justify-between">
                  <span>Referral Bonus</span>
                  <span className="text-green-600">+15 coins</span>
                </div>
              </div>
            </div>
          </div>
        );

      case "coin-balance":
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-primary to-purple-600 text-white p-6 rounded-2xl text-center">
              <div className="text-4xl font-bold mb-2">{coins.toLocaleString()}</div>
              <div className="text-white/80">Available Coins</div>
              <div className="text-white/60 text-sm mt-2">≈ ₹{coinValue} value</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <h4 className="font-semibold mb-2">Coin Value</h4>
              <p className="text-sm text-gray-600">1 Coin = ₹{COIN_TO_RUPEE}</p>
            </div>
          </div>
        );

      case "earnings":
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-yellow-50 to-orange-100 p-6 rounded-2xl text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">+25</div>
              <div className="text-yellow-800 font-semibold">Today&apos;s Earnings</div>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Earning Sources</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between p-3 bg-green-50 rounded-lg">
                  <span>Grocery Purchase</span>
                  <span className="text-green-600 font-semibold">+10</span>
                </div>
                <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
                  <span>Referral Bonus</span>
                  <span className="text-blue-600 font-semibold">+15</span>
                </div>
              </div>
            </div>
          </div>
        );

      case "rewards":
        return (
          <div className="py-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Rewards Store</h3>
              <span className="text-gray-600 bg-gray-100 px-3 py-1 rounded-full text-sm">
                {redeemProducts.length} products available
              </span>
            </div>

            {/* Categories Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              <button className="px-4 py-2 bg-primary text-white rounded-full text-sm font-medium">
                All Items
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200">
                Grocery
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200">
                Gift Items
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200">
                Cashback
              </button>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {redeemProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 group overflow-hidden"
                >
                  {/* Product Image/Icon */}
                  <div className="relative w-full h-48 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
                    <div className="w-20 h-20 bg-white/80 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-2xl">🎁</span>
                    </div>

                    {/* Popular Badge */}
                    {product.popular && (
                      <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <span>⭐</span>
                        Popular
                      </div>
                    )}

                    {/* Stock Badge */}
                    <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-semibold ${product.stock > 10
                        ? "bg-green-500 text-white"
                        : product.stock > 0
                          ? "bg-yellow-500 text-white"
                          : "bg-red-500 text-white"
                      }`}>
                      {product.stock > 10 ? "In Stock" : product.stock > 0 ? "Low Stock" : "Sold Out"}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">
                      {product.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-3">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-sm ${i < Math.floor(product.rating)
                                ? "text-yellow-400"
                                : "text-gray-300"
                              }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-gray-600 text-sm ml-1">({product.rating})</span>
                    </div>

                    {/* Pricing */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-primary font-bold text-xl">
                          <span className="text-yellow-500">🪙</span>
                          {product.requiredCoins}
                        </div>
                        <span className="text-gray-600 text-sm">coins</span>
                      </div>
                      <div className="text-right">
                        <div className="text-gray-500 text-sm line-through">
                          {product.originalPrice}
                        </div>
                        <div className="text-green-600 font-semibold text-lg">
                          {product.currentPrice}
                        </div>
                      </div>
                    </div>

                    {/* Savings Badge */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-center mb-4">
                      <span className="text-green-700 font-semibold text-sm">
                        🎉 You save {product.savings}
                      </span>
                    </div>

                    {/* Redeem Button */}
                    <button
                      onClick={() => handleRedeem(product)}
                      disabled={coins < product.requiredCoins || product.stock === 0}
                      className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${coins >= product.requiredCoins && product.stock > 0
                          ? "bg-gradient-to-r from-primary to-purple-600 text-white hover:shadow-lg hover:scale-105"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                    >
                      {coins >= product.requiredCoins && product.stock > 0 ? (
                        <>
                          <span>🎁</span>
                          Redeem Now
                        </>
                      ) : (
                        "Not Enough Coins"
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <div className="text-blue-600 font-bold text-2xl">{redeemProducts.length}</div>
                <div className="text-blue-800 text-sm">Total Products</div>
              </div>
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <div className="text-green-600 font-bold text-2xl">
                  {redeemProducts.filter(p => p.stock > 0).length}
                </div>
                <div className="text-green-800 text-sm">In Stock</div>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 text-center">
                <div className="text-purple-600 font-bold text-2xl">
                  {redeemProducts.filter(p => p.popular).length}
                </div>
                <div className="text-purple-800 text-sm">Popular Items</div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <menu.icon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{menu.label}</h3>
            <p className="text-gray-600">{menu.description}</p>
            <div className="mt-6 bg-gray-50 p-4 rounded-xl">
              <p className="text-sm text-gray-500">This feature is coming soon!</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen">
      {/* Menu Popup */}
      {selectedMenu && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center">
                  {(() => {
                    const menu = menus.find(m => m.id === selectedMenu);
                    const Icon = menu?.icon || Settings;
                    return <Icon className="w-5 h-5 text-white" />;
                  })()}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {menus.find(m => m.id === selectedMenu)?.label}
                  </h2>
                  <p className="text-gray-500 text-sm">
                    {menus.find(m => m.id === selectedMenu)?.description}
                  </p>
                </div>
              </div>
              <button
                onClick={closeMenuPopup}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {getMenuContent(selectedMenu)}
            </div>

            {/* Footer */}
            <div className="flex justify-end p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={closeMenuPopup}
                className="bg-primary text-white px-6 py-2 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="pb-20">
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Combined User Profile Header & Stats */}
          <div className="mb-8 mt-24">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="text-center">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900">
                  Coin Rewards Store
                </h1>
                <p className="text-gray-600 text-base sm:text-lg lg:text-xl mt-2 max-w-2xl">
                  Redeem your earned coins for amazing products and cashback rewards
                </p>
              </div>
            </div>

            <UserProfileHeader user={user} />
          </div>

          <div className="max-w-7xl mx-auto">
            {/* Menu Grid */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Quick Access</h2>
              <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {menus.map((menu) => (
                  <button
                    key={menu.id}
                    onClick={() => handleMenuClick(menu.id)}
                    className="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl border border-gray-200 hover:border-primary hover:shadow-lg transition-all duration-200 group"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                      <menu.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-gray-900 text-sm">
                        {menu.label}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}