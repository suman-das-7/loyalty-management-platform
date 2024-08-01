import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import supabase from "../../supabaseClient";
import "./MemberManagement.css";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";

const MemberManagement = () => {
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const { data, error } = await supabase.from("Members").select("*");
    if (error) {
      console.error(error);
    } else {
      setMembers(data);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleEdit = async (id, field, value) => {
    const { error } = await supabase
      .from("Members")
      .update({ [field]: value })
      .eq("id", id);
    if (error) {
      console.error(error);
      setMessage("Error updating member. Please try again.");
      setTimeout(() => setMessage(""), 3000);
    } else {
      fetchMembers();
      setMessage("Member updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleDelete = async (user_id) => {
    try {
      const { error } = await supabase
        .from("Members")
        .delete()
        .eq("user_id", user_id);
      if (error) {
        throw error;
      }
      setMembers(members.filter((member) => member.user_id !== user_id));
      setMessage("Member deleted successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error deleting member:", error.message);
      setMessage("Error deleting member. Please try again.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const filteredMembers = members.filter((member) =>
    member.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="transaction-form">
      <h1>Member Management</h1>
      {message && <div className="success-message">{message}</div>}
      <div className="search-add-container">
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={handleSearch}
          className="search-bar"
        />
        <Link to="/add-member">
          <button className="add-member-button">Add New Member</button>
        </Link>
      </div>
      <table className="members-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Member ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Points</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredMembers.map((member) => (
            <tr key={member.id}>
              <td>{member.id}</td>
              <td>{member.member_id}</td>
              <td>
                <input
                  type="text"
                  value={member.name}
                  onChange={(e) =>
                    handleEdit(member.id, "name", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="text"
                  value={member.email}
                  onChange={(e) =>
                    handleEdit(member.id, "email", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="number"
                  value={member.points}
                  onChange={(e) =>
                    handleEdit(member.id, "points", e.target.value)
                  }
                />
              </td>
              <td>
                <AiFillEdit
                  className="edit-icon"
                  onClick={() => handleEdit(member.id, "name", member.name)}
                />
                <AiFillDelete
                  className="delete-icon"
                  onClick={() => handleDelete(member.user_id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MemberManagement;
