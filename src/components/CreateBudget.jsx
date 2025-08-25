import axios from "axios";
import React, { useState } from "react";

export default function CreateBudget({ closeModal }) {
  const [amount, setAmount] = useState("");
  const [period, setPeriod] = useState("monthly");
  const [category, setCategory] = useState("Food");
  const token = localStorage.getItem("token");
  const apiKey = import.meta.env.VITE_API_URL;

  const addBudget = async (e) => {
    e.preventDefault(); // prevent page refresh

    try {
      const response = await axios.post(
        `${apiKey}/budget/create`,
        {
          amount: Number(amount),
          period,
          category,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Budget created:", response.data);
      closeModal();
    } catch (error) {
      console.error("Error creating budget:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-neutral-900 rounded-xl p-6 w-96 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Create Budget</h2>

        <form className="space-y-4" onSubmit={addBudget}>
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 rounded bg-neutral-800 border border-gray-700 text-white"
            required
          />

          {/* Period Dropdown */}
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="w-full p-2 rounded bg-neutral-800 border border-gray-700 text-white"
          >
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>

          {/* Category Dropdown */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 rounded bg-neutral-800 border border-gray-700 text-white"
          >
            {/* ["Salary", "Groceries", "Bills", "Food", "Entertainment", "Misc"] */}
            <option value="Salary">Salary</option>
            <option value="Groceries">Groceries</option>
            <option value="Bills">Bills</option>
            <option value="Food">Food</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Misc">Misc</option>
          </select>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
