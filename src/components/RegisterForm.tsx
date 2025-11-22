"use client";

import { useState, useMemo } from "react";
import { 
  User, Calendar, Phone, Lock, Eye, EyeOff, UserPlus, ArrowRight, Image as ImageIcon 
} from "lucide-react";

// --- START: Integrated Password Strength Logic and Component ---
// Define the strength criteria interface
interface StrengthCriteria {
  length: boolean;
  uppercase: boolean;
  number: boolean;
  symbol: boolean;
}

// Function to calculate strength criteria
const checkStrength = (password: string): StrengthCriteria => ({
  length: password.length >= 8,
  uppercase: /[A-Z]/.test(password),
  number: /[0-9]/.test(password),
  symbol: /[!@#$%^&*()]/.test(password),
});

// Function to determine overall strength score
const calculateScore = (criteria: StrengthCriteria): number => {
  return Object.values(criteria).filter(Boolean).length;
};

interface PasswordStrengthMeterProps {
  password: string;
}

// Inline Password Strength Meter Component
const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  if (!password) {
    return null;
  }

  const criteria = checkStrength(password);
  const score = calculateScore(criteria);

  let strengthText = 'Too Weak';
  let strengthColor = 'bg-red-500';

  if (score === 2) {
    strengthText = 'Weak';
    strengthColor = 'bg-orange-500';
  } else if (score === 3) {
    strengthText = 'Good';
    strengthColor = 'bg-yellow-500';
  } else if (score === 4) {
    strengthText = 'Strong';
    strengthColor = 'bg-green-500';
  } 

  // Bar width calculation
  const barWidth = `${(score / 4) * 100}%`;

  return (
    <div className="mt-2 space-y-2">
      {/* Strength Bar */}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-500 ${strengthColor}`} 
          style={{ width: barWidth }}
        />
      </div>
      
      {/* Feedback Text */}
      <p className={`text-xs font-semibold ${score < 4 ? 'text-gray-500' : 'text-green-600'}`}>
        Strength: <span className="font-bold">{strengthText}</span>
      </p>

      {/* Criteria List */}
      <div className="grid grid-cols-2 gap-1 text-xs text-gray-500">
        <span className={`flex items-center ${criteria.length ? 'text-green-600' : ''}`}>
          {criteria.length ? '✔' : '•'} 8 Characters
        </span>
        <span className={`flex items-center ${criteria.uppercase ? 'text-green-600' : ''}`}>
          {criteria.uppercase ? '✔' : '•'} Uppercase
        </span>
        <span className={`flex items-center ${criteria.number ? '✔' : '•'} `}>
          {criteria.number ? '✔' : '•'} Number
        </span>
        <span className={`flex items-center ${criteria.symbol ? 'text-green-600' : ''}`}>
          {criteria.symbol ? '✔' : '•'} Symbol
        </span>
      </div>
    </div>
  );
};
// --- END: Integrated Password Strength Logic and Component ---


// TypeScript Interfaces
interface RegisterFormState {
  name: string;
  dob: string;
  phone: string;
  password: string;
  confirmPassword: string;
  image: File | null;
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

// Helper Component for Password Inputs
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
                    // Toggle the form's global showPassword state
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
    name: "", dob: "", phone: "", password: "", confirmPassword: "", image: null,
  });

  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Creates a temporary URL for image preview when a file is selected
  const imageUrl = useMemo(() => {
    return form.image ? URL.createObjectURL(form.image) : null;
  }, [form.image]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setError("");

    if (e.target.type === "file") {
        const file = e.target.files?.[0] || null;
        if (file) {
            const maxSize = 2 * 1024 * 1024; // 2 MB
            const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];

            if (file.size > maxSize) {
                setError("Image file size must be less than 2MB.");
                setForm((prev) => ({ ...prev, image: null }));
                return;
            }
            if (!allowedTypes.includes(file.type)) {
                setError("Only PNG, JPEG, JPG, or SVG files are allowed.");
                setForm((prev) => ({ ...prev, image: null }));
                return;
            }
        }
        setForm((prev) => ({ ...prev, image: file }));
    } else if (name === "phone") {
       const numericValue = value.replace(/\D/g, '');
       if (numericValue.length <= 10) {
         setForm((prev) => ({ ...prev, [name]: numericValue }));
       }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const formatPhoneNumber = (number: string): string => {
      if (number.length <= 5) return number;
      return `${number.slice(0, 5)} ${number.slice(5, 10)}`;
  };
  
  // UPDATED SUBMIT FUNCTION
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const { name, dob, phone, password, confirmPassword, image } = form;

    // --- Client-Side Validation Checks ---
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
    
    // Check if the password meets basic strength requirements
    const score = calculateScore(checkStrength(password));
    if (score < 4) {
        setError("Password is too weak. Please ensure it meets all criteria.");
        setIsLoading(false);
        return;
    }
    // --- End Validation ---

    try {
        // Create FormData object for sending multipart data (file + text)
        // This is necessary because we are potentially uploading a file.
        const formData = new FormData();
        formData.append("name", name);
        formData.append("dob", dob);
        formData.append("phone", phone);
        formData.append("password", password);
        
        if (image) {
            formData.append("image", image); // Append the actual File object
        } else {
            // Send a placeholder or null if no image is selected, depending on API requirements
            formData.append("image", ""); 
        }

        const res = await fetch("/api/auth/register", {
            method: "POST",
            // NOTE: Do not set 'Content-Type': 'multipart/form-data'. 
            // The browser sets the correct boundary header automatically when sending FormData.
            body: formData, 
        });

        const data = await res.json();

        if (res.ok) {
            // Registration successful (200-299 status code)
            setError(data.message || "Registration successful!");
            // Optionally: Clear the form fields here: setForm({ name: "", dob: "", phone: "", password: "", confirmPassword: "", image: null });
        } else {
            // Registration failed (400 or 500 status code)
            setError(data.error || data.message || "Registration failed. Please try again.");
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
      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
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
            
            {/* Image Upload and Preview Field */}
            <div className="flex flex-col items-center space-y-3">
                {/* Circular Image Preview */}
                <div className="w-28 h-28 rounded-full bg-gray-200 border-4 border-indigo-400 flex items-center justify-center overflow-hidden shadow-md">
                    {imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img 
                            src={imageUrl} 
                            alt="Profile Preview" 
                            className="w-full h-full object-cover" 
                        />
                    ) : (
                        <User className="h-10 w-10 text-gray-500" />
                    )}
                </div>

                {/* Custom File Input */}
                <input
                    id="image"
                    name="image"
                    type="file"
                    accept=".png, .jpeg, .jpg, .svg"
                    onChange={handleChange}
                    className="hidden" // Hide the default file input button
                />
                <label 
                    htmlFor="image"
                    className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-full text-sm transition-colors flex items-center"
                >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    {form.image ? "Change Photo" : "Upload Photo (< 2MB)"}
                </label>
            </div>
            
            <div className="space-y-6"> {/* All fields now stacked in a single column */}
                
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
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Mobile Number</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    {/* Visual +91 Prefix */}
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center border-r border-gray-300 pr-2 pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-gray-700 font-medium">+91</span>
                    </div>
                    <input
                      id="phone" name="phone" type="tel" autoComplete="tel" 
                      placeholder="55555 55555"
                      value={formatPhoneNumber(form.phone)}
                      onChange={handleChange}
                      className="block w-full pl-24 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors tracking-wide"
                    />
                  </div>
                </div>
            
                {/* Password Fields */}
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
              <div className={`rounded-lg p-4 ${error.includes('successful') ? 'bg-green-50' : 'bg-red-50'}`}>
                <p className={`text-sm font-medium ${error.includes('successful') ? 'text-green-700' : 'text-red-700'}`}>{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                <span className="flex items-center">
                  Registering...
                  {/* Basic loading spinner for context */}
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
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