import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRequest, putRequest, deleteRequest } from "../services/apiService";
import { toast } from "react-toastify";
import Modal from "./Modal";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Session expired, please log in again.", { theme: "dark" });
      navigate("/");
    }
  }, [navigate]);

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        toast.error("Session expired, please log in again.", { theme: "dark" });
        localStorage.removeItem("token");
        navigate("/");
      }
      return Promise.reject(error);
    }
  );

  // Fetch users
  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const response = await getRequest(`/api/users`, { page });
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      toast.error("Failed to fetch users", { theme: "dark" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        (user) =>
          user.first_name
            .toLowerCase()
            .includes(e.target.value.toLowerCase()) ||
          user.last_name.toLowerCase().includes(e.target.value.toLowerCase()) ||
          user.email.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    });
  };

  const handleUpdate = async () => {
    if (!formData.first_name || !formData.last_name || !formData.email) {
      toast.error("All fields are required.", { theme: "dark" });
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      toast.error("Please enter a valid email address.", { theme: "dark" });
      return;
    }

    try {
      await putRequest(`/api/users/${editingUser.id}`, formData);
      toast.success(
        `${formData.first_name} ${formData.last_name} edited successfully!`,
        { theme: "dark" }
      );
      fetchUsers(currentPage);
      setEditingUser(null);
    } catch (error) {
      toast.error("Failed to update user", { theme: "dark" });
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    try {
      await deleteRequest(`/api/users/${id}`);
      toast.success("User deleted successfully", { theme: "dark" });
      setUsers(users.filter((user) => user.id !== id));
      setFilteredUsers(filteredUsers.filter((user) => user.id !== id));
    } catch (error) {
      toast.error("Failed to delete user", { theme: "dark" });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center">User Management</h2>
      <div className="mb-4 flex flex-col md:flex-row justify-between items-center">
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded mb-2 md:mb-0"
          onClick={() => navigate("/")}
        >
          Back To Login
        </button>
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search by name or email..."
            className="px-4 py-2 w-full border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-4">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          {filteredUsers.length > 0 ? (
            <table className="min-w-full bg-white border rounded-lg shadow">
              <thead className="bg-gray-200">
                <tr className="text-left text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 border-b">Avatar</th>
                  <th className="py-3 px-6 border-b">First Name</th>
                  <th className="py-3 px-6 border-b">Last Name</th>
                  <th className="py-3 px-6 border-b">Email</th>
                  <th className="py-3 px-6 border-b">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-100">
                    <td className="py-3 px-6 flex items-center">
                      <img
                        src={user.avatar}
                        alt={user.first_name}
                        className="w-10 h-10 rounded-full border mr-2"
                      />
                    </td>
                    <td className="py-3 px-6">{user.first_name}</td>
                    <td className="py-3 px-6">{user.last_name}</td>
                    <td className="py-3 px-6">{user.email}</td>
                    <td className="py-3 px-6">
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600"
                        onClick={() => handleEdit(user)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        onClick={() => handleDelete(user.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-6 text-gray-600">
              No users found.
            </div>
          )}
        </div>
      )}

      <div className="mt-6 flex justify-center">
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded"
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>

      {editingUser && (
        <Modal onClose={() => setEditingUser(null)}>
          <h3 className="text-xl font-bold mb-4">Edit User</h3>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            placeholder="First Name"
            className="p-2 mb-2 border rounded w-full"
            required
          />
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            placeholder="Last Name"
            className="p-2 mb-2 border rounded w-full"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="p-2 mb-2 border rounded w-full"
            required
          />
          <div className="flex justify-end">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-600"
              onClick={handleUpdate}
            >
              Update
            </button>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              onClick={() => setEditingUser(null)}
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default UserList;
