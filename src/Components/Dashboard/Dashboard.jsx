import React, { useEffect, useState } from "react";
import supabase from "../../supabaseClient";
import { Bar, Pie, Line } from "react-chartjs-2";
import "chart.js/auto";
import "./Dashboard.css";

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const { data, error } = await supabase.from("Transactions").select("*");

    if (error) {
      console.error("Error fetching transactions:", error);
    } else {
      setTransactions(data);
    }
  };

  const getTransactionCountsByDate = () => {
    const counts = {};
    transactions.forEach((transaction) => {
      const date = new Date(transaction.credited_date_and_time)
        .toISOString()
        .split("T")[0];
      counts[date] = (counts[date] || 0) + 1;
    });
    return counts;
  };

  const getOperationTypeCounts = () => {
    const counts = { Credit: 0, Debit: 0 };
    transactions.forEach((transaction) => {
      counts[transaction.operation_type] += 1;
    });
    return counts;
  };

  const transactionCountsByDate = getTransactionCountsByDate();
  const operationTypeCounts = getOperationTypeCounts();

  const barData = {
    labels: Object.keys(transactionCountsByDate),
    datasets: [
      {
        label: "Number of Transactions",
        data: Object.values(transactionCountsByDate),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const pieData = {
    labels: ["Credit", "Debit"],
    datasets: [
      {
        label: "Transaction Types",
        data: [operationTypeCounts.Credit, operationTypeCounts.Debit],
        backgroundColor: ["rgba(54, 162, 235, 0.6)", "rgba(255, 99, 132, 0.6)"],
      },
    ],
  };

  const lineData = {
    labels: Object.keys(transactionCountsByDate),
    datasets: [
      {
        label: "Number of Transactions",
        data: Object.values(transactionCountsByDate),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
        fill: false,
      },
    ],
  };

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div className="charts-container">
        <div className="chart1">
          <h3>Transactions Over Time (Bar Chart)</h3>
          <Bar data={barData} />
        </div>
        <div className="chart2">
          <h3>Credit vs Debit Transactions (Pie Chart)</h3>
          <Pie data={pieData} />
        </div>
      </div>
      <div className="chart3">
        <h3>Transactions Over Time (Line Chart)</h3>
        <Line data={lineData} />
      </div>
    </div>
  );
};

export default Dashboard;
