import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import { LogOut } from "lucide-react";
import RecentTransactions from "../components/RecentTransactions";
import BudgetsSection from "../components/BudgetsSection";
import GoalsSection from "../components/GoalsSection";
import { UserContext } from "../context/userContext";
import CreateBudget from "../components/CreateBudget";
import CreateGoal from "../components/CreateGoal";
import axios from "axios";
import FriendsList from "../components/FriendsList";
import { socket } from "../socket";
import { jwtDecode } from "jwt-decode";

const Home = () => {
  const { user, setUser } = useContext(UserContext);
  const token = localStorage.getItem("token");
  const [userData, setUserData] = useState([]);
  const navigate = useNavigate();

  socket.on("budgetNotification", (data) => {
    alert(data.message); // show toast/notification
  });

  const fetchUserdata = () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "http://localhost:3000/user/",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data.message));
        setUserData(response.data.user);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchUserdata();
  }, []);

  // State for modal
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);

  // Open modal with type
  const openBudgetModal = () => {
    setIsBudgetModalOpen(true);
  };

  const openGoalModal = () => {
    setIsGoalModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsGoalModalOpen(false);
    setIsBudgetModalOpen(false);
  };

  const handleLogOut = () => {
    localStorage.clear();
    setUser(null);
    navigate("/signin");
  };

  useEffect(() => {
    const checkTokenExpiry = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/signin");
        return;
      }

      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        navigate("/signin");
      }
    };
    checkTokenExpiry();
  }, []);

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
          <div onClick={() => handleLogOut()}>
            <LogOut className="h-6 w-6 text-white-500 hover:text-red-400 transition" />
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Balance Card */}
        <div className="col-span-1 lg:col-span-3 rounded-2xl bg-neutral-900 p-6 shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold mb-2">Current Balance</h2>
              <p className="text-3xl font-bold">₹ {userData?.balance || 0}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => openBudgetModal()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
              >
                + Create Budget
              </button>
              <button
                onClick={() => openGoalModal()}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white"
              >
                + Create Goal
              </button>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <RecentTransactions />

        {/* Friends List */}
        <FriendsList token={token} />

        {/* Budgets */}
        <BudgetsSection />

        {/* Goals */}
        <GoalsSection />
      </div>

      {/* Modal */}
      {isBudgetModalOpen && <CreateBudget closeModal={closeModal} />}

      {isGoalModalOpen && <CreateGoal closeModal={closeModal} />}
    </div>
  );
};

export default Home;
