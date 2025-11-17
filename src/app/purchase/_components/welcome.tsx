"use client";
import { useState, useEffect } from "react";
import { X, Gift, Award, Crown, Sparkles, Star, Coins, IndianRupee, Phone, MapPin, ShoppingBag, ArrowRight } from "lucide-react";

interface WelcomePageProps {
  onContinue?: () => void;
}

export default function WelcomePage({ onContinue }: WelcomePageProps) {
  const [activePopup, setActivePopup] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Small delay for animation
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleContinue = () => {
    setIsVisible(false);
    setTimeout(() => {
      onContinue?.();
    }, 300);
  };

  const popups = {
    claim: {
      title: "Claim Your Reward 🎁",
      icon: <Gift className="w-6 h-6 text-primary" />,
      content: (
        <div className="space-y-4">
          <p className="text-secondary/80 text-sm leading-relaxed">
            Congratulations! You have earned <span className="font-bold text-primary">150 coins</span> that are ready to be claimed.
          </p>
          <div className="bg-primary/5 rounded-lg p-3 border border-primary/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-secondary text-sm font-medium">Available Coins:</span>
              <span className="text-primary font-bold text-lg">150</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-secondary text-sm font-medium">Coin Value:</span>
              <span className="text-primary font-bold">₹45</span>
            </div>
          </div>
          <button className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-all duration-300">
            Claim Now
          </button>
        </div>
      )
    },
    offer: {
      title: "Best Offer 🔥",
      icon: <Award className="w-6 h-6 text-primary" />,
      content: (
        <div className="space-y-4">
          <p className="text-secondary/80 text-sm leading-relaxed">
            Today&apos;s special offer! Get amazing discounts on your favorite products.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="w-4 h-4 text-yellow-600" />
              </div>
              <div>
                <h4 className="font-bold text-secondary text-sm">Weekend Special</h4>
                <p className="text-yellow-700 text-xs">20% OFF on all groceries</p>
              </div>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Valid until:</span>
                <span className="font-semibold">Sunday, 11:59 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Minimum purchase:</span>
                <span className="font-semibold">₹200</span>
              </div>
            </div>
          </div>
          <button className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-all duration-300">
            Shop Now
          </button>
        </div>
      )
    },
    win: {
      title: "Win Prices 🏆",
      icon: <Crown className="w-6 h-6 text-primary" />,
      content: (
        <div className="space-y-4">
          <p className="text-secondary/80 text-sm leading-relaxed">
            Participate in our daily lucky draw and win exciting prizes! Every purchase gives you a chance to win.
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { prize: "₹500 Cash", icon: <IndianRupee className="w-4 h-4" /> },
              { prize: "Free Groceries", icon: <Gift className="w-4 h-4" /> },
              { prize: "1000 Coins", icon: <Coins className="w-4 h-4" /> },
              { prize: "Gift Hamper", icon: <Award className="w-4 h-4" /> }
            ].map((item, index) => (
              <div key={index} className="bg-primary/5 rounded-lg p-2 text-center border border-primary/10">
                <div className="flex justify-center text-primary mb-1">
                  {item.icon}
                </div>
                <span className="text-xs font-medium text-secondary">{item.prize}</span>
              </div>
            ))}
          </div>
          <button className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-all duration-300">
            Check Winners
          </button>
        </div>
      )
    }
  };

  return (
    <div className={`w-full max-w-4xl mx-4 bg-white rounded-3xl shadow-2xl border border-secondary/10 overflow-hidden transition-all duration-500 ${
      isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
    }`}>
      <div className="grid lg:grid-cols-2">
        
        {/* Left Content */}
        <div className="p-6 sm:p-8 lg:p-10 space-y-6 sm:space-y-8">
          {/* Header */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full text-primary font-medium text-xs sm:text-sm mb-3">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Welcome to Ravi Kirana</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary mb-3 sm:mb-4 leading-tight">
              Your Daily <span className="text-primary">Rewards</span> 🎉
            </h1>
            
            <p className="text-secondary/80 text-sm sm:text-base leading-relaxed">
              Shop at Ravi Kirana Store and unlock amazing rewards, exclusive offers, and chances to win big prizes with every purchase.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 text-center lg:text-left">
            {[
              { number: "500+", label: "Customers" },
              { number: "50+", label: "Winners" },
              { number: "₹1000+", label: "Rewards" }
            ].map((stat, index) => (
              <div key={index} className="bg-secondary/5 rounded-lg p-3 sm:p-4">
                <div className="text-lg sm:text-xl font-bold text-primary mb-1">{stat.number}</div>
                <div className="text-secondary/70 text-xs sm:text-sm">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { key: "claim", label: "Claim Reward", icon: <Gift className="w-4 h-4 sm:w-5 sm:h-5" />, color: "bg-primary text-white hover:bg-primary/90" },
              { key: "offer", label: "Best Offer", icon: <Award className="w-4 h-4 sm:w-5 sm:h-5" />, color: "bg-white text-primary border border-primary hover:bg-primary/5" },
              { key: "win", label: "Win Prices", icon: <Crown className="w-4 h-4 sm:w-5 sm:h-5" />, color: "bg-white text-primary border border-primary hover:bg-primary/5" }
            ].map((button) => (
              <button
                key={button.key}
                onClick={() => setActivePopup(button.key)}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${button.color}`}
              >
                {button.icon}
                <span className="text-xs sm:text-sm">{button.label}</span>
              </button>
            ))}
          </div>

          {/* Quick Info */}
          <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Star className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-secondary text-sm mb-1">Why Choose Us?</h3>
                <p className="text-secondary/80 text-xs">
                  Fresh products • Best prices • Instant rewards • Free delivery
                </p>
              </div>
            </div>
          </div>

          {/* Contact CTA & Continue Button */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <a
                href="tel:+919876543210"
                className="flex items-center justify-center gap-2 bg-secondary text-white py-3 px-4 rounded-lg font-semibold hover:bg-secondary/90 transition-all duration-300 text-sm flex-1"
              >
                <Phone className="w-4 h-4" />
                Call for Delivery
              </a>
              <a
                href="#contact"
                className="flex items-center justify-center gap-2 border border-secondary text-secondary py-3 px-4 rounded-lg font-semibold hover:bg-secondary hover:text-white transition-all duration-300 text-sm flex-1"
              >
                <MapPin className="w-4 h-4" />
                Visit Store
              </a>
            </div>

            {/* Continue Button */}
            <button
              onClick={handleContinue}
              className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 group"
            >
              <span>Continue to Main Page</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>

        {/* Right Image */}
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-6 sm:p-8 lg:p-10 flex items-center justify-center relative">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-secondary text-lg sm:text-xl mb-2">Ravi Kirana Store</h3>
              <p className="text-secondary/80 text-sm sm:text-base">Your Trusted Neighborhood Store</p>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-lg text-xs font-semibold">
              <div className="flex items-center gap-1">
                <Coins className="w-3 h-3" />
                <span>Earn Coins</span>
              </div>
            </div>

            <div className="absolute bottom-4 right-4 bg-white border border-secondary/20 px-3 py-1 rounded-lg shadow-sm">
              <div className="flex items-center gap-1">
                <Gift className="w-3 h-3 text-primary" />
                <div>
                  <div className="font-bold text-secondary text-xs">500+</div>
                  <div className="text-secondary/70 text-xs">Rewards</div>
                </div>
              </div>
            </div>

            <div className="absolute top-4 right-4 bg-yellow-100 border border-yellow-200 px-3 py-1 rounded-lg">
              <div className="flex items-center gap-1 text-yellow-700">
                <Crown className="w-3 h-3" />
                <span className="font-semibold text-xs">Win Prizes</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popup Modal */}
      {activePopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-auto animate-scaleIn">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {popups[activePopup as keyof typeof popups].icon}
                <h2 className="text-lg font-bold text-secondary">
                  {popups[activePopup as keyof typeof popups].title}
                </h2>
              </div>
              <button
                onClick={() => setActivePopup(null)}
                className="w-6 h-6 rounded-full bg-secondary/10 hover:bg-secondary/20 transition-colors duration-200 flex items-center justify-center"
              >
                <X className="w-3 h-3 text-secondary" />
              </button>
            </div>

            {/* Content */}
            {popups[activePopup as keyof typeof popups].content}

            {/* Continue Button */}
            <button
              onClick={() => setActivePopup(null)}
              className="w-full mt-3 py-2 border border-secondary/20 text-secondary rounded-lg font-medium hover:bg-secondary/5 transition-all duration-300 text-sm"
            >
              Continue Browsing
            </button>
          </div>
        </div>
      )}

      {/* Add custom animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}