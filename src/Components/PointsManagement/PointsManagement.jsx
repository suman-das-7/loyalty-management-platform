import React, { useState, useEffect } from "react";
import supabase from "../../supabaseClient";
import "./PointsManagement.css";

const PointsManagement = () => {
  const [usernames, setUsernames] = useState([]);
  const [selectedUsername, setSelectedUsername] = useState("");
  const [operationType, setOperationType] = useState("Credit");
  const [points, setPoints] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [memberId, setMemberId] = useState("");

  useEffect(() => {
    fetchUsernames();
  }, []);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (selectedUsername) {
      fetchMemberId(selectedUsername);
    }
  }, [selectedUsername]);

  const fetchUsernames = async () => {
    let { data: Members, error } = await supabase
      .from("Members")
      .select("name")
      .order("name", { ascending: true });

    if (error) console.error("Error fetching usernames:", error);
    else setUsernames([...new Set(Members.map((tx) => tx.name))]);
  };

  const fetchMemberId = async (username) => {
    let { data: Members, error } = await supabase
      .from("Members")
      .select("member_id")
      .eq("name", username)
      .single();

    if (error) console.error("Error fetching member ID:", error);
    else setMemberId(Members ? Members.member_id : "");
  };

  const handleInsert = async () => {
    if (!memberId) {
      console.error("Member ID is not available.");
      return;
    }

    const { data, error } = await supabase.from("Transactions").insert([
      {
        member_id: memberId,
        username: selectedUsername,
        operation_type: operationType,
        credited_date_and_time: new Date().toISOString(),
        status: "completed",
        points: parseInt(points),
      },
    ]);

    if (error) {
      console.error("Error inserting transaction:", error);
      setSuccessMessage("");
    } else {
      console.log("Transaction inserted successfully:", data);
      setSuccessMessage("Transaction successfull !");
      setSelectedUsername("");
      setOperationType("Credit");
      setPoints("");
      setMemberId("");
    }
  };

  return (
    <div className="points-management">
      <h2>Points Management</h2>
      <div className="form-group">
        <label>Select Username:</label>
        <select
          value={selectedUsername}
          onChange={(e) => setSelectedUsername(e.target.value)}
        >
          <option value="">Select Username</option>
          {usernames.map((username) => (
            <option key={username} value={username}>
              {username}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Operation Type:</label>
        <select
          value={operationType}
          onChange={(e) => setOperationType(e.target.value)}
        >
          <option value="Credit">Credit</option>
          <option value="Debit">Debit</option>
        </select>
      </div>
      <div className="form-group">
        <label>Points:</label>
        <input
          type="number"
          value={points}
          onChange={(e) => setPoints(e.target.value)}
        />
      </div>
      <button onClick={handleInsert}>Submit</button>
      {successMessage && <p className="success-message">{successMessage}</p>}
    </div>
  );
};

export default PointsManagement;
