// components/PasswordStrengthMeter.tsx
import React from 'react';

// Define the strength criteria
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

// Component Props
interface PasswordStrengthMeterProps {
  password: string;
}

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

      {/* Criteria List (Secondary Text) */}
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

export default PasswordStrengthMeter;