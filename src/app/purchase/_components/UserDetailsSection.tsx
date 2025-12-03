import React, { useEffect } from 'react';
import { User, CheckCircle2 } from 'lucide-react';

interface UserDetailsProps {
    phone: string;
    setPhone: React.Dispatch<React.SetStateAction<string>>;
    formattedPhone: string;
    setFormattedPhone: React.Dispatch<React.SetStateAction<string>>;
    userName: string | null;
    isLoading: boolean;
    errorMsg: string;
    onCheck: (rawDigits: string) => Promise<void>;
}

export default function UserDetailsSection({
    phone, setPhone, formattedPhone, setFormattedPhone, 
    userName, isLoading, errorMsg, onCheck
}: UserDetailsProps) {

    // --- EFFECT: Check localStorage for userPhone and pre-fill ---
    useEffect(() => {
        // Run only on client-side and when phone is empty
        if (phone === "" && typeof window !== 'undefined') {
            const storedPhone = localStorage.getItem('userPhone');
            
            // Validate the stored phone number
            if (storedPhone && /^\d{10}$/.test(storedPhone)) {
                
                // 1. Set the raw phone number state
                setPhone(storedPhone);
                
                // 2. Format for display: " 98765 43210"
                const formatted: string = " " + storedPhone.slice(0, 5) + " " + storedPhone.slice(5);
                setFormattedPhone(formatted);
                
                // 3. Automatically run the API check
                // NOTE: We wrap the async call in a function to use 'await' if needed, 
                // but keep it non-blocking using setTimeout for immediate UI update.
                setTimeout(() => {
                    onCheck(storedPhone);
                }, 0); 
            }
        }
    }, [setPhone, setFormattedPhone, onCheck]); // Removed 'phone' dependency to ensure it only runs on mount/reset

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        // Remove all non-digit characters
        const inputValue: string = e.target.value.replace(/\D/g, "");
        const rawDigits: string = inputValue.slice(0, 10);
    
        // Format the digits for display: " 98765 43210"
        let formatted: string = " ";
        if (rawDigits.length > 5) {
          formatted += rawDigits.slice(0, 5) + " " + rawDigits.slice(5);
        } else {
          formatted += rawDigits;
        }
    
        setPhone(rawDigits);
        setFormattedPhone(formatted);
        
        // Clear localStorage if the user deletes the number, preventing re-fill on refresh/re-render
        if (rawDigits.length < 10) {
            localStorage.removeItem('userPhone');
        }

        // Trigger API check only when 10 digits are complete
        if (rawDigits.length === 10) {
          // ✅ STORE THE PHONE NUMBER HERE (If the API check succeeds, the number will be saved/overwritten)
          localStorage.setItem('userPhone', rawDigits);
          
          onCheck(rawDigits);
        }
    };

    return (
        <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 ml-1">CUSTOMER MOBILE</label>
            <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-700/70 transition-colors pointer-events-none">
                    +91
                </span>

                <input
                    type="tel"
                    value={formattedPhone}
                    onChange={handlePhoneChange}
                    maxLength={16} // Max length for display including spaces
                    placeholder="98765 43210"
                    // Conditional styling based on user verification status
                    className={`w-full pl-16 pr-12 py-4 rounded-2xl font-bold text-lg text-gray-900 tracking-wider transition-all outline-none 
                        ${userName ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-indigo-500/50 focus:bg-white'}
                    `}
                />
                {isLoading && (
                    // Tailwind custom loading spinner
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </span>
                )}
            </div>

            {/* User Verification Status */}
            {userName && (
                <div className="animate-in slide-in-from-top-2 duration-300">
                    <div className="bg-green-50 border border-green-100 p-3 rounded-xl flex items-center gap-3">
                        <div className="bg-green-100 p-2 rounded-full">
                            <User className="w-4 h-4 text-green-700" />
                        </div>
                        <div>
                            <p className="text-[10px] text-green-600 font-bold uppercase">Verified</p>
                            <p className="text-sm font-bold text-green-800">{userName}</p>
                        </div>
                        <CheckCircle2 className="w-5 h-5 text-green-600 ml-auto" />
                    </div>
                </div>
            )}
            {/* Error Message */}
            {errorMsg && <p className="text-red-500 text-xs ml-1">{errorMsg}</p>}
        </div>
    );
}