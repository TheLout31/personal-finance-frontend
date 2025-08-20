import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/userContext";

export default function BudgetsSection() {
  const [budgets,setBudgets] = useState([])
  const { user } = useContext(UserContext);
  const token = localStorage.getItem("token")
  // const budgets = [
  //   { id: 1, category: "Food", limit: 5000, spent: 3000 },
  //   { id: 2, category: "Entertainment", limit: 2000, spent: 1200 },
  // ];
  const getBugets = async() => {
    try {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: "http://localhost:3000/budget/",
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      };

      axios
        .request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
          setBudgets(response.data.budgets)
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(()=>{
    getBugets()
  },[])
  return (
    <div className="rounded-2xl bg-neutral-900 p-6 shadow-lg">
      <h2 className="text-lg font-semibold mb-4">Budgets</h2>
      <ul className="space-y-4">
        {budgets.map((b) => (
          <li key={b.id}>
            <div className="flex justify-between mb-1">
              <span>{b.category}</span>
              <span className="text-sm text-gray-400">
                {b.spent} / {b.amount}
              </span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div
                className="bg-white h-2 rounded-full"
                style={{ width: `${(b.spent / b.limit) * 100}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
