import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Player } from "@lottiefiles/react-lottie-player";
import axios from "axios";
import animationData from "../assets/welcome.json";
import { Mail, Lock, LogIn } from "lucide-react"; // --- UI Improvement: Import icons

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Clear previous errors
    try {
      const res = await axios.post("http://localhost:8000/api/auth/login", {
        email,
        password,
      });

      const token = res.data.access_token;
      localStorage.setItem("token", token);
      navigate("/");

    } catch (err) {
      const errorMessage = err?.response?.data?.detail || "Invalid email or password. Please try again.";
      setError(errorMessage);
      console.error("Login failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    // --- UI Improvement: Consistent background color ---
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="flex w-full max-w-5xl shadow-2xl rounded-3xl overflow-hidden bg-white">
        {/* Left - Form */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
          {/* --- UI Improvement: Enhanced Typography --- */}
          <h2 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome Back 👋
          </h2>
          <p className="text-gray-500 mb-8">
            Login to <span className="font-semibold text-blue-600">LMS</span> 
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* --- UI Improvement: Labeled and icon-enhanced input fields --- */}
            <div>
              <label className="text-sm font-medium text-gray-700" htmlFor="email">Email Address</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 p-3 w-full rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700" htmlFor="password">Password</label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 p-3 w-full rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                />
              </div>
            </div>
            
            {/* --- UI Improvement: Display login errors directly on the form --- */}
            {error && <p className="text-sm text-red-600 text-center">{error}</p>}

            {/* --- UI Improvement: Modern gradient button with icon --- */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogIn className="mr-2" size={20} />
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-8 text-sm text-gray-500 text-center">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline font-bold">
              Sign up
            </Link>
          </p>
        </div>

        {/* Right - Animation */}
        {/* --- UI Improvement: Softer gradient background for the animation panel --- */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-400 to-blue-600 items-center justify-center p-6">
          <Player autoplay loop src={animationData} style={{ width: '400px', height: '400px' }} />
        </div>
      </div>
    </div>
  );
};

export default Login;