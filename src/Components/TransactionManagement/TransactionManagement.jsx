import React, { useEffect, useState } from "react";
import supabase from "../../supabaseClient";
import "./TransactionManagement.css";

const TransactionManagement = () => {
  const [transactions, setTransactions] = useState([]);
  const [usernames, setUsernames] = useState([]);
  const [selectedUsername, setSelectedUsername] = useState("");
  const [totalPoints, setTotalPoints] = useState(null); // State to store total points
  const [showTotalPoints, setShowTotalPoints] = useState(false); // State to control the display of total points

  useEffect(() => {
    const fetchTransactionsAndUsernames = async () => {
      const { data: transactionsData, error: transactionsError } =
        await supabase.from("Transactions").select("*");

      if (transactionsError) {
        console.error("Error fetching transactions:", transactionsError);
      } else {
        setTransactions(transactionsData);

        // Fetch usernames only after getting all transactions
        const uniqueUsernames = [
          ...new Set(transactionsData.map((item) => item.username)),
        ];
        setUsernames(uniqueUsernames);
      }
    };

    fetchTransactionsAndUsernames();
  }, []);

  const handleViewTransactions = async () => {
    if (!selectedUsername) {
      // If no username is selected, fetch all transactions
      const { data, error } = await supabase.from("Transactions").select("*");

      if (error) {
        console.error("Error fetching transactions:", error);
      } else {
        setTransactions(data);
        setShowTotalPoints(false); // Hide total points when showing all transactions
      }
    } else {
      // Fetch transactions for the selected username
      const { data, error } = await supabase
        .from("Transactions")
        .select("*")
        .eq("username", selectedUsername);

      if (error) {
        console.error("Error fetching transactions:", error);
      } else {
        setTransactions(data);
        // Update total points when a username is selected
        await updateTotalPoints(selectedUsername);
        setShowTotalPoints(true); // Show total points when a specific username is selected
      }
    }
  };

  const updateTotalPoints = async (username) => {
    // Fetch member's current points
    const { data: memberData, error: memberError } = await supabase
      .from("Members")
      .select("points")
      .eq("name", username)
      .single();

    if (memberError) {
      console.error("Error fetching member points:", memberError);
      setTotalPoints(null);
      return;
    }

    const currentPoints = memberData?.points || 0;

    // Fetch transactions for the selected username
    const { data: transactionsData, error: transactionsError } = await supabase
      .from("Transactions")
      .select("operation_type, points")
      .eq("username", username);

    if (transactionsError) {
      console.error("Error fetching transactions:", transactionsError);
      setTotalPoints(null);
      return;
    }

    // Calculate total points
    const total = transactionsData.reduce((acc, transaction) => {
      if (transaction.operation_type === "Credit") {
        return acc + transaction.points;
      } else if (transaction.operation_type === "Debit") {
        return acc - transaction.points;
      }
      return acc;
    }, currentPoints);

    setTotalPoints(total);
  };

  return (
    <div className="transaction-management">
      <h1>Transaction Management</h1>
      <div className="search-box">
        <select
          value={selectedUsername}
          onChange={(e) => setSelectedUsername(e.target.value)}
        >
          <option value="">Show All</option>
          {usernames.map((username, index) => (
            <option key={index} value={username}>
              {username}
            </option>
          ))}
        </select>
        <button onClick={handleViewTransactions}>View Transactions</button>
      </div>
      {showTotalPoints && totalPoints !== null && (
        <div className="total-points">
          <h2>Total Points: {totalPoints}</h2>
        </div>
      )}
      <table>
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Member ID</th>
            <th>Username</th>
            <th>Operation Type</th>
            <th>Credited Date and Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.transaction_id}>
              <td>{transaction.transaction_id}</td>
              <td>{transaction.member_id}</td>
              <td>{transaction.username}</td>
              <td>{transaction.operation_type}</td>
              <td>{transaction.credited_date_and_time}</td>
              <td>{transaction.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionManagement;
