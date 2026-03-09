import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

export default function Login({ setIsAuth }) {

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!form.email || !form.password) {
      setError("Please fill all fields");
      return;
    }

    try {

      setLoading(true);

      const res = await API.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);

      setIsAuth(true);

      navigate("/dashboard");

    } catch (err) {

      setError(err.response?.data?.message || "Invalid credentials");

    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="login-page">

      <div className="login-card">

        {/* LEFT SIDE */}
        <div className="login-left">
          Manage Your <br/> Finances <br/> Smartly
        </div>

        {/* RIGHT SIDE */}
        <div className="login-right">

          <h2 className="login-title">Login</h2>

          {error && <div className="login-error">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">

            <input
              className="login-input"
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(e)=>setForm({...form,email:e.target.value})}
            />

            <input
              className="login-input"
              placeholder="Password"
              type="password"
              value={form.password}
              onChange={(e)=>setForm({...form,password:e.target.value})}
            />

            <button
              className="login-btn"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <p className="login-footer">
              Don't have an account?
              <Link to="/register" className="login-link">
                Register
              </Link>
            </p>

          </form>

        </div>

      </div>

    </div>

  );
}