"use client";

import { useState } from "react";
import { 
  User, Calendar, Phone, Lock, Eye, EyeOff, UserPlus, ArrowRight 
} from "lucide-react";

// Assuming PasswordStrengthMeter.tsx is imported
import PasswordStrengthMeter from './PasswordStrengthMeter'; 

// TypeScript Interfaces
interface RegisterFormState {
  name: string;
  dob: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface PasswordInputProps {
    id: string;
    name: keyof RegisterFormState;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    showPassword: boolean;
    setShowPassword: (show: boolean) => void;
}

// Helper Component for Password Inputs (reused from previous step)
const PasswordInput: React.FC<PasswordInputProps> = ({ 
    id, name, placeholder, value, onChange, showPassword, setShowPassword 
}) => {
    const isPasswordField = name === 'password';
    
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                {placeholder.split('(')[0].trim()}
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    id={id}
                    name={name}
                    type={showPassword ? "text" : "password"}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    autoComplete={isPasswordField ? "new-password" : "off"}
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
            {/* Display strength meter only for the main password field */}
            {isPasswordField && <PasswordStrengthMeter password={value} />}
        </div>
    );
};

// Main Component
export default function RegisterForm() {
  const [form, setForm] = useState<RegisterFormState>({
    name: "",
    dob: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === "phone") {
       const numericValue = value.replace(/\D/g, '');
       if (numericValue.length <= 10) {
         setForm((prev) => ({ ...prev, [name]: numericValue }));
       }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const { name, dob, phone, password, confirmPassword } = form;

    // --- Validation Checks ---
    if (!name || !dob || !phone || !password || !confirmPassword) {
      setError("Please fill all required fields");
      setIsLoading(false);
      return;
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError("Please enter a valid 10-digit mobile number");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }
    
    // Check if password meets minimum complexity required by the meter (e.g., 8 characters)
    if (password.length < 8) {
        setError("Password must be at least 8 characters long");
        setIsLoading(false);
        return;
    }
    // --- End Validation ---

    // Simulate API Call
    setTimeout(() => {
      alert(`User ${name} Registered Successfully (UI only)`);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8"> 
      <div className="sm:mx-auto sm:w-full sm:max-w-xl mt-12"> {/* Increased max-w-xl for laptop */}
        {/* Header Section */}
        <div className="mx-auto h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
          <UserPlus className="h-6 w-6 text-indigo-600" />
        </div>
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Create Your Account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Join us and get started!
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-xl sm:px-10 border border-gray-100">
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Input fields */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2"> {/* Added responsive grid for laptop view */}
                
                {/* Full Name Input */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="name" name="name" type="text" autoComplete="name" placeholder="John Doe"
                      value={form.name} onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                    />
                  </div>
                </div>

                {/* Date of Birth Input */}
                <div>
                  <label htmlFor="dob" className="block text-sm font-medium text-gray-700">Date of Birth</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="dob" name="dob" type="date" max={new Date().toISOString().split("T")[0]}
                      value={form.dob} onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Mobile Number Input */}
                <div className="md:col-span-2"> {/* Takes full width on laptop */}
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Mobile Number</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="phone" name="phone" type="tel" autoComplete="tel" placeholder="Mobile Number"
                      value={form.phone} onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                    />
                  </div>
                </div>
            </div>
            {/* End responsive grid */}

            {/* Password Fields */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <PasswordInput
                    id="password" name="password" placeholder="Password (min 8 characters)"
                    value={form.password} onChange={handleChange}
                    showPassword={showPassword} setShowPassword={setShowPassword}
                />

                <PasswordInput
                    id="confirmPassword" name="confirmPassword" placeholder="Confirm Password"
                    value={form.confirmPassword} onChange={handleChange}
                    showPassword={showPassword} setShowPassword={setShowPassword}
                />
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-md bg-red-50 p-3">
                <p className="text-sm font-medium text-red-700">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                "Registering..."
              ) : (
                <>
                  Create Account <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500 underline">
                Login here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}