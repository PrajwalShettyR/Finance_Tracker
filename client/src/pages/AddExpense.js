import { useEffect, useState } from "react";
import API from "../services/api";
import "./AddExpense.css";

const categories = [
  "Food",
  "Travel",
  "Clothes",
  "Shopping",
  "Bills",
  "Entertainment",
  "Medical",
  "Education",
  "Other"
];

export default function AddExpense() {

  const [form, setForm] = useState({
    amount: "",
    category: "Food",
    date: new Date().toISOString().slice(0,10),
    description: ""
  });

  const [expenses, setExpenses] = useState([]);
  const [editId, setEditId] = useState(null);

  const fetchExpenses = async () => {

    try{

      const res = await API.get("/transactions");

      const expenseOnly = res.data.filter(
        t => t.type === "expense"
      );

      setExpenses(expenseOnly);

    }catch(err){
      console.log(err);
    }

  };

  useEffect(()=>{
    fetchExpenses();
  },[]);

  const handleSubmit = async(e)=>{

    e.preventDefault();

    if(!form.amount || form.amount <= 0){
      return alert("Enter valid amount");
    }

    if(editId){

      await API.put(`/transactions/${editId}`,{
        ...form,
        type:"expense"
      });

      setEditId(null);

    }else{

      await API.post("/transactions",{
        ...form,
        type:"expense"
      });

    }

    setForm({
      amount:"",
      category:"Food",
      date:new Date().toISOString().slice(0,10),
      description:""
    });

    fetchExpenses();

  };

  const deleteExpense = async(id)=>{
    await API.delete(`/transactions/${id}`);
    fetchExpenses();
  };

  const editExpense = (expense)=>{

    setForm({
      amount:expense.amount,
      category:expense.category,
      date:expense.date?.slice(0,10),
      description:expense.description
    });

    setEditId(expense._id);

  };

  const getCategoryDisplay = (t)=>{

    if(t.category === "Other"){

      return t.description && t.description.trim() !== ""
        ? t.description
        : "Others";

    }

    return t.category;

  };

  return (

    <div className="expense-page">

      <h2 className="expense-title">Expense Manager</h2>

      <div className="expense-layout">

        {/* TABLE */}

        <div className="expense-table-box">

          <table className="expense-table">

            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>

            <tbody>

              {expenses.length === 0 ? (

                <tr>
                  <td colSpan="5" className="no-data">
                    No expenses found
                  </td>
                </tr>

              ) : (

                expenses.map(e => (

                  <tr key={e._id}>

                    <td>{new Date(e.date).toLocaleDateString()}</td>

                    <td>{getCategoryDisplay(e)}</td>

                    <td>₹{e.amount}</td>

                    <td>
                      <button
                        className="edit-btn"
                        onClick={()=>editExpense(e)}
                      >
                        Edit
                      </button>
                    </td>

                    <td>
                      <button
                        className="delete-btn"
                        onClick={()=>deleteExpense(e._id)}
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

        <div className="expense-form-box">

          <h3>
            {editId ? "Edit Expense" : "Add Expense"}
          </h3>

          <form onSubmit={handleSubmit}>

            <input
              type="number"
              placeholder="Amount"
              value={form.amount}
              onChange={(e)=>
                setForm({
                  ...form,
                  amount:Number(e.target.value)
                })
              }
            />

            <select
              value={form.category}
              onChange={(e)=>
                setForm({
                  ...form,
                  category:e.target.value
                })
              }
            >

              {categories.map(cat=>(
                <option key={cat}>{cat}</option>
              ))}

            </select>

            <input
              type="date"
              value={form.date}
              onChange={(e)=>
                setForm({
                  ...form,
                  date:e.target.value
                })
              }
            />

            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e)=>
                setForm({
                  ...form,
                  description:e.target.value
                })
              }
            />

            <button className="save-expense-btn">

              {editId ? "Update Expense" : "Add Expense"}

            </button>

          </form>

        </div>

      </div>

    </div>

  );

}