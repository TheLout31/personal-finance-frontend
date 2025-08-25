import { useState, useContext, useEffect, useRef } from "react";
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
import { jwtDecode } from "jwt-decode";
import config from "../config";

const Home = () => {
  const { user, setUser } = useContext(UserContext);
  const [refreshKey, setRefreshKey] = useState(0);

  const token = localStorage.getItem("token");
  const [userData, setUserData] = useState([]);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef(null);

  

  const fetchUserdata = () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `http://localhost:3000/user/`,
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

  const fetchNotifications = () => {
    axios
      .get("http://localhost:3000/notification/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setNotifications(res.data.notifications || []))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchUserdata();
    fetchNotifications();
  }, [refreshKey]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
      if(!token){
        navigate("/signin");
      }
      if (token) {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
          navigate("/signin");
        }
      }
    };

    // Check immediately
    checkTokenExpiry();

    // Keep checking every 1 min
    const interval = setInterval(checkTokenExpiry, 60 * 1000);

    return () => clearInterval(interval);
  }, [navigate, setUser]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <h1 className="text-xl font-bold">TrackBucks</h1>
        <div className="flex items-center gap-6">
          {/* Notification Bell */}
          <div
            className="relative cursor-pointer"
            ref={notifRef}
            onClick={() => setIsNotifOpen((prev) => !prev)}
          >
            <Bell className="h-6 w-6 text-white hover:text-gray-400 transition" />
            {notifications.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-black text-xs rounded-full px-1">
                {notifications.length}
              </span>
            )}

            {/* Floating Modal */}
            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white text-black rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-3 font-semibold border-b">Notifications</div>
                <ul className="max-h-60 overflow-y-auto bg-black rounded-xl shadow-lg border border-gray-800">
                  {notifications.length > 0 ? (
                    notifications.map((notif, idx) => (
                      <li
                        key={idx}
                        className="px-4 py-3 border-b border-gray-800 last:border-b-0 hover:bg-neutral-900 transition-colors"
                      >
                        <div className="flex justify-between items-center">
                          <h3 className="text-white font-semibold">
                            {notif.title || "Notification"}
                          </h3>
                          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-lg">
                            {notif.type || "general"}
                          </span>
                        </div>

                        <p className="text-gray-300 text-sm mt-1">
                          {notif.message || "New notification"}
                        </p>

                        <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                          <span>
                            {new Date(notif.createdAt).toLocaleString()}
                          </span>
                          {!notif.isRead && (
                            <span className="text-blue-400 font-medium">
                              New
                            </span>
                          )}
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-3 text-gray-500 text-center">
                      No notifications
                    </li>
                  )}
                </ul>
              </div>
            )}
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
        <RecentTransactions refresh={() => setRefreshKey((prev) => prev + 1)} />

        {/* Friends List */}
        <FriendsList
          token={token}
          refresh={() => setRefreshKey((prev) => prev + 1)}
        />

        {/* Budgets */}
        <BudgetsSection refresh={() => setRefreshKey((prev) => prev + 1)} />

        {/* Goals */}
        <GoalsSection refresh={() => setRefreshKey((prev) => prev + 1)} />
      </div>

      {/* Modal */}
      {isBudgetModalOpen && <CreateBudget closeModal={closeModal} />}

      {isGoalModalOpen && <CreateGoal closeModal={closeModal} />}
    </div>
  );
};

export default Home;
