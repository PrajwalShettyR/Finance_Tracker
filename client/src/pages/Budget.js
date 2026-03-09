import { useEffect, useState, useCallback } from "react";
import API from "../services/api";
import "./Budget.css";

const categories = [
  "Food",
  "Travel",
  "Clothes",
  "Shopping",
  "Bills",
  "Entertainment",
  "Medical",
  "Other"
];

export default function Budget() {

  const [form, setForm] = useState({
    category: "Food",
    amount: "",
    month: new Date().toISOString().slice(0, 7)
  });

  const [budgets, setBudgets] = useState([]);
  const [editId, setEditId] = useState(null);

  const fetchBudgets = useCallback(async () => {
    try {

      const res = await API.get(`/budgets?month=${form.month}`);
      setBudgets(res.data);

    } catch (err) {
      console.log(err);
    }
  }, [form.month]);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!form.amount) {
      alert("Enter budget amount");
      return;
    }

    try {

      if (editId) {

        await API.put(`/budgets/${editId}`, {
          category: form.category,
          amount: Number(form.amount),
          month: form.month
        });

        setEditId(null);

      } else {

        await API.post("/budgets", {
          category: form.category,
          amount: Number(form.amount),
          month: form.month
        });

      }

      setForm({
        ...form,
        category: "Food",
        amount: ""
      });

      fetchBudgets();

    } catch (err) {
      console.log(err);
    }

  };

  const deleteBudget = async (id) => {

    try {

      await API.delete(`/budgets/${id}`);
      fetchBudgets();

    } catch (err) {
      console.log(err);
    }

  };

  const editBudget = (budget) => {

    setForm({
      category: budget.category,
      amount: budget.amount,
      month: budget.month
    });

    setEditId(budget._id);

  };

  return (

    <div className="budget-page">

      <h2 className="budget-title">Budget Manager</h2>

      <div className="budget-layout">

        {/* TABLE */}

        <div className="budget-table-box">

          <table className="budget-table">

            <thead>

              <tr>
                <th>Month</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>

            </thead>

            <tbody>

              {budgets.length === 0 ? (

                <tr>
                  <td colSpan="5" className="no-data">
                    No budgets found
                  </td>
                </tr>

              ) : (

                budgets.map(b => (

                  <tr key={b._id}>

                    <td>{b.month}</td>

                    <td>{b.category}</td>

                    <td>₹{b.amount}</td>

                    <td>

                      <button
                        className="edit-btn"
                        onClick={() => editBudget(b)}
                      >
                        Edit
                      </button>

                    </td>

                    <td>

                      <button
                        className="delete-btn"
                        onClick={() => deleteBudget(b._id)}
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>


        {/* FORM */}

        <div className="budget-form-box">

          <h3>
            {editId ? "Edit Budget" : "Add Budget"}
          </h3>

          <form onSubmit={handleSubmit}>

            <label>Month</label>

            <input
              type="month"
              value={form.month}
              onChange={(e) =>
                setForm({ ...form, month: e.target.value })
              }
            />

            <label>Category</label>

            <select
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
            >

              {categories.map(c => (
                <option key={c}>{c}</option>
              ))}

            </select>

            <label>Budget Amount</label>

            <input
              type="number"
              placeholder="Enter Budget"
              value={form.amount}
              onChange={(e) =>
                setForm({ ...form, amount: e.target.value })
              }
            />

            <button className="save-budget-btn">

              {editId ? "Update Budget" : "Save Budget"}

            </button>

          </form>

        </div>

      </div>

    </div>

  );

}