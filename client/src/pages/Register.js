import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";

export default function Register() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.name || !form.email || !form.password) {
      setError("All fields are required");
      return;
    }

    /* USERNAME VALIDATION */

    const usernameRegex = /^(?=.*[A-Za-z])[A-Za-z0-9._]{1,15}$/;

    if (!usernameRegex.test(form.name)) {
      setError(
        "Username must contain at least one letter. Numbers, '.' and '_' allowed (max 15 characters)"
      );
      return;
    }

    /* PASSWORD VALIDATION */

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    if (!passwordRegex.test(form.password)) {
      setError(
        "Password must contain letters, numbers and at least one special character"
      );
      return;
    }

    try {

      await API.post("/auth/register", form);

      setSuccess("Registration successful! Redirecting...");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {

      setError(
        err.response?.data?.message || "Registration failed"
      );

    }

  };

  return (

    <div className="register-page">

      <div className="register-card">

        <div className="register-left">
          Start Managing <br /> Your Finances
        </div>

        <div className="register-right">

          <h2 className="register-title">Register</h2>

          {error && <div className="register-error">{error}</div>}
          {success && <div className="register-success">{success}</div>}

          <form onSubmit={handleSubmit} className="register-form">

            <input
              className="register-input"
              placeholder="Username"
              maxLength="15"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              className="register-input"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <input
              className="register-input"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />

            <button className="register-btn">
              Register
            </button>

            <p className="register-footer">
              Already have an account?
              <Link to="/login" className="register-link">
                Login
              </Link>
            </p>

          </form>

        </div>

      </div>

    </div>

  );

}