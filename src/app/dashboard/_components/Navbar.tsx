"use client";

import {
    House,
    Layers,
    LetterText,
    FileBadge,
    Gpu,
    FileUser,
    GitPullRequestArrow,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {

    const pathname = usePathname();

    const menuItems = [
        { href: "/dashboard/home", icon: House, label: "Home" },
        { href: "/dashboard/customers", icon: Layers, label: "Customers" },
        { href: "/dashboard/purchase", icon: LetterText, label: "Purchase" },
        { href: "/dashboard/rewards", icon: FileBadge, label: "Rewards Store" },
        { href: "/dashboard/winners", icon: House, label: "Winners" },
        { href: "/dashboard/spins", icon: Layers, label: "Spins & Games" },
        { href: "/dashboard/redeem", icon: Gpu, label: "Redeem Requests" },
        { href: "/dashboard/transactions", icon: FileUser, label: "Transactions" },
        { href: "/dashboard/offers", icon: GitPullRequestArrow, label: "Offers" },
        { href: "/dashboard/inventory", icon: Gpu, label: "Inventory & Pricing" },
        { href: "/dashboard/settings", icon: FileUser, label: "Settings" },
    ];

    return (
        <nav className="bg-accent/10 shadow-md p-4">
            <div className="flex flex-col h-screen w-full px-2 md:px-4 py-6 md:py-8">
                {/* Logo */}
                <div className="flex justify-center px-2 md:px-4 py-1">
                    <h1 className="text-xl md:text-2xl font-bold text-primaryText text-center logo">
                        <span className="text-primary logo">Ravi Kirana</span>
                    </h1>
                </div>

                {/* Description (Only on md+) */}
                <p className="text-xs text-secondaryText text-center hidden lg:block">
                    Your Trusted Neighborhood Store in Nashik
                </p>

                <div className="border-b border-gray-200 my-3 hidden md:block" />

                {/* Menus */}
                <nav className="flex-1 text-gray-600 mt-4 space-y-2">
                    {menuItems.map(({ href, icon: Icon, label }) => {
                        const isActive = pathname === href;
                        return (
                            <Link
                                key={label}
                                href={href}
                                className={`flex items-center gap-3 justify-center md:justify-start px-3 md:px-4 py-2 text-sm transition-colors duration-150 group rounded-[4px] ${isActive
                                        ? "text-primary border-r-4 border-primary"
                                        : "hover:text-primary hover:border-r-4 border-primary"
                                    }`}
                            >
                                <Icon
                                    className={`h-5 w-5 ${isActive
                                            ? "text-primary"
                                            : "text-secondaryText group-hover:text-primary"
                                        }`}
                                />
                                <span className="hidden md:inline font-medium text-[16px] tracking-wide">
                                    {label}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Card */}
                <div className="mt-auto mb-6 hidden md:block">
                    <div className="bg-gradient-to-r from-primary/75 to-primary rounded-xl p-4">
                        {/* Logout */}
                        <Link
                            href="/logout"
                            className="flex items-center gap-3 justify-center md:justify-start px-3 md:px-4 py-2 text-sm text-white"
                        >
                            <GitPullRequestArrow className="h-5 w-5 text-white" />
                            <span className="hidden md:inline font-medium text-[16px] tracking-wide">
                                Logout
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}