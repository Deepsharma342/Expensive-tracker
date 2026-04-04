import { useEffect, useState } from "react";
import API from "../services/api";
import {
  PieChart, Pie, Cell,
  BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

function Dashboard() {

  const user = JSON.parse(localStorage.getItem("user"));
  const [income, setIncome] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const [showIncome, setShowIncome] = useState(false);
  const [showExpense, setShowExpense] = useState(false);

  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
  });

  // 🔐 Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  // 📡 Fetch data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const incomeRes = await API.get("/get-income");
      const expenseRes = await API.get("/get-expenses");

      setIncome(incomeRes.data.data || []);
      setExpenses(expenseRes.data.data || []);

    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  // 📝 Input handler
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ➕ Add Income
  const handleAddIncome = async () => {
    try {
      await API.post("/add-income", form);
      setShowIncome(false);
      setForm({ title: "", amount: "", category: "", date: "" });
      fetchData();
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  // ➕ Add Expense
  const handleAddExpense = async () => {
    try {
      await API.post("/add-expense", form);
      setShowExpense(false);
      setForm({ title: "", amount: "", category: "", date: "" });
      fetchData();
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  // 🗑 Delete
  const handleDelete = async (id, type) => {
    try {
      if (type === "income") {
        await API.delete(`/delete-income/${id}`);
      } else {
        await API.delete(`/delete-expense/${id}`);
      }
      fetchData();
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  // 📊 Calculations
  const totalIncome = income.reduce((acc, item) => acc + item.amount, 0);
  const totalExpense = expenses.reduce((acc, item) => acc + item.amount, 0);
  const balance = totalIncome - totalExpense;

  const chartData = [
    { name: "Income", value: totalIncome },
    { name: "Expense", value: totalExpense }
  ];

  const transactions = [
    ...income.map(i => ({ ...i, type: "income" })),
    ...expenses.map(e => ({ ...e, type: "expense" }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    
    <div className="flex h-screen bg-gray-900 text-white">

      {/* Sidebar */}
      <div className="w-64 bg-black p-5">
        <h1 className="text-2xl font-bold mb-8 text-green-400">
          ExpenseTracker
        </h1>
<h2 className="text-2xl mb-4">
  Welcome, {user?.name} 👋
</h2>
        <ul className="space-y-4">
          <li>Dashboard</li>
          <li>Income</li>
          <li>Expenses</li>
          <li onClick={handleLogout} className="hover:text-red-400 cursor-pointer">
            Logout
          </li>
        </ul>
      </div>

      {/* Main */}
      <div className="flex-1 p-8 overflow-y-auto">

        <h2 className="text-3xl mb-6">Dashboard</h2>

        {/* Buttons */}
        <div className="flex gap-4 mb-6">
          <button 
            onClick={() => setShowIncome(true)}
            className="bg-green-500 px-4 py-2 rounded-lg"
          >
            + Add Income
          </button>

          <button 
            onClick={() => setShowExpense(true)}
            className="bg-red-500 px-4 py-2 rounded-lg"
          >
            + Add Expense
          </button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-3 gap-6 mb-10">
          <div className="bg-gray-800 p-6 rounded-xl">
            <h3>Total Balance</h3>
            <p className="text-green-400 text-2xl">₹{balance}</p>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl">
            <h3>Income</h3>
            <p className="text-blue-400 text-2xl">₹{totalIncome}</p>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl">
            <h3>Expenses</h3>
            <p className="text-red-400 text-2xl">₹{totalExpense}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-6 mb-10">

          <div className="bg-gray-800 p-6 rounded-xl">
            <h3 className="mb-4">Income vs Expense</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={chartData} dataKey="value" outerRadius={80}>
                  <Cell fill="#22c55e" />
                  <Cell fill="#ef4444" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl">
            <h3 className="mb-4">Overview</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>

        {/* Transactions */}
        <h3 className="mb-4">Transactions</h3>

        <div className="space-y-3">
          {transactions.map(item => (
            <div key={item._id} className="bg-gray-800 p-3 flex justify-between">

              <div>
                <p>{item.title}</p>
                <small>{item.category}</small>
              </div>

              <div className="flex gap-3">
                <p className={item.type === "income" ? "text-green-400" : "text-red-400"}>
                  {item.type === "income" ? "+" : "-"} ₹{item.amount}
                </p>

                <button onClick={() => handleDelete(item._id, item.type)}>✖</button>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* ADD INCOME MODAL */}
      {showIncome && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-gray-800 p-6 rounded-xl w-80 space-y-3">

            <input name="title" placeholder="Title" onChange={handleChange} className="w-full p-2 bg-gray-700"/>
            <input name="amount" placeholder="Amount" onChange={handleChange} className="w-full p-2 bg-gray-700"/>
            <input name="category" placeholder="Category" onChange={handleChange} className="w-full p-2 bg-gray-700"/>
            <input type="date" name="date" onChange={handleChange} className="w-full p-2 bg-gray-700"/>

            <button onClick={handleAddIncome} className="bg-green-500 w-full py-2">Add</button>
            <button onClick={() => setShowIncome(false)} className="bg-red-500 w-full py-2">Cancel</button>

          </div>
        </div>
      )}

      {/* ADD EXPENSE MODAL */}
      {showExpense && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-gray-800 p-6 rounded-xl w-80 space-y-3">

            <input name="title" placeholder="Title" onChange={handleChange} className="w-full p-2 bg-gray-700"/>
            <input name="amount" placeholder="Amount" onChange={handleChange} className="w-full p-2 bg-gray-700"/>
            <input name="category" placeholder="Category" onChange={handleChange} className="w-full p-2 bg-gray-700"/>
            <input type="date" name="date" onChange={handleChange} className="w-full p-2 bg-gray-700"/>

            <button onClick={handleAddExpense} className="bg-red-500 w-full py-2">Add</button>
            <button onClick={() => setShowExpense(false)} className="bg-gray-500 w-full py-2">Cancel</button>

          </div>
        </div>
      )}

    </div>
  );
}

export default Dashboard;