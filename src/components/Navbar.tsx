"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/#offers", label: "Offers" },
    { href: "/coins", label: "Coins" },
    { href: "/winners", label: "Winners" },
    { href: "/#contact", label: "Contact" },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white fixed w-full z-50 top-0 border-b border-gray-100 py-4">
      <div className="max-w-7xl flex items-center justify-between mx-auto px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">RK</span>
          </div>
          <span className="text-lg font-semibold text-primary">
            रवि किराना
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-lg font-medium transition-colors duration-300 ${
                isActive(item.href) ? "text-primary" : "text-secondary hover:text-primary"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden md:flex">
          <a
            href="#enquiry"
            className="bg-primary text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors duration-300"
          >
            Enquiry
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 text-secondary hover:text-primary transition-colors duration-300"
        >
          {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-lg">
          <div className="px-4 py-4 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block py-3 px-4 rounded-lg text-base font-medium transition-colors duration-300 ${
                  isActive(item.href) 
                    ? "text-primary bg-accent" 
                    : "text-secondary hover:text-primary hover:bg-accent"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-gray-100">
              <a
                href="#enquiry"
                className="block bg-primary text-white text-center py-3 px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Make Enquiry
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}