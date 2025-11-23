"use client";
import { useState, useEffect } from "react";
import { 
  X, Gift, Award, Crown, Sparkles, Star, Coins, 
  IndianRupee, ShoppingBag, ArrowRight 
} from "lucide-react";

interface WelcomePageProps {
  onContinue?: () => void;
}

export default function WelcomePage({ onContinue }: WelcomePageProps) {
  const [activePopup, setActivePopup] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleContinue = () => {
    setIsVisible(false);
    setTimeout(() => {
      onContinue?.();
    }, 300);
  };

  // Simplified Popup Content
  const popups = {
    claim: {
      title: "Claim Reward 🎁",
      icon: <Gift className="w-5 h-5 text-primary" />,
      content: (
        <div className="space-y-4">
          <div className="bg-primary/5 rounded-xl p-4 border border-primary/10 text-center">
            <p className="text-secondary/70 text-sm mb-1">Available Balance</p>
            <div className="text-3xl font-bold text-primary">150 Coins</div>
            <div className="text-sm text-secondary font-medium mt-1">Value: ₹45</div>
          </div>
          <button className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 active:scale-95 transition-all">
            Claim to Wallet
          </button>
        </div>
      )
    },
    offer: {
      title: "Today's Offer 🔥",
      icon: <Award className="w-5 h-5 text-primary" />,
      content: (
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="bg-yellow-100 p-2 rounded-lg">
                <Star className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h4 className="font-bold text-secondary">Weekend Special</h4>
                <p className="text-yellow-700 text-sm">Flat 20% OFF on groceries</p>
                <p className="text-xs text-yellow-600 mt-1 font-medium">Min Order: ₹200</p>
              </div>
            </div>
          </div>
          <button className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 active:scale-95 transition-all">
            Copy Coupon
          </button>
        </div>
      )
    },
    win: {
      title: "Daily Lucky Draw 🏆",
      icon: <Crown className="w-5 h-5 text-primary" />,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "₹500 Cash", icon: <IndianRupee className="w-3 h-3" /> },
              { label: "Free Kit", icon: <Gift className="w-3 h-3" /> },
              { label: "1k Coins", icon: <Coins className="w-3 h-3" /> },
              { label: "Hamper", icon: <Award className="w-3 h-3" /> }
            ].map((item, i) => (
              <div key={i} className="bg-secondary/5 border border-secondary/10 p-2 rounded-lg flex flex-col items-center justify-center gap-1">
                <div className="text-primary">{item.icon}</div>
                <span className="text-xs font-medium text-secondary">{item.label}</span>
              </div>
            ))}
          </div>
          <button className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 active:scale-95 transition-all">
            Enter Draw
          </button>
        </div>
      )
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div 
        className={`w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="grid lg:grid-cols-5 h-full">
          
          {/* Left Content (Span 3 on large screens, full on mobile) */}
          <div className="lg:col-span-3 p-6 sm:p-8 flex flex-col justify-center relative">
            
            {/* Header */}
            <div className="space-y-2 mb-6 sm:mb-8">
              <div className="inline-flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full text-primary font-medium text-xs w-fit">
                <Sparkles className="w-3 h-3" />
                <span>Welcome Back</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-secondary">
                Ravi Kirana <span className="text-primary">Rewards</span>
              </h1>
              <p className="text-secondary/70 text-sm sm:text-base leading-relaxed max-w-md">
                We&apos;ve missed you! Check out your exclusive rewards and today&apos;s special offers before you shop.
              </p>
            </div>

            {/* Interactive Grid */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-8">
              {[
                { key: "claim", label: "Claim", sub: "Reward", icon: <Gift className="w-5 h-5" />, bg: "bg-blue-50 text-blue-600 border-blue-100" },
                { key: "offer", label: "Offers", sub: "View", icon: <Award className="w-5 h-5" />, bg: "bg-orange-50 text-orange-600 border-orange-100" },
                { key: "win", label: "Prizes", sub: "Play", icon: <Crown className="w-5 h-5" />, bg: "bg-purple-50 text-purple-600 border-purple-100" }
              ].map((btn) => (
                <button
                  key={btn.key}
                  onClick={() => setActivePopup(btn.key)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 hover:scale-105 active:scale-95 ${btn.bg}`}
                >
                  <div className="mb-1">{btn.icon}</div>
                  <span className="text-xs font-bold">{btn.label}</span>
                  <span className="text-[10px] opacity-70">{btn.sub}</span>
                </button>
              ))}
            </div>

            {/* Social Proof Stats (Simplified) */}
            <div className="flex items-center justify-between bg-secondary/5 rounded-xl p-4 mb-6">
              <div className="text-center flex-1 border-r border-secondary/10 last:border-0">
                <div className="text-lg font-bold text-secondary">50+</div>
                <div className="text-[10px] text-secondary/60 uppercase tracking-wide">Winners</div>
              </div>
              <div className="text-center flex-1 border-r border-secondary/10 last:border-0">
                <div className="text-lg font-bold text-secondary">₹1k+</div>
                <div className="text-[10px] text-secondary/60 uppercase tracking-wide">Given</div>
              </div>
              <div className="text-center flex-1">
                <div className="text-lg font-bold text-secondary">100%</div>
                <div className="text-[10px] text-secondary/60 uppercase tracking-wide">Genuine</div>
              </div>
            </div>

            {/* Primary Action */}
            <button
              onClick={handleContinue}
              className="w-full group bg-primary text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 hover:bg-primary/90 hover:shadow-primary/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span>Enter Store</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Right Image - HIDDEN ON MOBILE */}
          {/* Only visible on large screens to keep mobile clean */}
          <div className="hidden lg:flex lg:col-span-2 bg-gradient-to-br from-primary/5 to-primary/10 relative items-center justify-center p-8">
            <div className="relative w-full max-w-[200px] aspect-square">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
              <div className="relative bg-white p-6 rounded-3xl shadow-xl border border-primary/10 flex flex-col items-center justify-center text-center h-full">
                <ShoppingBag className="w-16 h-16 text-primary mb-4" />
                <h3 className="font-bold text-secondary">Shop Smart</h3>
                <p className="text-xs text-secondary/60 mt-1">Save more with every order</p>
              </div>
              
              {/* Floating Badges */}
              <div className="absolute -top-4 -right-4 bg-white px-3 py-1.5 rounded-lg shadow-md border border-secondary/10 flex items-center gap-1.5 animate-bounce" style={{ animationDuration: '3s' }}>
                 <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                 <span className="text-xs font-bold text-secondary">Best Prices</span>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white px-3 py-1.5 rounded-lg shadow-md border border-secondary/10 flex items-center gap-1.5 animate-bounce" style={{ animationDuration: '4s' }}>
                 <Gift className="w-3 h-3 text-primary" />
                 <span className="text-xs font-bold text-secondary">Free Gifts</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Minimalist Modal Popup */}
      {activePopup && (
        <div className="absolute inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-4">
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
            onClick={() => setActivePopup(null)}
          />
          <div className="relative bg-white w-full sm:w-[350px] rounded-t-3xl sm:rounded-3xl p-6 animate-slideUp sm:animate-scaleIn shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-lg font-bold text-secondary">
                {popups[activePopup as keyof typeof popups].icon}
                {popups[activePopup as keyof typeof popups].title}
              </div>
              <button 
                onClick={() => setActivePopup(null)}
                className="p-1 rounded-full hover:bg-secondary/5 transition-colors"
              >
                <X className="w-5 h-5 text-secondary/50" />
              </button>
            </div>
            
            {popups[activePopup as keyof typeof popups].content}

            <button
              onClick={() => setActivePopup(null)}
              className="w-full mt-4 py-3 text-secondary/60 text-sm font-medium hover:text-secondary transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-slideUp { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-scaleIn { animation: scaleIn 0.2s ease-out; }
      `}</style>
    </div>
  );
}