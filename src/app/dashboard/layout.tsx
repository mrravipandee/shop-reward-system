import type { ReactNode } from "react";
import Navbar from "./_components/Navbar";
import TopBar from "./_components/Topbar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex h-screen overflow-hidden">
            <div className="w-[18%] sm:w-[12%] md:w-[8%] lg:w-[18%] xl:w-[18%]">
                <Navbar />
            </div>

            
            {/* Main Content */}
            <div className="w-[82%] sm:w-[88%] md:w-[92%] lg:w-[82%] xl:w-[82%] overflow-y-auto">
                <TopBar />    
                {children}
            </div>
        </div>
    );
}
