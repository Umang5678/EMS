import React, { useEffect, useState, useRef } from "react";
import Attendance from "../Attendance/Attendance";
import api from "./../../../axiosConfig";
import { FaUserPlus, FaEdit, FaPlus } from "react-icons/fa";
import "./Userlist";
interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "staff";
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserName, setSelectedUserName] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editFormData, setEditFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
  });
  const [highlightedUserId, setHighlightedUserId] = useState<string | null>(
    null,
  );

  // const handleEditClick = (user: User) => {
  //   setEditingUser(user);
  //   setEditFormData({
  //     first_name: user.first_name,
  //     last_name: user.last_name,
  //     email: user.email,
  //     phone_number: user.phone_number,
  //   });
  //   setShowEditModal(true);
  // };

  const attendanceRef = useRef<HTMLDivElement | null>(null);
  // const handleUpdateUser = async () => {
  //   if (!editingUser) return;

  //   const token = localStorage.getItem("token");
  //   if (!token) return;

  //   try {
  //     const response = await api.put(
  //       `/user/update/details`,
  //       {
  //         user_id: editingUser.user_id,
  //         ...editFormData,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       },
  //     );

  //     if (response.data.success) {
  //       alert("User updated successfully");
  //       setShowEditModal(false);
  //       fetchUsers();
  //     } else {
  //       alert("Update failed");
  //     }
  //   } catch (err: any) {
  //     console.error("Update error:", err.response?.data || err.message);
  //     alert("Error updating user");
  //   }
  // };

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    slack_id: "",
    user_type: "staff",
    is_active: true,
  });

  const fetchUsers = async () => {
    try {
      const response = await api.get("/admin/user/list");
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleStatus = async (userId: string, currentStatus: boolean) => {
    try {
      await api.put("/admin/user/update/status", {
        userId,
        isActive: !currentStatus,
      });

      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, isActive: !currentStatus } : u,
        ),
      );
    } catch (err) {
      console.error("Error updating status", err);
    }
  };

  const updateUserRole = async (userId: string, role: "admin" | "staff") => {
    try {
      await api.put("/admin/user/update/type", {
        userId,
        role,
      });

      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role } : u)),
      );
    } catch (err) {
      console.error("Error updating user role", err);
    }
  };

  const handleCloseAttendance = () => {
    setSelectedUserId(null);
    setSelectedUserName(null);
  };

  const handleRegisterUser = async () => {
    try {
      const response = await api.post("/admin/user/register", {
        name: `${formData.first_name} ${formData.last_name}`,
        email: formData.email,
        password: "123456", // or collect from UI
        role: formData.user_type,
      });

      if (response.data.success) {
        setShowModal(false);
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="user-list-container">
      <button className="register-btn" onClick={() => setShowModal(true)}>
        <FaUserPlus style={{ marginRight: "10px", paddingTop: "3px" }} />
        Register New User
      </button>

      <table className="user-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>User Type</th>
            <th>Status</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user._id}>
              <td>{index + 1}</td>
              <td
                className="clickable-user"
                onClick={() => {
                  setSelectedUserId(user._id);
                  setSelectedUserName(user.name);
                }}
              >
                {user.name}
              </td>

              <td>{user.email}</td>
              <td>{user.role}</td>
              <td data-label="Status">
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={user.isActive}
                    onChange={() => toggleStatus(user._id, user.isActive)}
                  />
                  <span className="slider round"></span>
                </label>
              </td>
              <td data-label="User Type">
                <select
                  value={user.role}
                  onChange={(e) =>
                    updateUserRole(
                      user._id,
                      e.target.value as "admin" | "staff",
                    )
                  }
                >
                  <option value="admin">Admin</option>
                  <option value="staff">Staff</option>
                </select>
              </td>
              <td>{new Date(user.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedUserId && selectedUserName && (
        <div className="attendance-modal" ref={attendanceRef}>
          <Attendance
            userId={selectedUserId}
            userName={selectedUserName}
            onClose={handleCloseAttendance}
            isAdmin={true}
          />
        </div>
      )}

      {showModal && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowModal(false);
            }
          }}
        >
          <div className="modal-content">
            <h3>Register New User</h3>
            <br />
            <input
              type="text"
              placeholder="First Name"
              value={formData.first_name}
              onChange={(e) =>
                setFormData({ ...formData, first_name: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={(e) =>
                setFormData({ ...formData, last_name: e.target.value })
              }
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={formData.phone_number}
              onChange={(e) =>
                setFormData({ ...formData, phone_number: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Slack ID"
              value={formData.slack_id}
              onChange={(e) =>
                setFormData({ ...formData, slack_id: e.target.value })
              }
            />

            <select
              value={formData.user_type}
              onChange={(e) =>
                setFormData({ ...formData, user_type: e.target.value })
              }
            >
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>

            <div className="form-group">
              <label htmlFor="is_active">Active Status</label>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) =>
                    setFormData({ ...formData, is_active: e.target.checked })
                  }
                />
                <span className="slider round"></span>
              </label>
            </div>

            <div className="modal-buttons">
              <button onClick={handleRegisterUser}>Register</button>
              <button
                className="cancel-btn"
                onClick={() => {
                  setShowModal(false);

                  setFormData({
                    first_name: "",
                    last_name: "",
                    email: "",
                    phone_number: "",
                    user_type: "staff",
                    is_active: true,
                    slack_id: "",
                  });
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {showEditModal && editingUser && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowEditModal(false);
            }
          }}
        >
          <div className="modal-content">
            <h3>Edit User</h3>
            <br />
            <input
              type="text"
              placeholder="First Name"
              value={editFormData.first_name}
              onChange={(e) =>
                setEditFormData({ ...editFormData, first_name: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Last Name"
              value={editFormData.last_name}
              onChange={(e) =>
                setEditFormData({ ...editFormData, last_name: e.target.value })
              }
            />
            <input
              type="email"
              placeholder="Email"
              value={editFormData.email}
              onChange={(e) =>
                setEditFormData({ ...editFormData, email: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={editFormData.phone_number}
              onChange={(e) =>
                setEditFormData({
                  ...editFormData,
                  phone_number: e.target.value,
                })
              }
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
