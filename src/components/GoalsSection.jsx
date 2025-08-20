import React from "react";

export default function GoalsSection() {
  const goals = [
    { id: 1, name: "Emergency Fund", target: 100000, saved: 40000 },
    { id: 2, name: "New Laptop", target: 80000, saved: 25000 },
  ];
  return (
    <div className="rounded-2xl bg-neutral-900 p-6 shadow-lg">
      <h2 className="text-lg font-semibold mb-4">Goals</h2>
      <ul className="space-y-4">
        {goals.map((g) => (
          <li key={g.id}>
            <div className="flex justify-between mb-1">
              <span>{g.name}</span>
              <span className="text-sm text-gray-400">
                {g.saved}/{g.target}
              </span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div
                className="bg-white h-2 rounded-full"
                style={{ width: `${(g.saved / g.target) * 100}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
