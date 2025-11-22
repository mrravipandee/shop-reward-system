import Image from "next/image";
import { Gift, Star, Users, Phone, Truck, Award } from "lucide-react";

export default function Hero() {
  const users = [
    {
      src: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=50",
      alt: "userImage1"
    },
    {
      src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=50",
      alt: "userImage2"
    },
    {
      src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=50&h=50&auto=format&fit=crop",
      alt: "userImage3"
    }
  ];

  const features = [
    { icon: Gift, text: "Reward Coins", color: "text-primary" },
    { icon: Truck, text: "Free Delivery", color: "text-primary" },
    { icon: Award, text: "Best Quality", color: "text-primary" },
    { icon: Phone, text: "24/7 Support", color: "text-primary" }
  ];

  return (
    <div className="relative bg-gray-50">
      {/* Background Pattern */}
      <div className="absolute bottom-0 right-0 overflow-hidden lg:inset-y-0">
        <Image 
          src="https://d33wubrfki0l68.cloudfront.net/1e0fc04f38f5896d10ff66824a62e466839567f8/699b5/images/hero/3/background-pattern.png" 
          alt="Background pattern"
          width={800}
          height={600}
          className="w-auto h-full"
        />
      </div>

      <section className="relative py-20 sm:py-16 lg:pt-20 lg:pb-36">
        <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 gap-y-8 lg:items-center lg:grid-cols-2 sm:gap-y-20 xl:grid-cols-5">
            {/* Left Content - Text Section */}
            <div className="text-center xl:col-span-2 lg:text-left md:px-16 lg:px-0">
              <div className="max-w-sm mx-auto sm:max-w-md md:max-w-full">
                
                {/* Trust Badge */}
                <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 mt-8 rounded-full text-primary font-medium text-base mb-8">
                  <Star className="w-5 h-5" />
                  <span>Trusted Since 2010</span>
                </div>

                {/* Main Heading */}
                <h1 className="text-4xl font-bold leading-tight text-gray-900 sm:text-5xl sm:leading-tight lg:text-6xl lg:leading-tight font-pj">
                  Welcome to <span className="text-primary">Ravi Kirana</span>
                </h1>
                <h2 className="text-2xl font-semibold text-gray-700 mt-4">
                  & General Store
                </h2>

                {/* Description */}
                <p className="mt-6 text-lg text-gray-600 leading-relaxed">
                  Your trusted neighborhood store for groceries and daily needs in Nashik.
                  <span className="font-semibold text-primary"> Earn coins, cashback, and free gifts</span> with every purchase.
                </p>

                {/* User Community Section */}
                <div className="mt-8 lg:mt-12 lg:flex lg:items-center">
                  <div className="flex justify-center flex-shrink-0 -space-x-4 overflow-hidden lg:justify-start">
                    {users.map((user) => (
                      <Image
                        key={user.alt}
                        src={user.src}
                        alt={user.alt}
                        width={56}
                        height={56}
                        className="inline-block rounded-full ring-2 ring-white"
                      />
                    ))}
                  </div>

                  <p className="mt-4 text-lg text-gray-900 lg:mt-0 lg:ml-4 font-pj">
                    Join with <span className="font-bold">500+ Happy Customers</span> in Nashik
                  </p>
                </div>

                {/* Features Grid */}
                <div className="mt-8 grid grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0">
                  {features.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
                    >
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <item.icon className={`w-5 h-5 ${item.color}`} />
                      </div>
                      <span className="text-base font-medium text-gray-900">{item.text}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="mt-8 sm:flex sm:items-center sm:justify-center lg:justify-start sm:space-x-5 lg:mt-12">
                  <a
                    href="#offers"
                    className="inline-flex items-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-primary border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary font-pj justif-center hover:bg-primary/90"
                    role="button"
                  >
                    View Offers
                  </a>

                  <a
                    href="tel:+919876543210"
                    className="inline-flex items-center px-6 py-4 mt-4 text-lg font-bold transition-all duration-200 bg-transparent border border-gray-300 sm:mt-0 font-pj justif-center rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 hover:bg-gray-200 focus:bg-gray-200 text-gray-900"
                    role="button"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Call Now
                  </a>
                </div>

                {/* Quick Stats */}
                <div className="flex justify-center lg:justify-start gap-8 pt-8 mt-8 border-t border-gray-200">
                  {[
                    { value: "14+", label: "Years" },
                    { value: "500+", label: "Products" },
                    { value: "24/7", label: "Support" }
                  ].map((stat, idx) => (
                    <div key={idx} className="text-center">
                      <div className="text-2xl font-bold text-primary">{stat.value}</div>
                      <div className="text-base text-gray-600">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Content - Image Section */}
            <div className="xl:col-span-3">
              <div className="relative w-full max-w-2xl mx-auto">
                {/* Main Store Image */}
                <Image
                  src="/images/ravikirana-hero.png"
                  alt="Ravi Kirana Store - Your Trusted Neighborhood Grocery Store in Nashik"
                  width={600}
                  height={500}
                  className="w-full rounded-2xl shadow-2xl scale-105"
                  priority
                />
                
                {/* Floating Badges */}
                <div className="absolute top-[-1.5rem] right-0 md:top-6 md:right-6 bg-primary text-white px-4 py-3 rounded-xl shadow-lg">
                  <div className="flex items-center gap-2 text-base font-semibold">
                    <Gift className="w-5 h-5" />
                    Rewards
                  </div>
                </div>
                <div className="absolute bottom-[-1.5rem] left-0 md:bottom-6 md:left-6 bg-secondary text-white px-4 py-3 rounded-xl shadow-lg">
                  <div className="flex items-center gap-2 text-base font-semibold">
                    <Award className="w-5 h-5" />
                    Cashback
                  </div>
                </div>
                <div className="absolute bottom-1 right-0 md:bottom-6 md:right-6 bg-white/95 border border-gray-200 px-4 py-3 rounded-xl shadow-lg flex items-center gap-3">
                  <Users className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-bold text-gray-900 text-base">500+</div>
                    <div className="text-gray-600 text-sm">Customers</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}