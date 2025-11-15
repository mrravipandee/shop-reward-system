import { Coins, Gift, IndianRupee, Star } from "lucide-react";

const features = [
  {
    icon: <Coins className="text-primary w-8 h-8 sm:w-10 sm:h-10 mb-3" />,
    title: "Earn Coins on Every Purchase",
    desc: "Get coins on every ₹30+ purchase! The more you shop, the more coins you earn — redeem them later for discounts.",
  },
  {
    icon: <Gift className="text-primary w-8 h-8 sm:w-10 sm:h-10 mb-3" />,
    title: "Free Gift on Big Shopping",
    desc: "Shop ₹500+ and get a free gift worth ₹10–₹20! The perfect surprise with every big purchase.",
  },
  {
    icon: <IndianRupee className="text-primary w-8 h-8 sm:w-10 sm:h-10 mb-3" />,
    title: "Instant Cash Bonus",
    desc: "Spend ₹500 or more and get instant bonus coins — earn 50+ coins instantly added to your wallet.",
  },
  {
    icon: <Star className="text-primary w-8 h-8 sm:w-10 sm:h-10 mb-3" />,
    title: "Lucky of the Day",
    desc: "Shop daily ₹50+ and get a chance to win today's lucky reward — your purchase up to ₹50 could be free!",
  },
];

export default function Features() {
  return (
    <section
      id="offers"
      className="bg-gradient-to-b from-white to-gray-50 py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 text-center"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary font-medium text-sm sm:text-base mb-4 sm:mb-6">
            <Star className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Exclusive Rewards</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
            Our Special <span className="text-primary">Rewards & Features</span> 🎉
          </h2>
          
          <p className="text-gray-600 text-base sm:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
            Shop more, save more! Enjoy exclusive rewards and benefits every time you visit Ravi Kirana Store.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary/20 group transform hover:-translate-y-2"
            >
              {/* Icon Container */}
              <div className="flex justify-center mb-4 sm:mb-6">
                <div className="p-3 sm:p-4 bg-primary/10 rounded-xl sm:rounded-2xl group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110">
                  {feature.icon}
                </div>
              </div>
              
              {/* Content */}
              <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 group-hover:text-primary transition-colors duration-300 leading-tight">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm lg:text-base leading-relaxed sm:leading-loose">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-primary/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-primary/10 hover:border-primary/20 transition-all duration-300">
            <div className="flex items-start sm:items-center">
              <div className="flex-shrink-0 bg-primary/10 p-2 sm:p-3 rounded-lg mr-3 sm:mr-4">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              <p className="text-gray-700 text-sm sm:text-base lg:text-lg text-left flex-1">
                <span className="font-semibold text-primary">Note:</span> All rewards are automatically applied at checkout. 
                No coupons needed! Just shop and enjoy the benefits.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-12 sm:mt-16 lg:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-2xl mx-auto">
          {[
            { number: "500+", label: "Happy Customers" },
            { number: "14+", label: "Years Trusted" },
            { number: "24/7", label: "Support" },
            { number: "100%", label: "Satisfaction" },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100 shadow-sm text-center"
            >
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary mb-1 sm:mb-2">
                {stat.number}
              </div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-12 sm:mt-16 text-center">
          <p className="text-gray-600 text-sm sm:text-base mb-6 sm:mb-8">
            Ready to start earning rewards?
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <a
              href="#contact"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
            >
              Visit Store Today
            </a>
            <a
              href="tel:+919876543210"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border border-primary text-primary font-semibold rounded-xl hover:bg-primary hover:text-white transition-all duration-300 text-sm sm:text-base"
            >
              Call for Delivery
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}