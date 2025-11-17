"use client";
import { useState, useRef } from "react";
import { User, Camera, Phone, Calendar, Upload } from "lucide-react";

interface CustomerRegistrationProps {
  customerPhone: string;
  onSubmit: (customerData: any) => void;
  onBack: () => void;
}

export default function CustomerRegistration({ customerPhone, onSubmit, onBack }: CustomerRegistrationProps) {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhoto(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const customerData = {
      phone: customerPhone,
      name: name.trim(),
      dob,
      photo,
      registeredAt: new Date().toISOString()
    };

    onSubmit(customerData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-w-md w-full">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-bold text-secondary mb-2">
              Complete Profile
            </h1>
            <p className="text-secondary/80 text-sm">
              Welcome! Let&apos;s set up your rewards account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Phone Number (Read-only) */}
            <div>
              <label className="block text-secondary font-medium mb-2">
                Mobile Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary/40 w-5 h-5" />
                <input
                  type="text"
                  value={customerPhone}
                  readOnly
                  className="w-full pl-10 pr-4 py-3 border border-secondary/20 rounded-xl bg-secondary/5 text-secondary/60"
                />
              </div>
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-secondary font-medium mb-3">
                Profile Photo
              </label>
              <div className="flex justify-center">
                <div 
                  className="w-24 h-24 rounded-2xl border-2 border-dashed border-secondary/20 flex items-center justify-center cursor-pointer hover:border-primary transition-colors duration-200 bg-secondary/5"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {photo ? (
                    <img 
                      src={photo} 
                      alt="Profile" 
                      className="w-full h-full rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <Camera className="w-6 h-6 text-secondary/40 mx-auto mb-1" />
                      <span className="text-secondary/40 text-xs">Upload</span>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-secondary font-medium mb-2">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary/40 w-5 h-5" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full pl-10 pr-4 py-3 border border-secondary/20 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-secondary font-medium mb-2">
                Date of Birth
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary/40 w-5 h-5" />
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-secondary/20 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all duration-200"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                type="submit"
                disabled={!name.trim()}
                className="w-full bg-primary text-white py-4 rounded-xl font-semibold hover:bg-primary/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Upload className="w-5 h-5" />
                Complete Registration
              </button>
              
              <button
                type="button"
                onClick={onBack}
                className="w-full border border-secondary/20 text-secondary py-3 rounded-xl font-medium hover:bg-secondary/5 transition-all duration-300"
              >
                Back to Scanner
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}