"use client";

import { useState } from "react";
import {
  Phone,
  Calendar,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  LogIn
} from "lucide-react";

// 1. Define strict types for your form state
interface LoginFormState {
  phone: string;
  dob: string;
  password: string;
}

export default function LoginForm() {
  // State management
  const [form, setForm] = useState<LoginFormState>({
    phone: "",
    dob: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Function to format the 10-digit number into 5-5 chunks for display
  const formatPhoneNumber = (number: string): string => {
    if (number.length <= 5) return number;
    return `${number.slice(0, 5)} ${number.slice(5, 10)}`;
  };

  // 2. Proper Type for Input Change Events
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Specific logic for phone to allow only numbers and restrict length
    if (name === "phone") {
      const numericValue = value.replace(/\D/g, '');
      if (numericValue.length <= 10) {
        setForm((prev) => ({ ...prev, [name]: numericValue }));
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }

    setError(""); // Clear error on typing
  };

  // 3. Updated Form Submission Logic to call the backend endpoint
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload
    setError("");
    setIsLoading(true);

    const { phone, dob, password } = form;

    // Client-side Validation Logic
    if (!phone || !dob || !password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError("Please enter a valid 10-digit mobile number");
      setIsLoading(false);
      return;
    }
    // End Validation

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Send the form data as a JSON string
        body: JSON.stringify({ phone, dob, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Show success message
        setError("");

        // Save token/session returned from backend
        if (data.token) {
          localStorage.setItem("authToken", data.token);
        }

        // Redirect to dashboard or homepage
        window.location.href = "/coins";

      } else {
        setError(data.error || "Invalid credentials");
      }

    } catch (err) {
      console.error("Fetch error:", err);
      setError("Network error or server connection failed.");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Container increased to sm:max-w-xl for a wider layout on laptops */}
      <div className="sm:mx-auto sm:w-full sm:max-w-xl mt-12">
        {/* Header Section */}
        <div className="mx-auto h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
          <LogIn className="h-6 w-6 text-indigo-600" />
        </div>
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Welcome Back
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Login to access your dashboard
        </p>
      </div>

      {/* Main Form Container */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-xl sm:px-10 border border-gray-100">

          <form className="space-y-6" onSubmit={handleSubmit}>

            {/* Phone Input with +91 Prefix */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Mobile Number
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">

                {/* Visual +91 Prefix */}
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center border-r border-gray-300 pr-2 pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-700 font-medium">+91</span>
                </div>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  // Use the formatting helper for the displayed value
                  value={formatPhoneNumber(form.phone)}
                  onChange={handleChange}
                  // Input padding is adjusted to account for the +91 prefix
                  className="block w-full pl-24 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg transition-colors tracking-wide"
                  placeholder="55555 55555"
                />
              </div>
            </div>

            {/* Date of Birth Input */}
            <div>
              <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
                Date of Birth
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="dob"
                  name="dob"
                  type="date"
                  max={new Date().toISOString().split("T")[0]} // Prevent future dates
                  value={form.dob}
                  onChange={handleChange}
                  // Using Indigo for focus colors
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  // Using Indigo for focus colors
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              <div className="flex justify-end mt-1">
                <a href="/forgot-password" className="text-xs font-medium text-indigo-600 hover:text-indigo-500">
                  Forgot password?
                </a>
              </div>
            </div>

            {/* Error/Success Message */}
            {error && (
              <div className={`rounded-lg p-4 ${error.includes('successful') || error.includes('Redirecting') ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className="flex">
                  <div className="ml-3">
                    <h3 className={`text-sm font-medium ${error.includes('successful') || error.includes('Redirecting') ? 'text-green-800' : 'text-red-800'}`}>
                      {error.includes('successful') || error.includes('Redirecting') ? 'Success' : 'Error'}
                    </h3>
                    <div className={`text-sm ${error.includes('successful') || error.includes('Redirecting') ? 'text-green-700' : 'text-red-700'} mt-1`}>{error}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              // Using Indigo for button colors
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                <span className="flex items-center">
                  Signing In...
                  {/* Basic loading spinner */}
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
              ) : (
                <>
                  Sign In <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer for navigation */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  New to the platform?
                </span>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-3">
              <a
                href="/register"
                className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Create an account
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}