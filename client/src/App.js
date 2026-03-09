import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddIncome from "./pages/AddIncome";
import AddExpense from "./pages/AddExpense";
import Budget from "./pages/Budget";

function App() {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuth(!!token);
  }, []);

  return (
    <Router>
      {isAuth && <Navbar setIsAuth={setIsAuth} />}

      <Routes>
        {/* Default route */}
        <Route
          path="/"
          element={
            isAuth ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
          }
        />

        {/* Public Routes */}
        <Route path="/login" element={<Login setIsAuth={setIsAuth} />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={isAuth ? <Dashboard /> : <Navigate to="/login" />}
        />

        <Route
          path="/add-income"
          element={isAuth ? <AddIncome /> : <Navigate to="/login" />}
        />

        <Route
          path="/add-expense"
          element={isAuth ? <AddExpense /> : <Navigate to="/login" />}
        />

        <Route
          path="/budget"
          element={isAuth ? <Budget /> : <Navigate to="/login" />}
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;