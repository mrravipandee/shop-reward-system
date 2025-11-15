"use client";
import { useState } from "react";
import { Coins, IndianRupee, Gift, ShoppingBag, Star, Zap, Award } from "lucide-react";

export default function CoinDashboard() {
  const [coins, setCoins] = useState(1350);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const COIN_TO_RUPEE = 0.3;
  const coinValue = (coins * COIN_TO_RUPEE).toFixed(2);

  const categories = [
    { id: "all", label: "All Items", icon: ShoppingBag },
    { id: "grocery", label: "Grocery", icon: Zap },
    { id: "gifts", label: "Gift Items", icon: Gift },
    { id: "cash", label: "Cashback", icon: IndianRupee },
  ];

  const redeemProducts = [
    {
      id: 1,
      name: "1kg Sugar",
      category: "grocery",
      requiredCoins: 200,
      image: "/products/sugar.png",
      originalPrice: "₹50",
      stock: 15,
      popular: true
    },
    {
      id: 2,
      name: "500g Tea",
      category: "grocery",
      requiredCoins: 150,
      image: "/products/tea.png",
      originalPrice: "₹80",
      stock: 8,
      popular: false
    },
    {
      id: 3,
      name: "1L Cooking Oil",
      category: "grocery",
      requiredCoins: 400,
      image: "/products/oil.png",
      originalPrice: "₹180",
      stock: 12,
      popular: true
    },
    {
      id: 4,
      name: "2kg Wheat Flour",
      category: "grocery",
      requiredCoins: 300,
      image: "/products/flour.png",
      originalPrice: "₹120",
      stock: 20,
      popular: false
    },
    {
      id: 5,
      name: "₹100 Cashback",
      category: "cash",
      requiredCoins: 300,
      image: "/products/cash.png",
      originalPrice: "₹100",
      stock: 999,
      popular: true
    },
    {
      id: 6,
      name: "₹200 Cashback",
      category: "cash",
      requiredCoins: 600,
      image: "/products/cash.png",
      originalPrice: "₹200",
      stock: 999,
      popular: false
    },
    {
      id: 7,
      name: "Soap Gift Pack",
      category: "gifts",
      requiredCoins: 250,
      image: "/products/soap.png",
      originalPrice: "₹75",
      stock: 10,
      popular: false
    },
    {
      id: 8,
      name: "Chocolate Box",
      category: "gifts",
      requiredCoins: 180,
      image: "/products/chocolate.png",
      originalPrice: "₹60",
      stock: 5,
      popular: true
    },
  ];

  const filteredProducts = selectedCategory === "all" 
    ? redeemProducts 
    : redeemProducts.filter(product => product.category === selectedCategory);

  const handleRedeem = (product: typeof redeemProducts[0]) => {
    if (coins >= product.requiredCoins) {
      setCoins(coins - product.requiredCoins);
      alert(`Successfully redeemed ${product.name}!`);
    }
  };

  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-screen-2xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
              <Coins className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary">
              Coin Rewards Store
            </h1>
          </div>
          <p className="text-secondary/80 text-lg sm:text-xl max-w-2xl mx-auto">
            Redeem your earned coins for amazing products and cashback rewards
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 sm:gap-8">
          
          {/* Left Sidebar - Coin Balance & Info */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Coin Balance Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-secondary/10">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Coins className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-secondary mb-2">
                  {coins.toLocaleString()} Coins
                </h2>
                <div className="flex items-center justify-center gap-2 text-secondary/80 mb-4">
                  <IndianRupee className="w-5 h-5" />
                  <span className="text-lg font-semibold">Value: ₹{coinValue}</span>
                </div>
                <div className="w-full bg-secondary/10 rounded-full h-3 mb-2">
                  <div 
                    className="bg-primary rounded-full h-3 transition-all duration-500"
                    style={{ width: `${Math.min((coins / 2000) * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="text-secondary/60 text-sm">
                  {coins >= 2000 ? "Max level reached!" : `${2000 - coins} coins to next level`}
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-secondary/10">
              <h3 className="font-semibold text-secondary mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Quick Stats
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-secondary/70">Coins Earned Today</span>
                  <span className="font-semibold text-secondary">+25</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-secondary/70">Items Redeemed</span>
                  <span className="font-semibold text-secondary">8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-secondary/70">Savings</span>
                  <span className="font-semibold text-primary">₹450</span>
                </div>
              </div>
            </div>

            {/* How to Earn */}
            <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
              <h3 className="font-semibold text-secondary mb-3 flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                How to Earn More
              </h3>
              <ul className="space-y-2 text-sm text-secondary/80">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  ₹20 spent = 1 coin
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Daily login bonus: 5 coins
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Refer friends: 50 coins each
                </li>
              </ul>
            </div>
          </div>

          {/* Main Content - Products */}
          <div className="lg:col-span-3">
            
            {/* Category Filter */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-secondary/10 mb-6">
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-medium transition-all duration-300 ${
                        selectedCategory === category.id
                          ? "bg-primary text-white shadow-lg"
                          : "bg-secondary/5 text-secondary hover:bg-secondary/10"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm sm:text-base">{category.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-secondary/10 hover:shadow-xl transition-all duration-300 group"
                >
                  {/* Product Image & Badges */}
                  <div className="relative mb-4">
                    <div className="w-full h-40 sm:h-48 bg-secondary/5 rounded-xl flex items-center justify-center mb-3">
                      <div className="w-20 h-20 bg-primary/10 rounded-xl flex items-center justify-center">
                        <Gift className="w-10 h-10 text-primary" />
                      </div>
                    </div>
                    
                    {product.popular && (
                      <div className="absolute top-2 left-2 bg-primary text-white px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" />
                        Popular
                      </div>
                    )}
                    
                    {product.stock < 10 && product.stock > 0 && (
                      <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-lg text-xs font-semibold">
                        Low Stock
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-secondary text-xl leading-tight">
                      {product.name}
                    </h3>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-primary font-bold text-2xl">
                        <Coins className="w-5 h-5" />
                        {product.requiredCoins}
                      </div>
                      <div className="text-secondary/60 text-sm line-through">
                        {product.originalPrice}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-secondary/70">
                      <span>Stock: {product.stock}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        product.stock > 10 
                          ? "bg-green-100 text-green-700" 
                          : product.stock > 0 
                          ? "bg-yellow-100 text-yellow-700" 
                          : "bg-red-100 text-red-700"
                      }`}>
                        {product.stock > 10 ? "In Stock" : product.stock > 0 ? "Low Stock" : "Out of Stock"}
                      </span>
                    </div>

                    {/* Redeem Button */}
                    <button
                      onClick={() => handleRedeem(product)}
                      disabled={coins < product.requiredCoins || product.stock === 0}
                      className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                        coins >= product.requiredCoins && product.stock > 0
                          ? "bg-primary text-white hover:bg-primary/90 hover:scale-105"
                          : "bg-secondary/10 text-secondary/40 cursor-not-allowed"
                      }`}
                    >
                      {coins >= product.requiredCoins && product.stock > 0 ? (
                        <>
                          <Gift className="w-5 h-5" />
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

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-8 h-8 text-secondary/40" />
                </div>
                <h3 className="text-lg font-semibold text-secondary/60 mb-2">
                  No products found
                </h3>
                <p className="text-secondary/40">
                  Try selecting a different category
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}