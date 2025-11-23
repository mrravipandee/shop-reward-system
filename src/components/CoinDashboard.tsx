"use client";
import { useEffect, useState } from "react";
import { Coins, Zap, Gift, Award, IndianRupee, Star, History, TrendingUp, Settings, X, ChevronRight } from 'lucide-react';
import UserProfileHeader from "./UserProfileHeader";
import { useUserStore } from "@/store/userStore";
import { RedeemProduct, MenuItem, User } from "@/types/user"; 

const redeemProducts: RedeemProduct[] = [
  // ... (Your product data remains the same) ...
  { id: 1, name: "1kg Premium Sugar", category: "grocery", requiredCoins: 200, image: "/products/sugar.png", originalPrice: "₹50", currentPrice: "₹0", stock: 15, popular: true, savings: "100%", rating: 4.5 },
  { id: 2, name: "500g Assam Tea", category: "grocery", requiredCoins: 150, image: "/products/tea.png", originalPrice: "₹80", currentPrice: "₹0", stock: 8, popular: false, savings: "100%", rating: 4.2 },
  { id: 3, name: "1L Sunflower Oil", category: "grocery", requiredCoins: 400, image: "/products/oil.png", originalPrice: "₹180", currentPrice: "₹0", stock: 12, popular: true, savings: "100%", rating: 4.7 },
  { id: 4, name: "2kg Wheat Flour", category: "grocery", requiredCoins: 300, image: "/products/flour.png", originalPrice: "₹120", currentPrice: "₹0", stock: 20, popular: false, savings: "100%", rating: 4.3 },
  { id: 5, name: "₹100 Cashback", category: "cash", requiredCoins: 300, image: "/products/cash.png", originalPrice: "₹100", currentPrice: "₹0", stock: 999, popular: true, savings: "100%", rating: 4.9 },
  { id: 6, name: "₹200 Cashback", category: "cash", requiredCoins: 600, image: "/products/cash.png", originalPrice: "₹200", currentPrice: "₹0", stock: 999, popular: false, savings: "100%", rating: 4.8 },
  { id: 7, name: "Luxury Soap Gift Pack", category: "gifts", requiredCoins: 250, image: "/products/soap.png", originalPrice: "₹75", currentPrice: "₹0", stock: 10, popular: false, savings: "100%", rating: 4.4 },
  { id: 8, name: "Premium Chocolate Box", category: "gifts", requiredCoins: 180, image: "/products/chocolate.png", originalPrice: "₹60", currentPrice: "₹0", stock: 5, popular: true, savings: "100%", rating: 4.6 },
];

