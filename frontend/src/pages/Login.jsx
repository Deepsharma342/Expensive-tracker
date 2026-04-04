import { Link, useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import API from "../services/api";

function Login() {



  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  // handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/login", form);

      localStorage.setItem("token", res.data.token);
localStorage.setItem("user", JSON.stringify(res.data.user));

      // store token
      localStorage.setItem("token", res.data.token);

      alert("Login successful");

      // redirect
      window.location.href = "/dashboard";

    } catch (err) {
      console.log(err.response?.data || err.message);
      alert("Invalid credentials");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800">
      
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-[350px]">
        
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-green-400"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-green-400"
          />

          <button className="bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition">
            Login
          </button>
        </form>

        <p className="text-gray-300 text-sm mt-4 text-center">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-green-400 hover:underline">
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;