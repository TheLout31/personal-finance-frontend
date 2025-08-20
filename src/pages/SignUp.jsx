import { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import axios from "axios";

const categoryOptions = [
  "Salary",
  "Groceries",
  "Bills",
  "Food",
  "Entertainment",
  "Misc",
];

const SignUp = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    balance: "",
    categories: [],
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (e) => {
    const { options } = e.target;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) selected.push(options[i].value);
    }
    setForm({ ...form, categories: selected });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "http://localhost:3000/user/signup",
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify(form),
      };

      axios
        .request(config)
        .then((response) => {
          
          console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AuthLayout title="Create Account">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-700 bg-black p-3 text-white placeholder-gray-400 focus:border-white focus:outline-none"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-700 bg-black p-3 text-white placeholder-gray-400 focus:border-white focus:outline-none"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-700 bg-black p-3 text-white placeholder-gray-400 focus:border-white focus:outline-none"
        />

        <input
          type="number"
          name="balance"
          placeholder="Starting Balance"
          value={form.balance}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-700 bg-black p-3 text-white placeholder-gray-400 focus:border-white focus:outline-none"
        />

        <select
          multiple
          name="categories"
          value={form.categories}
          onChange={handleCategoryChange}
          className="w-full h-32 rounded-lg border border-gray-700 bg-black p-3 text-white placeholder-gray-400 focus:border-white focus:outline-none"
        >
          {categoryOptions.map((cat) => (
            <option key={cat} value={cat} className="bg-black text-white">
              {cat}
            </option>
          ))}
        </select>
        <p className="text-sm text-gray-400">
          Hold Ctrl (Windows) or Cmd (Mac) to select multiple categories
        </p>

        <button
          type="submit"
          className="w-full rounded-lg bg-white p-3 font-semibold text-black hover:bg-gray-300 transition"
        >
          Sign Up
        </button>

        <p className="text-center text-sm text-gray-400">
          Already have an account?{" "}
          <a href="/signin" className="underline hover:text-white">
            Sign In
          </a>
        </p>
      </form>
    </AuthLayout>
  );
};

export default SignUp;
