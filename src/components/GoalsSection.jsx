import axios from "axios";
import React, { useEffect, useState } from "react";

export default function GoalsSection(refresh) {
  const [goals, setGoals] = useState([]);
  const token = localStorage.getItem("token");
  const apiKey = import.meta.env.VITE_API_URL;

  const fetchGoals = async () => {
    try {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${apiKey}/goal/`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      axios
        .request(config)
        .then((response) => {
          // console.log(JSON.stringify(response.data));
          setGoals(response.data);
          refresh()
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {}
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  // const goals = [
  //   { id: 1, name: "Emergency Fund", target: 100000, saved: 40000 },
  //   { id: 2, name: "New Laptop", target: 80000, saved: 25000 },
  // ];
  return (
    <div className="rounded-2xl bg-neutral-900 p-6 shadow-lg">
      <h2 className="text-lg font-semibold mb-4">Goals</h2>
      <ul className="space-y-4">
        {goals.length > 0 ? (
          goals.map((g) => {
            const percentage = (g.currentAmount / g.targetAmount) * 100;
            return (
              <li key={g._id}>
                <div className="flex justify-between mb-1">
                  <span>{g.title}</span>
                  <span className="text-sm text-gray-400">
                    ₹{g.currentAmount}/ ₹{g.targetAmount}
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      percentage > 80
                        ? "bg-green-500"
                        : percentage > 50
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{
                      width: `${percentage > 100 ? 100 : percentage}`,
                    }}
                  />
                </div>
              </li>
            );
          })
        ) : (
          <p className="text-gray-400">No Goals added yet.</p>
        )}
      </ul>
    </div>
  );
}
