"use client";

import CollectionStats from "../_components/CollectionStats";
import LastTransactions from "../_components/LastTransactions";
import RecentlyRegisteredUsers from "../_components/RecentlyRegisteredUsers";
import TopbarHome from "../_components/TopbarHome";
import TotalAnalysis from "../_components/TotalAnalysis";
import UserCoinsAnalytics from "../_components/UserCoinsAnalytics";
import UserSpendingAnalytics from "../_components/UserSpendingAnalytics";
import UserStatsCards from "../_components/UserStatsCards";
import WeeklyActivities from "../_components/WeeklyActivities";

export default function HomePage() {
    return (
        <div className="p-6 bg-accent/20">
            <TopbarHome />
            <div className="flex gap-8 mx-6 mt-6">
                <LastTransactions />
                <CollectionStats />
            </div>

            <div className="flex gap-8 mx-6 mt-6">
                <WeeklyActivities />
                <TotalAnalysis />
            </div>

            <div className="p-4 md:p-6 space-y-6">
                {/* <h1 className="text-2xl font-bold text-gray-900">User Management</h1> */}

                {/* Stats Cards
                <UserStatsCards /> */}

                {/* Recently Registered Users */}
                <RecentlyRegisteredUsers
                    limit={8}
                />

                {/* Coins Analytics
                <UserCoinsAnalytics />

                {/* Spending Analytics */}
                {/* <UserSpendingAnalytics /> */} 
            </div>
        </div>
    );
}