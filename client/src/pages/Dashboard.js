import { useEffect, useState, useCallback } from "react";
import API from "../services/api";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

import "./Dashboard.css";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

export default function Dashboard() {

  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);

  const [month, setMonth] = useState(
    new Date().toISOString().slice(0,7)
  );

  const fetchData = useCallback(async () => {

    try {

      const t = await API.get(`/transactions?month=${month}`);
      const b = await API.get(`/budgets?month=${month}`);

      setTransactions(t.data);
      setBudgets(b.data);

    } catch(err){
      console.log(err);
    }

  },[month]);

  useEffect(()=>{
    fetchData();
  },[fetchData]);

  const income = transactions
    .filter(t=>t.type==="income")
    .reduce((a,b)=>a+b.amount,0);

  const expense = transactions
    .filter(t=>t.type==="expense")
    .reduce((a,b)=>a+b.amount,0);

  const balance = income-expense;

  const pieData={
    labels:["Income","Expense"],
    datasets:[
      {
        data:[income,expense],
        backgroundColor:["#22ff73","#fd4141"]
      }
    ]
  };

  const getCategoryDisplay=(t)=>{
    if(t.category==="Other"){
      return t.description && t.description.trim()!=="" ? t.description : "Others";
    }
    return t.category;
  };

  const expenseTransactions = transactions.filter(
    t=>t.type==="expense"
  );

  const categories=[
    ...new Set(
      expenseTransactions.map(t=>getCategoryDisplay(t))
    )
  ];

  const spentAmounts = categories.map(c =>
    expenseTransactions
      .filter(t=>getCategoryDisplay(t)===c)
      .reduce((a,b)=>a+b.amount,0)
  );

  const budgetAmounts = categories.map(c=>{
    const found = budgets.find(b=>b.category===c);
    return found ? found.amount : 0;
  });

  const budgetChart={
    labels:categories,
    datasets:[
      {
        label:"Budget",
        data:budgetAmounts,
        backgroundColor:"#3b82f6"
      },
      {
        label:"Spent",
        data:spentAmounts,
        backgroundColor:"#f43f5e"
      }
    ]
  };

  return(

    <div className="dashboard">

      <h2 className="dashboard-title">Dashboard</h2>

      <input
        type="month"
        className="month-selector"
        value={month}
        onChange={(e)=>setMonth(e.target.value)}
      />

      {/* SUMMARY */}

      <div className="summary-cards">

        <div className="card income-card">
          <h4>Total Income</h4>
          <p>₹{income}</p>
        </div>

        <div className="card expense-card">
          <h4>Total Expense</h4>
          <p>₹{expense}</p>
        </div>

        <div className="card balance-card">
          <h4>Balance</h4>
          <p>₹{balance}</p>
        </div>

      </div>

      {/* TRANSACTION TABLE */}

      <div className="table-container">

        <table className="transaction-table">

          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Type</th>
            </tr>
          </thead>

          <tbody>

            {transactions.map(t=>(

              <tr key={t._id}>

                <td>{new Date(t.date).toLocaleDateString()}</td>

                <td>{getCategoryDisplay(t)}</td>

                <td>₹{t.amount}</td>

                <td className={t.type==="income" ? "income-text" : "expense-text"}>
                  {t.type}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* CHARTS */}

      <div className="charts">

        <div className="chart-box">

          <h4>Income vs Expense</h4>

          <div className="chart">
            <Pie data={pieData} options={{maintainAspectRatio:false}}/>
          </div>

        </div>

        <div className="chart-box">

          <h4>Budget vs Spent</h4>

          <div className="chart">
            <Bar data={budgetChart} options={{maintainAspectRatio:false}}/>
          </div>

        </div>

      </div>

    </div>
  );
}