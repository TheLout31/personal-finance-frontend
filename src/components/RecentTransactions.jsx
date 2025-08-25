import axios from "axios";
import React, { useEffect, useState } from "react";
import { formatDate } from "./FormatDate";

export default function RecentTransactions(refresh) {
  const [transactions, setTransactions] = useState([]);
  const token = localStorage.getItem("token");
  const isoDate = "2025-08-19T09:53:47.045Z";

  // Convert to Date object

  const fetchTransaction = () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "http://localhost:3000/transaction/get-transactions",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .request(config)
      .then((response) => {
        // console.log(JSON.stringify(response.data));
        setTransactions(response.data.transactions);
        refresh
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchTransaction();
  }, []);
  return (
    <div className="rounded-2xl h-100  overflow-y-scroll bg-neutral-900 p-6 shadow-lg">
      <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
      <ul className="space-y-3">
        {transactions.length > 0 ? (
          transactions.slice(0,8).map((t) => (
            <li
              key={t._id}
              className="flex justify-between border-b border-gray-800 pb-2"
            >
              <div>
                <p className="font-medium">{t.category?t.category : t.description}</p>
                <p className="text-sm text-gray-400">
                  {formatDate(t.createdAt)}
                </p>
              </div>
              {t.type == "income" ? (
                <p className={`font-semibold ${"text-green-400"}`}>
                  + ₹{t.amount}
                </p>
              ) : (
                <p className={`font-semibold ${"text-red-400"}`}>
                  - ₹{t.amount}
                </p>
              )}
            </li>
          ))
        ) : (
          <p className="text-gray-400">No transactions yet.</p>
        )}
      </ul>
    </div>
  );
}
