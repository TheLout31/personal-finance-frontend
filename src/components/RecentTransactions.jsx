import React from 'react'

export default function RecentTransactions() {
    const transactions = [
        { id: 1, title: "Salary", amount: "+50000", date: "2025-08-01" },
        { id: 2, title: "Groceries", amount: "-2500", date: "2025-08-03" },
        { id: 3, title: "Electricity Bill", amount: "-1500", date: "2025-08-05" },
      ];
  return (
    <div className="rounded-2xl bg-neutral-900 p-6 shadow-lg">
          <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
          <ul className="space-y-3">
            {transactions.map((t) => (
              <li
                key={t.id}
                className="flex justify-between border-b border-gray-800 pb-2"
              >
                <div>
                  <p className="font-medium">{t.title}</p>
                  <p className="text-sm text-gray-400">{t.date}</p>
                </div>
                <p
                  className={`font-semibold ${
                    t.amount.startsWith("+") ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {t.amount}
                </p>
              </li>
            ))}
          </ul>
        </div>
  )
}
