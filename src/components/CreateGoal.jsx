import axios from "axios";
import React, { useState } from "react";

export default function CreateGoal({ closeModal }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const token = localStorage.getItem("token");

  const addGoal = async (e) => {
    e.preventDefault(); // prevent page refresh
    try {
      const response = await axios.post(
        "http://localhost:3000/goal/create",
        {
          title,
          targetAmount: Number(amount),
          deadline:targetDate,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Goal created:", response.data);
      closeModal();
    } catch (error) {
      console.error("Error creating goal:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-neutral-900 rounded-xl p-6 w-96 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Create Goal</h2>

        <form className="space-y-4" onSubmit={addGoal}>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 rounded bg-neutral-800 border border-gray-700 text-white"
            required
          />

          <input
            type="number"
            name="amount"
            placeholder="Target Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 rounded bg-neutral-800 border border-gray-700 text-white"
            required
          />

          {/* Date Selector (Day, Month, Year) */}
          <input
            type="date"
            name="targetDate"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="w-full p-2 rounded bg-neutral-800 border border-gray-700 text-white"
            required
          />

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
