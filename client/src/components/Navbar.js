import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar({ setIsAuth }) {

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuth(false);
    navigate("/login");
  };

  return (
    <nav className="navbar-container">

      <Link className="navbar-logo" to="/dashboard">
        💰 Finance Manager
      </Link>

      <div className="navbar-links">

        <Link className="nav-btn dashboard-btn" to="/dashboard">
          Dashboard
        </Link>

        <Link className="nav-btn income-btn" to="/add-income">
          Add Income
        </Link>

        <Link className="nav-btn expense-btn" to="/add-expense">
          Add Expense
        </Link>

        <Link className="nav-btn budget-btn" to="/budget">
          Budget
        </Link>

        <button className="nav-btn logout-btn" onClick={logout}>
          Logout
        </button>

      </div>

    </nav>
  );
}