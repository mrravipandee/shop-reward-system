import { X, CheckCircle } from 'lucide-react';

interface RedemptionConfirmationProps {
  productName: string;
  redeemCode: string;
  onClose: () => void;
}

export default function RedemptionConfirmation({ productName, redeemCode, onClose }: RedemptionConfirmationProps) {
  return (
    <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex justify-end">
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Redemption Requested!</h3>
          <p className="text-gray-600 mb-4">You have requested **{productName}**.</p>
          <p className="text-lg font-semibold text-gray-700">Coins have been deducted and your request is **PENDING** approval.</p>

          <div className="mt-6 bg-yellow-50 border-2 border-yellow-300 p-4 rounded-xl">
            <p className="text-sm font-medium text-yellow-800 mb-1">Show this code to the Shop Owner:</p>
            <div className="text-4xl font-extrabold tracking-widest text-primary">
              {redeemCode}
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="mt-8 w-full py-3 bg-primary text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
          >
            Got It!
          </button>
        </div>
      </div>
    </div>
  );
}