import Image from "next/image";
import { Trophy, Crown, Gift, IndianRupee, Sparkles, Star, Calendar } from "lucide-react";

const winners = [
  {
    name: "Ravi Sharma",
    prize: "₹50 Cashback",
    image: "/winner/winner-2.png",
    rank: "1st",
    icon: <Crown className="w-4 h-4 sm:w-5 sm:h-5" />,
    color: "bg-yellow-100 border-yellow-200 text-yellow-700",
    time: "10:30 AM"
  },
  {
    name: "Sneha Patel",
    prize: "Free Soap Gift",
    image: "/winner/winner-1.png",
    rank: "2nd",
    icon: <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />,
    color: "bg-gray-100 border-gray-200 text-gray-700",
    time: "11:15 AM"
  },
  {
    name: "Ajay Kumar",
    prize: "₹100 Bill Free",
    image: "/winner/winner-3.png",
    rank: "3rd",
    icon: <Gift className="w-4 h-4 sm:w-5 sm:h-5" />,
    color: "bg-orange-100 border-orange-200 text-orange-700",
    time: "2:45 PM"
  },
  {
    name: "Pooja More",
    prize: "₹30 Coins Reward",
    image: "/winner/winner-4.png",
    rank: "4th",
    icon: <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5" />,
    color: "bg-green-100 border-green-200 text-green-700",
    time: "4:20 PM"
  },
];

export default function Winners() {
  return (
    <section
      id="winners"
      className="bg-gradient-to-b from-white to-purple-50 py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 text-center"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary font-medium text-sm sm:text-base mb-4">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Daily Winners</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
            Today&apos;s <span className="text-primary">Lucky Winners</span> 🎉
          </h2>
          
          <p className="text-gray-600 text-base sm:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
            Congratulations to our amazing customers who shopped and won rewards today!  
            Be the next winner — shop daily and earn exciting prizes.
          </p>
        </div>

        {/* Date Banner */}
        <div className="max-w-md mx-auto mb-8 sm:mb-12">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-center gap-3 text-gray-700">
              <Calendar className="w-5 h-5 text-primary" />
              <span className="font-semibold text-sm sm:text-base">
                {new Date().toLocaleDateString('en-IN', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Winners Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-10 sm:mb-12 lg:mb-16">
          {winners.map((winner, index) => (
            <div
              key={index}
              className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary/20 group relative transform hover:-translate-y-2"
            >
              {/* Rank Badge */}
              <div className={`absolute -top-2 -right-2 sm:-top-3 sm:-right-3 ${winner.color} border-2 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center font-bold text-xs sm:text-sm z-10`}>
                <div className="flex items-center gap-1">
                  {winner.icon}
                  <span className="hidden xs:inline">{winner.rank}</span>
                </div>
              </div>

              {/* Winner Image */}
              <div className="relative w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 mx-auto mb-3 sm:mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-400/20 rounded-full blur-sm sm:blur-md"></div>
                <Image
                  src={winner.image}
                  alt={winner.name}
                  fill
                  className="object-cover rounded-full border-4 border-white shadow-lg z-10 relative group-hover:scale-110 transition-transform duration-300"
                  sizes="(max-width: 640px) 80px, (max-width: 1024px) 112px, 128px"
                />
                {/* Shine effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 z-20"></div>
              </div>

              {/* Winner Details */}
              <div className="space-y-2 sm:space-y-3">
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-800 group-hover:text-primary transition-colors duration-300 leading-tight">
                  {winner.name}
                </h3>
                
                <div className="flex items-center justify-center gap-1 sm:gap-2 text-primary font-semibold">
                  <IndianRupee className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-sm sm:text-base lg:text-lg">{winner.prize}</span>
                </div>

                <div className="flex items-center justify-center gap-1 text-gray-500 text-xs">
                  <Clock className="w-3 h-3" />
                  <span>{winner.time}</span>
                </div>

                <div className="pt-2">
                  <span className="inline-flex items-center gap-1 bg-primary/5 text-primary rounded-full py-1 px-3 text-xs font-medium">
                    <Star className="w-3 h-3" />
                    Lucky Customer
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="max-w-4xl mx-auto mb-8 sm:mb-12">
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm border border-gray-100">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-center">
              {[
                { number: "50+", label: "Daily Winners" },
                { number: "₹1000+", label: "Rewards Given" },
                { number: "500+", label: "Happy Customers" },
                { number: "24/7", label: "Rewards Active" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary mb-1 sm:mb-2">
                    {stat.number}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <p className="text-gray-600 text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 font-medium">
            Your next purchase could make you a winner! 🎊
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <a
              href="#offers"
              className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
            >
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              Be the Next Winner
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 border border-primary text-primary px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold hover:bg-primary hover:text-white transition-all duration-300 text-sm sm:text-base"
            >
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
              Daily Updates
            </a>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 sm:mt-12 max-w-2xl mx-auto">
          <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
            <p className="text-gray-700 text-sm sm:text-base">
              <span className="font-semibold text-primary">Note:</span> Winners are selected randomly throughout the day. 
              Shop any amount to get a chance to win exciting rewards!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// Add the missing Clock component import
const Clock = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);