import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/userContext";

export default function BudgetsSection(refresh) {
  const [budgets, setBudgets] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [amountToAdd, setAmountToAdd] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const apiKey = import.meta.env.VITE_API_URL;

  const { user } = useContext(UserContext);
  const token = localStorage.getItem("token");

  const getBudgets = async () => {
    try {
      let config = {
        method: "get",
        url: `${apiKey}/budget/`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.request(config);
      setBudgets(response.data.budgets);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBudgets();
  }, []);

  const openModal = (budget) => {
    setSelectedBudget(budget);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedBudget(null);
    setAmountToAdd("");
    setIsModalOpen(false);
  };

  const handleAddMoney = async () => {
    if (!amountToAdd) return;

    try {
      await axios.post(
        `${apiKey}/transaction/add-transaction`,
        {
          type: "expense",
          amount: Number(amountToAdd),
          category: selectedBudget.category,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await getBudgets(); // refresh budgets after update
      closeModal();
      refresh
    } catch (error) {
      console.error(error);
    }
  };

  // ✅ Delete Budget API
  const handleDeleteBudget = async (budgetId) => {
    try {
      await axios.delete(`${apiKey}/budget/delete/${budgetId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await getBudgets(); // refresh list
    } catch (error) {
      console.error(error);
    }
  };

  // ✅ Long press handler
  let pressTimer;
  const startPress = (budgetId) => {
    pressTimer = setTimeout(() => {
      if (window.confirm("Are you sure you want to delete this budget?")) {
        handleDeleteBudget(budgetId);
      }
    }, 800); 
  };

  const cancelPress = () => {
    clearTimeout(pressTimer);
  };

  return (
    <div className="rounded-2xl bg-neutral-900 p-6 shadow-lg">
      <h2 className="text-lg font-semibold mb-4">Budgets</h2>
      <ul className="space-y-4">
        {budgets.length > 0 ? (
          budgets.map((b) => {
            const percentage = (b.spent / b.amount) * 100;
            return (
              <li
                key={b._id}
                className="cursor-pointer p-2 rounded hover:bg-neutral-800 transition"
                onClick={() => openModal(b)}
                onMouseDown={() => startPress(b._id)}
                onMouseUp={cancelPress}
                onMouseLeave={cancelPress}
                onTouchStart={() => startPress(b._id)}
                onTouchEnd={cancelPress}
              >
                <div className="flex justify-between mb-1 items-center">
                  <span>{b.category}</span>
                  {percentage > 100 ? (
                    <div className=" text-red-700 px-1 py-1 rounded-lg">
                      Exceeded
                    </div>
                  ) : null}

                  <span className="text-sm text-gray-400">
                    ₹{b.spent.toLocaleString()} / ₹{b.amount.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      percentage > 80
                        ? "bg-red-500"
                        : percentage > 50
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                    style={{ width: `${percentage > 100 ? 100 : percentage}%` }}
                  />
                </div>
              </li>
            );
          })
        ) : (
          <p className="text-gray-400">No budgets yet.</p>
        )}
      </ul>

      {/* Modal */}
      {isModalOpen && selectedBudget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-neutral-900 p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">
              Add Money to {selectedBudget.category}
            </h3>
            <input
              type="number"
              value={amountToAdd}
              onChange={(e) => setAmountToAdd(e.target.value)}
              className="w-full p-2 rounded bg-neutral-800 text-white border border-gray-700 mb-4"
              placeholder="Enter amount"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMoney}
                className="px-4 py-2 rounded bg-green-600 hover:bg-green-500"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