// 4. Define the Menus Array (outside the component for performance)
const menus: MenuItem[] = [
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


export default function CoinDashboard() {
  const { user, setUser } = useUserStore();

  const [loading, setLoading] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState<string | null>(null);
  
  const [selectedCategory, setSelectedCategory] = useState<RedeemProduct['category'] | 'all'>('all');

  const coins = user?.coins ?? 0;
  const COIN_TO_RUPEE = user?.coinValue ?? 0.25;  
  
  // ⬇️ FETCH USER FROM /api/me ON PAGE LOAD
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/me", { cache: "no-store" });
        const data = await res.json();

        if (res.ok) {
          // ENSURE: Data returned by the API matches the User type
          setUser(data.user);
          localStorage.setItem("rk-user", JSON.stringify(data.user));
        } else {
          // window.location.href = "/login"; // Uncomment for actual production use
          console.error("API failed, using placeholder user data.");
          // Placeholder user data for development if API fails
           setUser({
              id: "dev-123",
              name: "Guest User",
              phone: "9876543210",
              coins: 750,
              coinValue: 0.25,
              createdAt: new Date().toISOString(),
           } as User); // Cast as User to satisfy TypeScript
        }
      } catch (err) {
        console.error("ME API ERROR:", err);
        // window.location.href = "/login"; // Uncomment for actual production use
         // Placeholder user data on network/fetch error
         setUser({
              id: "dev-123",
              name: "Dev Mode",
              phone: "9876543210",
              coins: 750,
              coinValue: 0.25,
              createdAt: new Date().toISOString(),
           } as User);
      } finally {
        setLoading(false);
      }
    }

    // FIX: Call the loadUser function inside useEffect
    loadUser();
  }, [setUser]); 

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading your coins...</p>
      </div>
    );
  }

  // FIX: User object must exist after loading or the placeholder is set
  if (!user) return null; 

  const coinValue = (coins * COIN_TO_RUPEE).toFixed(2);

  const updateStoreCoins = (newCoins: number) => {
    // FIX: Set the new user object with updated coins
    setUser({ ...user, coins: newCoins } as User); 
  };

  const handleRedeem = (product: RedeemProduct) => {
    if (coins >= product.requiredCoins && product.stock > 0) {
      const newCoins = coins - product.requiredCoins;
      // In a real application, you would also decrease stock and call a backend API here.
      updateStoreCoins(newCoins); 
      
      console.log(`Successfully redeemed ${product.name}! New coin balance: ${newCoins}`);
    } else {
      console.log(`Failed to redeem ${product.name}: Not enough coins or sold out.`);
    }
  };

  const handleMenuClick = (menuId: string) => {
    setSelectedMenu(menuId);
    if (menuId === 'rewards') {
      setSelectedCategory('all');
    }
  };

  const closeMenuPopup = () => {
    setSelectedMenu(null);
  };
  
  const filteredProducts = selectedCategory === 'all'
    ? redeemProducts
    : redeemProducts.filter(p => p.category === selectedCategory);

  const getMenuContent = (menuId: string) => {
    // FIX: Find the menu item, guaranteed to exist since we only set valid menuIds
    const menu = menus.find(m => m.id === menuId) as MenuItem; 

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
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 rounded-2xl text-center">
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
        const allCategories: Array<RedeemProduct['category'] | 'all'> = ['all', 'grocery', 'cash', 'gifts'];

        return (
          <div className="py-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 border-b pb-4">
              <h3 className="text-2xl font-bold text-gray-900 mb-2 sm:mb-0">Rewards Store</h3>
              <div className="flex items-center gap-2 text-gray-600">
                  <Coins className="w-5 h-5 text-yellow-500" />
                  <span className="font-semibold text-lg">{coins.toLocaleString()}</span>
                  <span>Available Coins</span>
              </div>
            </div>

            {/* Categories Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              {allCategories.map((category) => (
                <button 
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 ${
                    selectedCategory === category
                      ? "bg-primary text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-primary/10 hover:text-primary"
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)} {category !== 'all' && `(${redeemProducts.filter(p => p.category === category).length})`}
                </button>
              ))}
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl shadow-lg border border-gray-200 hover:border-primary hover:shadow-xl transition-all duration-300 group overflow-hidden"
                  >
                    {/* Product Image/Icon */}
                    <div className="relative w-full h-40 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
                       {/* Simplified Image Placeholder: Replace with <img src={product.image} ... /> if available */}
                      <div className="w-16 h-16 bg-white/80 rounded-2xl flex items-center justify-center shadow-lg">
                        <span className="text-2xl">{product.category === 'cash' ? '💵' : product.category === 'grocery' ? '🛒' : '🎁'}</span>
                      </div>

                      {/* Popular Badge */}
                      {product.popular && (
                        <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                          <Star className="w-3 h-3 fill-white text-white"/>
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
                        <span className="text-gray-600 text-sm ml-1">({product.rating.toFixed(1)})</span>
                      </div>

                      {/* Pricing */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 text-primary font-bold text-2xl">
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
                            ? "bg-gradient-to-r from-primary to-purple-600 text-white hover:shadow-lg hover:scale-[1.02]"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                          }`}
                      >
                        {product.stock === 0 ? (
                          "Sold Out"
                        ) : coins >= product.requiredCoins ? (
                          <>
                            <span>🎁</span>
                            Redeem Now
                          </>
                        ) : (
                          `Need ${product.requiredCoins - coins} More Coins`
                        )}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12 bg-gray-50 rounded-xl">
                  <p className="text-lg text-gray-600">No products found in the selected category.</p>
                </div>
              )}
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
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
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close menu"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Content (Use flex-1 and overflow-y-auto to allow scrolling within the content area) */}
            <div className="p-6 overflow-y-auto flex-1">
              {getMenuContent(selectedMenu)}
            </div>

            {/* Footer */}
            <div className="flex justify-end p-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={closeMenuPopup}
                className="bg-primary text-white px-6 py-2 rounded-xl font-semibold hover:opacity-90 transition-opacity"
              >
                Done
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
            <div className="flex flex-col items-center justify-center gap-4 mb-6 text-center">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-gray-900">
                Coin Rewards Store
              </h1>
              <p className="text-gray-600 text-base sm:text-lg lg:text-xl mt-2 max-w-2xl mx-auto">
                Redeem your earned coins for amazing products and cashback rewards
              </p>
              
              {/* Added Quick Coin Balance below the title */}
              <div className="flex items-center gap-2 mt-4 text-xl font-semibold text-gray-700 p-2 px-4 bg-yellow-50 rounded-full border border-yellow-200 shadow-sm">
                <Coins className="w-6 h-6 text-yellow-500" />
                <span>Your Balance:</span>
                <span className="text-primary font-extrabold ml-1">{coins.toLocaleString()} Coins</span>
              </div>
            </div>

            <UserProfileHeader user={user} />
          </div>

          <div className="max-w-7xl mx-auto">
            {/* Menu Grid */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Quick Access</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {menus.map((menu) => (
                  <button
                    key={menu.id}
                    onClick={() => handleMenuClick(menu.id)}
                    className="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl border border-gray-200 hover:border-primary hover:shadow-lg transition-all duration-200 group text-center"
                  >
                    <div className="w-14 h-14 bg-gradient-to-br from-primary to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                      <menu.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="font-semibold text-gray-900 text-base">
                      {menu.label}
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Automatically display Rewards Store on the main page if no menu is selected */}
          <div className="max-w-7xl mx-auto">
             <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-2">Featured Rewards</h2>
             
             <div className="text-center py-12 bg-indigo-50 rounded-xl shadow-inner">
                <h3 className="text-2xl font-bold text-indigo-900 mb-4">Ready to Redeem?</h3>
                <p className="text-indigo-700 mb-6">Click on **Rewards Store** in the Quick Access panel above to browse all products and cashback offers!</p>
                <button
                    onClick={() => handleMenuClick("rewards")}
                    className="flex items-center gap-2 mx-auto px-8 py-3 bg-gradient-to-r from-primary to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.03] transition-all duration-300"
                >
                    <Gift className="w-5 h-5" />
                    Go to Rewards Store
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}