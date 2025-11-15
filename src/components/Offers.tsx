import { Gift, Coins } from "lucide-react";
import { IndianRupee } from "lucide-react";

const offers = [
  {
    icon: <Gift className="text-primary text-3xl mb-2" />,
    title: "🎡 Daily Lucky Draw",
    desc: "Buy anything and get a chance to win your bill FREE!",
  },
  {
    icon: <IndianRupee className="text-primary text-3xl mb-2" />,
    title: "💰 Instant Cashback",
    desc: "Win ₹5 to ₹50 instantly — credited to your store wallet.",
  },
  {
    icon: <Coins className="text-primary text-3xl mb-2" />,
    title: "🪙 Earn Coins",
    desc: "Get coins on every ₹30 purchase and redeem later for discounts.",
  },
];

export default function Offers() {
  return (
    <section id="offers" className="bg-gray-50 py-16 px-6 text-center">
      <h3 className="text-2xl font-bold text-primary mb-8">
        Current Offers & Rewards
      </h3>
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {offers.map((offer, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition"
          >
            {offer.icon}
            <h4 className="text-lg font-semibold text-gray-800 mb-2">
              {offer.title}
            </h4>
            <p className="text-gray-600 text-sm">{offer.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
