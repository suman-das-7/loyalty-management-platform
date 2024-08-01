import React, { useState } from "react";
import supabase from "../../supabaseClient";
import "./AddMember.css";

const AddMember = () => {
  const [newMember, setNewMember] = useState({
    member_id: "",
    name: "",
    email: "",
    points: 0,
  });
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewMember({ ...newMember, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data, error } = await supabase
        .from("Members")
        .insert([newMember]);
      if (error) {
        console.error("Error inserting member:", error.message);
        setMessage("Error adding member. Please try again.");
        setTimeout(() => setMessage(""), 3000);
      } else {
        console.log("Insert operation data:", data);
        setMessage("Member added successfully!");
        setNewMember({ member_id: "", name: "", email: "", points: 0 });
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error inserting member:", error.message);
      setMessage("Error adding member. Please try again.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="add-member-form">
      <h2>Add New Member</h2>
      {message && <div className="success-message">{message}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="member_id"
          placeholder="Member ID"
          value={newMember.member_id}
          onChange={handleChange}
        />
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={newMember.name}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={newMember.email}
          onChange={handleChange}
        />
        <input
          type="number"
          name="points"
          placeholder="Points"
          value={newMember.points}
          onChange={handleChange}
        />
        <button type="submit">Add Member</button>
      </form>
    </div>
  );
};

export default AddMember;
