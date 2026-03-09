import { useState, useEffect, useCallback } from "react";
import API from "../services/api";
import "./AddIncome.css";

const categories = ["Salary","Freelance","Bonus"];

// ✅ Income limit = ₹5 Lakhs
const INCOME_LIMIT = 500000;

export default function AddIncome(){

  const [form,setForm] = useState({
    amount:"",
    category:"Salary",
    date:new Date().toISOString().split("T")[0],
    description:""
  });

  const [incomes,setIncomes] = useState([]);
  const [editId,setEditId] = useState(null);

  const fetchIncome = useCallback(async ()=>{

    try{

      const res = await API.get("/transactions");

      const incomeList = res.data.filter(
        t=>t.type==="income"
      );

      setIncomes(incomeList);

    }catch(err){
      console.log(err);
    }

  },[]);

  useEffect(()=>{
    fetchIncome();
  },[fetchIncome]);

  const handleSubmit = async(e)=>{

    e.preventDefault();

    // ✅ Income limit validation
    if(Number(form.amount) > INCOME_LIMIT){
      alert("Income cannot exceed ₹5,00,000");
      return;
    }

    try{

      if(editId){

        await API.put(`/transactions/${editId}`,{
          ...form,
          type:"income"
        });

        setEditId(null);

      }else{

        await API.post("/transactions",{
          ...form,
          type:"income"
        });

      }

      setForm({
        amount:"",
        category:"Salary",
        date:new Date().toISOString().split("T")[0],
        description:""
      });

      fetchIncome();

    }catch(err){
      console.log(err);
    }

  };

  const deleteIncome = async(id)=>{

    try{

      await API.delete(`/transactions/${id}`);

      fetchIncome();

    }catch(err){
      console.log(err);
    }

  };

  const editIncome = (income)=>{

    setForm({
      amount:income.amount,
      category:income.category,
      date:income.date.slice(0,10),
      description:income.description || ""
    });

    setEditId(income._id);

  };

  return(

    <div className="income-page">

      <h2 className="Add-income-heading">Add Income</h2>

      <div className="income-layout">

        {/* TABLE */}

        <div className="income-table-box">

          <table className="income-table">

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

              {incomes.length===0 ?(

                <tr>
                  <td colSpan="5" className="no-data">
                    No income added
                  </td>
                </tr>

              ):(

                incomes.map(i=>(

                  <tr key={i._id}>

                    <td>{new Date(i.date).toLocaleDateString()}</td>

                    <td>{i.category}</td>

                    <td>₹{i.amount}</td>

                    <td>
                      <button
                        className="edit-btn"
                        onClick={()=>editIncome(i)}
                      >
                        Edit
                      </button>
                    </td>

                    <td>
                      <button
                        className="delete-btn"
                        onClick={()=>deleteIncome(i._id)}
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

        <div className="income-form-box">

          <h3>{editId?"Edit Income":"Add Income"}</h3>

          <form onSubmit={handleSubmit}>

            <input
              type="number"
              placeholder="Amount"
              max={INCOME_LIMIT}
              value={form.amount}
              onChange={(e)=>
                setForm({...form,amount:e.target.value})
              }
            />

            {/* Optional message */}
            <p style={{fontSize:"12px",color:"#888"}}>
              Maximum allowed: ₹5,00,000
            </p>

            <select
              value={form.category}
              onChange={(e)=>
                setForm({...form,category:e.target.value})
              }
            >

              {categories.map(c=>(
                <option key={c}>{c}</option>
              ))}

            </select>

            <input
              type="date"
              value={form.date}
              onChange={(e)=>
                setForm({...form,date:e.target.value})
              }
            />

            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e)=>
                setForm({...form,description:e.target.value})
              }
            />

            <button className="save-btn">
              {editId?"Update Income":"Save Income"}
            </button>

          </form>

        </div>

      </div>

    </div>

  );

}