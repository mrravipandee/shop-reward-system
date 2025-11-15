import Image from "next/image";
import { Clock, MapPin, Phone } from "lucide-react";

export default function About() {
  return (
    <section id="about" className="py-16 px-4 sm:px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          
          {/* Image Section */}
          <div className="lg:w-1/2">
            <div className="relative">
              <Image
                src="/images/ravikirana-about.png"
                alt="Ravi Kirana Store - Nashik"
                width={500}
                height={500}
                className="rounded-lg shadow-lg"
                priority
              />
              <div className="absolute -bottom-4 -right-4 bg-black text-white px-4 py-2 rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>Since 2010</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="lg:w-1/2 space-y-6">
            {/* Header */}
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Ravi Kirana & General Store
              </h2>
              <div className="w-20 h-1 bg-black mb-6"></div>
            </div>

            {/* Description */}
            <div className="space-y-4 text-gray-600">
              <p className="text-lg">
                Your trusted neighborhood store in Nashik for daily essentials, groceries, 
                and household items.
              </p>
              <p>
                We believe in quality products, fair prices, and building lasting relationships 
                with our community.
              </p>
            </div>

            {/* Opening Hours */}
            <div className="bg-gray-50 p-6 rounded-lg border">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-5 h-5 text-black" />
                <h3 className="font-semibold text-gray-900">Opening Hours</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Morning</span>
                  <span className="font-medium">7:00 AM - 2:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Evening</span>
                  <span className="font-medium">4:00 PM - 10:00 PM</span>
                </div>
              </div>
            </div>

            {/* Contact & Location */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-3 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Nashik, Maharashtra</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Phone className="w-4 h-4" />
                <span className="text-sm">+91 98765 43210</span>
              </div>
            </div>

            {/* CTA */}
            <div className="flex gap-4 pt-4">
              <a
                href="#offers"
                className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition"
              >
                View Offers
              </a>
              <a
                href="#contact"
                className="border border-black text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
              >
                Get Directions
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}