import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Player } from "@lottiefiles/react-lottie-player";
import animationData from "../assets/welcome.json";
import axios from "axios";
import { Mail, Lock, User, UserPlus } from "lucide-react"; // --- UI Improvement: Import icons

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Clear previous errors

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:8000/api/auth/signup", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      const token = res.data.access_token;
      localStorage.setItem("token", token);
      navigate("/");

    } catch (err) {
      const errorMessage = err.response?.data?.detail || "Signup failed. Please try again.";
      setError(errorMessage);
      console.error("Signup failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    // --- UI Improvement: Consistent background and layout ---
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="flex w-full max-w-5xl shadow-2xl rounded-3xl overflow-hidden bg-white">
        {/* Left - Form */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
          {/* --- UI Improvement: Enhanced Typography and consistent theme --- */}
          <h2 className="text-4xl font-bold text-gray-800 mb-2">
            Create an Account
          </h2>
          <p className="text-gray-500 mb-8">
            Join <span className="font-semibold text-blue-600">LMS</span> and start your journey.
          </p>

          <form onSubmit={handleSignup} className="space-y-5">
            {/* --- UI Improvement: Labeled and icon-enhanced input fields --- */}
            <div>
              <label className="text-sm font-medium text-gray-700" htmlFor="name">Full Name</label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input id="name" name="name" type="text" placeholder="John Doe" value={formData.name} onChange={handleChange} className="pl-10 p-3 w-full rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" required />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700" htmlFor="email">Email Address</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input id="email" name="email" type="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} className="pl-10 p-3 w-full rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" required />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700" htmlFor="password">Password</label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input id="password" name="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} className="pl-10 p-3 w-full rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" required />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700" htmlFor="confirmPassword">Confirm Password</label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input id="confirmPassword" name="confirmPassword" type="password" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} className="pl-10 p-3 w-full rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" required />
              </div>
            </div>
            
            {/* --- UI Improvement: Display errors directly on the form --- */}
            {error && <p className="text-sm text-red-600 text-center">{error}</p>}

            {/* --- UI Improvement: Modern gradient button with icon --- */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <UserPlus className="mr-2" size={20} />
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <p className="mt-8 text-sm text-gray-500 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline font-bold">
              Log in
            </Link>
          </p>
        </div>

        {/* Right - Animation */}
        {/* --- UI Improvement: Consistent animation panel style --- */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-400 to-blue-600 items-center justify-center p-6">
          <Player autoplay loop src={animationData} style={{ width: '400px', height: '400px' }} />
        </div>
      </div>
    </div>
  );
};

export default Signup;