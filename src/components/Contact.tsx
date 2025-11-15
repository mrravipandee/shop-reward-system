import { Phone, MapPin, Clock, MessageCircle, Send, Navigation, Star, Truck, Award } from "lucide-react";

export default function Contact() {
  const contactMethods = [
    {
      icon: Phone,
      title: "Call Us",
      description: "Speak directly with our staff",
      action: "tel:+919876543210",
      label: "Call Now",
      primary: true
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      description: "Quick replies, order via chat",
      action: "https://wa.me/919876543210",
      label: "Message",
      primary: true
    },
    {
      icon: Navigation,
      title: "Directions",
      description: "Get store location & route",
      action: "https://maps.google.com/?q=Near+Main+Market+Nashik+Maharashtra+422009",
      label: "Navigate",
      primary: false
    },
    {
      icon: Send,
      title: "Enquire",
      description: "Ask about products & offers",
      action: "#offers",
      label: "Ask Now",
      primary: false
    }
  ];

  const storeInfo = [
    {
      icon: MapPin,
      title: "Store Location",
      content: "Near Main Market, Nashik, Maharashtra – 422009",
      subtext: "Easy to find, central location"
    },
    {
      icon: Clock,
      title: "Opening Hours",
      content: "7:00 AM – 2:00 PM • 4:00 PM – 10:00 PM",
      subtext: "Open now • 7 days a week"
    },
    {
      icon: Star,
      title: "Store Features",
      content: "Free Delivery • Rewards • Fresh Stock",
      subtext: "Serving since 2010"
    }
  ];

  return (
    <section id="contact" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-accent to-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4 sm:mb-6">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-primary font-semibold text-sm">We&apos;re Open Now</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
            Visit Us <span className="text-primary">Today</span> 🏪
          </h2>
          <p className="text-gray-600 text-base sm:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
            Your trusted neighborhood store in Nashik. Come experience the best quality groceries 
            with exclusive rewards on every purchase.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-start">
          
          {/* Left - Contact Cards */}
          <div className="space-y-6 sm:space-y-8">
            
            {/* Store Highlights */}
            <div className="grid gap-4 sm:gap-6">
              {storeInfo.map((item, index) => (
                <div 
                  key={index}
                  className="group bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 hover:border-primary/30 transition-all duration-300 hover:shadow-lg"
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="p-2 sm:p-3 bg-primary/10 rounded-lg sm:rounded-xl group-hover:bg-primary/20 transition-colors duration-300 flex-shrink-0">
                      <item.icon className="text-primary w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-1 sm:mb-2">{item.title}</h3>
                      <p className="text-gray-700 text-sm sm:text-base mb-1 leading-relaxed">{item.content}</p>
                      <p className="text-primary text-xs sm:text-sm font-medium">{item.subtext}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Methods Grid */}
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
              {contactMethods.map((method, index) => (
                <a
                  key={index}
                  href={method.action}
                  target={method.action.includes('http') ? '_blank' : undefined}
                  rel={method.action.includes('http') ? 'noopener noreferrer' : undefined}
                  className={`group relative overflow-hidden rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all duration-300 ${
                    method.primary 
                      ? 'bg-primary text-white hover:shadow-xl hover:scale-105' 
                      : 'bg-white border border-gray-200 text-primary hover:border-primary hover:shadow-lg'
                  }`}
                >
                  {/* Background Animation */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                    method.primary ? 'bg-gradient-to-br from-primary to-purple-600' : 'bg-primary/5'
                  }`}></div>
                  
                  <div className="relative z-10">
                    <div className={`inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl mb-3 sm:mb-4 ${
                      method.primary ? 'bg-white/20' : 'bg-primary/10'
                    }`}>
                      <method.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${method.primary ? 'text-white' : 'text-primary'}`} />
                    </div>
                    <h3 className={`font-bold text-base sm:text-lg mb-1 sm:mb-2 ${method.primary ? 'text-white' : 'text-gray-900'}`}>
                      {method.title}
                    </h3>
                    <p className={`text-xs sm:text-sm mb-3 sm:mb-4 ${method.primary ? 'text-white/90' : 'text-gray-600'} leading-relaxed`}>
                      {method.description}
                    </p>
                    <span className={`inline-flex items-center gap-1 sm:gap-2 font-semibold text-xs sm:text-sm ${
                      method.primary ? 'text-white' : 'text-primary'
                    } group-hover:gap-2 sm:group-hover:gap-3 transition-all duration-300`}>
                      {method.label}
                      <Navigation className="w-3 h-3 sm:w-4 sm:h-4 rotate-90" />
                    </span>
                  </div>
                </a>
              ))}
            </div>

            {/* Delivery Info */}
            <div className="bg-gradient-to-r from-primary to-purple-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white text-center">
              <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <Truck className="w-3 h-3 text-white" />
                </div>
                <h4 className="font-bold text-base sm:text-lg">Free Home Delivery</h4>
              </div>
              <p className="text-white/90 text-xs sm:text-sm leading-relaxed">
                Orders above ₹200 within 2km radius • Same day delivery available
              </p>
            </div>

          </div>

          {/* Right - Map Section */}
          <div className="space-y-4 sm:space-y-6">
            
            {/* Map Container */}
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/20 rounded-2xl sm:rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              <div className="w-full h-64 sm:h-80 lg:h-96 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg sm:shadow-xl border-2 border-white group-hover:border-primary/20 transition-all duration-300">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3768.263735820992!2d73.7906!3d19.9975!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bdd9b3b06d87a41%3A0xd98b703f9aefefed!2sNashik%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1699534000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-xl sm:rounded-2xl"
                  title="Ravi Kirana Store Location"
                />
              </div>
              
              {/* Map Overlay Info */}
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 bg-white/95 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-lg border border-white/20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm sm:text-base">Ravi Kirana Store</p>
                    <p className="text-gray-600 text-xs sm:text-sm truncate">Near Main Market, Nashik</p>
                  </div>
                  <a 
                    href="https://maps.google.com/?q=Near+Main+Market+Nashik+Maharashtra+422009"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-primary text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold hover:bg-primary/90 transition-colors duration-300 whitespace-nowrap text-center"
                  >
                    Open Map
                  </a>
                </div>
              </div>
            </div>

            {/* Store Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 text-center">
              {[
                { number: "14+", label: "Years Serving", icon: Award },
                { number: "500+", label: "Happy Customers", icon: Star },
                { number: "24/7", label: "Support", icon: Phone }
              ].map((stat, index) => (
                <div key={index} className="bg-white rounded-xl p-3 sm:p-4 border border-gray-200 hover:border-primary/30 transition-colors duration-300">
                  <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary mx-auto mb-1 sm:mb-2" />
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-primary">{stat.number}</div>
                  <div className="text-gray-600 text-xs sm:text-sm">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Quick Tips */}
            <div className="space-y-3">
              <div className="bg-accent rounded-xl p-3 sm:p-4 border border-primary/10">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-gray-700 text-xs sm:text-sm font-medium">
                      <span className="text-primary font-semibold">Pro Tip:</span> Call ahead to check product availability & current offers!
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Tip */}
              <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-200">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-gray-700 text-xs sm:text-sm">
                      <span className="font-semibold">Best Time to Visit:</span> Morning 8-10 AM for fresh stock
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}