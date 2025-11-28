import { Heart, Phone, MapPin, Clock, XCircle, CheckCircle } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Primary Accent Color: Indigo
  const PRIMARY_COLOR_CLASSES = "text-indigo-600";
  const PRIMARY_BG_CLASSES = "bg-indigo-600";
  const PRIMARY_HOVER_CLASSES = "hover:text-indigo-800";
  
  const quickLinks = [
    { name: "Offers & Deals", href: "#offers" },
    { name: "About Our Store", href: "#about" },
    { name: "Winner Hall of Fame", href: "#winners" },
    { name: "Get in Touch", href: "#contact" },
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
      text: "Open: 7AM-2PM • 4PM-10PM",
      href: "#hours"
    }
  ];

  // --- Utility Function for Store Status (FIXED for Timezone) ---
  const getStoreStatus = () => {
    // Define the store's timezone (India Standard Time)
    const targetTimezone = 'Asia/Kolkata';
    const now = new Date();

    // Use Intl.DateTimeFormat to get the current hour and minute in the target timezone
    // hourCycle: 'h23' ensures the hour is 0-23
    const options: Intl.DateTimeFormatOptions = {
        hour: 'numeric',
        minute: 'numeric',
        hourCycle: 'h23', 
        timeZone: targetTimezone
    };
    
    // Extract hour and minute components
    const formatter = new Intl.DateTimeFormat('en-US', options);
    const parts = formatter.formatToParts(now);
    
    let currentHour = 0;
    let currentMinute = 0;
    
    for (const part of parts) {
        if (part.type === 'hour') {
            currentHour = parseInt(part.value, 10);
        } else if (part.type === 'minute') {
            currentMinute = parseInt(part.value, 10);
        }
    }
    
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    // Slot 1: 7:00 AM (420 min) to 2:00 PM (840 min)
    const slot1Start = 7 * 60;   // 420
    const slot1End = 14 * 60;    // 840

    // Slot 2: 4:00 PM (960 min) to 10:00 PM (1320 min)
    const slot2Start = 16 * 60;  // 960
    const slot2End = 22 * 60;   // 1320

    const isOpen = 
      (currentTimeInMinutes >= slot1Start && currentTimeInMinutes < slot1End) ||
      (currentTimeInMinutes >= slot2Start && currentTimeInMinutes < slot2End);

    return {
      isOpen,
      statusText: isOpen ? "Currently Open" : "Closed Now",
      icon: isOpen ? CheckCircle : XCircle,
      colorClass: isOpen ? "text-green-600" : "text-red-500",
      dotClass: isOpen ? "bg-green-500" : "bg-red-500",
    };
  };

  const storeStatus = getStoreStatus();

  return (
    // Use a light gray border for separation
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content Grid */}
        <div className="py-12 md:py-16 lg:py-20">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-8 sm:gap-12">
            
            {/* 1. Store Identity & Description */}
            <div className="col-span-2 md:col-span-1 text-left">
              <div className="flex items-center gap-3 mb-4">
                {/* Store Name with Marathi text (assuming primary is set to indigo-600) */}
                <h3 className={`text-xl font-extrabold ${PRIMARY_COLOR_CLASSES} tracking-tight`}>
                  रवि किराना
                </h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Your reliable neighborhood grocery store in Nashik since 2010. We prioritize quality products and customer rewards.
              </p>
              
              {/* Dynamic Store Status Badge */}
              <div className={`flex items-center gap-2 text-sm font-semibold ${storeStatus.colorClass}`}>
                <storeStatus.icon className="w-4 h-4" />
                <span>{storeStatus.statusText}</span>
              </div>
              
            </div>

            {/* 2. Quick Links */}
            <div className="text-left">
              <h4 className="text-base font-bold text-gray-900 mb-5 border-b-2 border-indigo-100 pb-1 inline-block">
                Navigation
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className={`text-gray-600 ${PRIMARY_HOVER_CLASSES} transition-all duration-300 text-sm font-medium hover:underline hover:font-semibold`}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. Contact Info */}
            <div className="text-left">
              <h4 className="text-base font-bold text-gray-900 mb-5 border-b-2 border-indigo-100 pb-1 inline-block">
                Get in Touch
              </h4>
              <div className="space-y-3">
                {contactInfo.map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    target={item.href.includes('http') ? '_blank' : undefined}
                    rel={item.href.includes('http') ? 'noopener noreferrer' : undefined}
                    className={`flex items-start gap-3 text-gray-600 ${PRIMARY_HOVER_CLASSES} transition-colors duration-300 group text-sm font-medium`}
                  >
                    <item.icon className={`w-4 h-4 flex-shrink-0 mt-1 ${PRIMARY_COLOR_CLASSES}`} />
                    <span>{item.text}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* 4. Store USPs/Features */}
            <div className="text-left">
              <h4 className="text-base font-bold text-gray-900 mb-5 border-b-2 border-indigo-100 pb-1 inline-block">
                Our Commitments
              </h4>
              <ul className="space-y-3 text-gray-600 text-sm font-medium">
                <li className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 ${PRIMARY_BG_CLASSES} rounded-full`}></div>
                  Fresh, Certified Products
                </li>
                <li className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 ${PRIMARY_BG_CLASSES} rounded-full`}></div>
                  Exclusive Rewards Program
                </li>
                <li className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 ${PRIMARY_BG_CLASSES} rounded-full`}></div>
                  Reliable Home Delivery
                </li>
                <li className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 ${PRIMARY_BG_CLASSES} rounded-full`}></div>
                  14+ Years Trusted Service
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar (Professional and Simple) */}
        <div className="border-t border-gray-100 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center">
            
            {/* Copyright and Policy */}
            <div className="flex flex-col sm:flex-row items-center gap-4 text-gray-500 text-sm order-2 md:order-1">
                {/* Copyright */}
                <div className="flex items-center gap-1.5">
                    <span>© {currentYear} Ravi Kirana Store. All rights reserved.</span>
                </div>
                {/* Separator and Policy Links */}
                <span className="hidden sm:inline-block text-gray-300">•</span>
                <div className="flex items-center gap-4">
                    <a href="#privacy" className={`hover:underline ${PRIMARY_HOVER_CLASSES}`}>
                        Privacy Policy
                    </a>
                    <a href="#terms" className={`hover:underline ${PRIMARY_HOVER_CLASSES}`}>
                        Terms of Service
                    </a>
                </div>
            </div>

            {/* Made with Ravi Pandey link */}
            <div className="text-gray-500 text-xs sm:text-sm order-1 md:order-2">
              <span className="flex items-center gap-1.5">
                Made with 
                <Heart className={`w-4 h-4 ${PRIMARY_COLOR_CLASSES} fill-indigo-400 animate-pulse`} />
                by 
                <a 
                    href="https://raviverse.dev" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`font-semibold ${PRIMARY_COLOR_CLASSES} hover:underline`}
                >
                    Ravi Pandey
                </a>
              </span>
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
}