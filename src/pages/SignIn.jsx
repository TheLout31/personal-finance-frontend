import { useContext, useEffect, useState } from "react";
import AuthLayout from "../components/AuthLayout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";

const SignIn = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const apiKey = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${apiKey}/user/login`,
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify(form),
      };

      axios
        .request(config)
        .then((response) => {
          // Save to localStorage
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));
          // Update Context
          setUser(response.data.user);

          // Navigate to Home
          navigate("/");
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AuthLayout title="Sign In">
      <form onSubmit={handleSubmit} className="space-y-4">
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
        <button
          type="submit"
          className="w-full rounded-lg bg-white p-3 font-semibold text-black hover:bg-gray-300 transition"
        >
          Sign In
        </button>
        <p className="text-center text-sm text-gray-400">
          Don’t have an account?{" "}
          <a href="/signup" className="underline hover:text-white">
            Sign Up
          </a>
        </p>
      </form>
    </AuthLayout>
  );
};

export default SignIn;
