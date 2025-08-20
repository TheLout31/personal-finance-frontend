import { Bell } from "lucide-react"; // icon library (lucide-react)
import RecentTransactions from "../components/RecentTransactions";
import BudgetsSection from "../components/BudgetsSection";
import GoalsSection from "../components/GoalsSection";
import { useContext } from "react";
import { UserContext } from "../context/userContext";

const Home = () => {
  const {user} = useContext(UserContext)
  console.log("User data from home",user)
  const balance = user?.balance || 0;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <h1 className="text-xl font-bold">TrackBucks</h1>
        <div className="flex items-center gap-6">
          <div className="relative cursor-pointer">
            <Bell className="h-6 w-6 text-white hover:text-gray-400 transition" />
            <span className="absolute -top-2 -right-2 bg-white text-black text-xs rounded-full px-1">
              3
            </span>
          </div>
          <div className="font-semibold">₹ {balance.toLocaleString()}</div>
        </div>
      </nav>

      {/* Content */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Balance Card */}
        <div className="col-span-1 lg:col-span-3 rounded-2xl bg-neutral-900 p-6 shadow-lg">
          <h2 className="text-lg font-semibold mb-2">Current Balance</h2>
          <p className="text-3xl font-bold">₹ {balance.toLocaleString()}</p>
        </div>

        {/* Recent Transactions */}
        <RecentTransactions />

        {/* Budgets */}
        <BudgetsSection />

        {/* Goals */}
        <GoalsSection />
      </div>
    </div>
  );
};

export default Home;
