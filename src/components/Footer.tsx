import { Heart, Phone, MapPin, Clock, Star } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Offers", href: "#offers" },
    { name: "About", href: "#about" },
    { name: "Winners", href: "#winners" },
    { name: "Contact", href: "#contact" },
  ];

  const contactInfo = [
    {
      icon: MapPin,
      text: "Sanjeev Nagar, Nashik - 422010",
      href: "https://maps.google.com/?q=Near+Main+Market+Nashik+Maharashtra+422009"
    },
    {
      icon: Phone,
      text: "+91 70585 48204",
      href: "tel:+917058548204"
    },
    {
      icon: Clock,
      text: "7AM-2PM • 4PM-10PM",
      href: "#contact"
    }
  ];

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-8 sm:py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
            
            {/* Store Info */}
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Ravi Kirana Store</h3>
              </div>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
                Your trusted neighborhood store in Nashik since 2010. Quality groceries with exciting rewards on every purchase.
              </p>
              <div className="flex items-center justify-center md:justify-start gap-2 text-green-600 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium">Open Now</span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="text-center md:text-left">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Quick Links</h4>
              <ul className="space-y-2 sm:space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-600 hover:text-primary transition-colors duration-300 text-sm sm:text-base inline-flex items-center gap-2 group"
                    >
                      <div className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="text-center md:text-left">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Contact Us</h4>
              <div className="space-y-2 sm:space-y-3">
                {contactInfo.map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    target={item.href.includes('http') ? '_blank' : undefined}
                    rel={item.href.includes('http') ? 'noopener noreferrer' : undefined}
                    className="flex items-center justify-center md:justify-start gap-3 text-gray-600 hover:text-primary transition-colors duration-300 group text-sm sm:text-base"
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.text}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Store Features */}
            <div className="text-center md:text-left">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Why Choose Us</h4>
              <ul className="space-y-2 sm:space-y-3 text-gray-600 text-sm sm:text-base">
                <li className="flex items-center justify-center md:justify-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  Fresh Quality Products
                </li>
                <li className="flex items-center justify-center md:justify-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  Reward Coins System
                </li>
                <li className="flex items-center justify-center md:justify-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  Free Home Delivery
                </li>
                <li className="flex items-center justify-center md:justify-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  14+ Years Experience
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center">
            {/* Copyright */}
            <div className="flex items-center justify-center gap-2 text-gray-500 text-sm sm:text-base order-2 sm:order-1">
              <span>© {currentYear} Ravi Kirana Store</span>
              <Heart className="w-4 h-4 text-primary fill-current" />
              <span>All rights reserved</span>
            </div>

            {/* Made with love */}
            <div className="text-gray-500 text-sm sm:text-base order-1 sm:order-2">
              <span className="flex items-center justify-center gap-1">
                Made with 
                <Heart className="w-4 h-4 text-primary fill-current animate-pulse" />
                for our community
              </span>
            </div>

            {/* Policy Links */}
            <div className="flex items-center justify-center gap-4 text-gray-500 text-xs sm:text-sm order-3">
              <a href="#privacy" className="hover:text-primary transition-colors duration-300">
                Privacy
              </a>
              <span>•</span>
              <a href="#terms" className="hover:text-primary transition-colors duration-300">
                Terms
              </a>
            </div>
          </div>
        </div>

        {/* Floating CTA for Mobile */}
        <div className="lg:hidden fixed bottom-4 left-4 right-4 z-50">
          <a
            href="tel:+919876543210"
            className="bg-primary text-white px-6 py-4 rounded-xl font-semibold shadow-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 text-base"
          >
            <Phone className="w-5 h-5" />
            Call Now for Delivery
          </a>
        </div>
      </div>
    </footer>
  );
}