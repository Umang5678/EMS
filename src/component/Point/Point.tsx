import React, { useEffect, useState } from "react";
import api from "./../../../axiosConfig";
import "./Point.css";
import { FaEdit, FaTrash } from "react-icons/fa";

interface PointCategory {
  id: string;
  category_id?: string;
  name: string;
  description: string;
  point_min: number;
  point_max: number;
  is_active: boolean;
}

const PointCategoryManager: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    point_min: 0,
    point_max: 0,
  });

  const [categories, setCategories] = useState<PointCategory[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<Partial<PointCategory>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] =
    useState<PointCategory | null>(null);

  const [showModal, setShowModal] = useState(false);

  const token = localStorage.getItem("token");

  const fetchCategories = async () => {
    try {
      const res = await api.post(
        "/points/category/list",
        { include_inactive: true },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.success) {
        setCategories(res.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes("point_") ? Number(value) : value,
    }));
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditingData((prev) => ({
      ...prev,
      [name]: name.includes("point_") ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    console.log("Submitting form:", formData);

    try {
      const res = await api.post("/points/category/add", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        setFormData({
          name: "",
          description: "",
          point_min: 0,
          point_max: 0,
        });
        fetchCategories();
        setShowAddModal(false);
      } else {
        setMessage("Failed to add category.");
      }
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (category: PointCategory) => {
    const categoryId = category.category_id || category.id;

    setEditingId(categoryId);
    setEditingData({
      category_id: categoryId,
      name: category.name,
      description: category.description,
      point_min: category.point_min,
      point_max: category.point_max,
    });
    setShowModal(true);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingData({});
  };
  const handleUpdate = async () => {
    try {
      if (!editingData.category_id) {
        console.error("category_id is missing, cannot proceed with update.");
        return;
      }

      const response = await api.put("/points/category/update", {
        category_id: editingData.category_id,
        name: editingData.name,
        description: editingData.description,
        point_min: editingData.point_min,
        point_max: editingData.point_max,
      });

      if (response.data.success) {
        setEditingId(null);
        setEditingData({});
        setShowModal(false);
        fetchCategories();
      } else {
        alert("Failed to update category: " + response.data.message);
      }
    } catch (error) {
      console.error("Update failed:", error);
      alert("An error occurred while updating the category.");
    }
  };

  const toggleStatus = async (categoryId: string, currentStatus: boolean) => {
    const category = categories.find(
      (cat) => cat.id === categoryId || cat.category_id === categoryId
    );

    if (!category) {
      setMessage("⚠️ Category not found.");
      return;
    }

    try {
      const res = await api.put(
        "/points/category/update/status",
        {
          category_id: category.category_id || category.id,
          is_active: !currentStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        fetchCategories();
      } else {
        setMessage(" Failed to update status.");
      }
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Error updating status.");
    }
  };

  const handleDelete = async (categoryId: string) => {
    try {
      const res = await api.delete("/points/category/delete", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          category_id: categoryId, //
        },
      });

      if (res.data.success) {
        fetchCategories();
      } else {
        setMessage("❌ Failed to delete category.");
      }
    } catch (err: any) {
      setMessage(
        err.response?.data?.message || "Error while deleting category."
      );
    }
  };

  return (
    <div className="point-category-manager">
      <button
        style={{
          margin: 3,
          width: 150,
          padding: 5,
          marginTop: 20,
          marginBottom: 10,
          float: "right",
        }}
        onClick={() => setShowAddModal(true)}
      >
        + Add Category
      </button>

      {showAddModal && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowAddModal(false);
            }
          }}
        >
          <div className="modal">
            <h3 className="head">Add Category</h3>

            <p style={{ marginLeft: 5, marginBottom: 4 }}>Name:</p>
            <label className="label1">
              <input
                style={{ width: 356 }}
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
              />
            </label>

            <p style={{ marginLeft: 5, marginBottom: 4 }}>Description:</p>
            <label>
              <textarea
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
              />
            </label>

            <div className="row">
              <label className="row1">
                <p style={{ marginLeft: 4, marginBottom: 4 }}>Min Points:</p>
                <input
                  type="text"
                  name="point_min"
                  required
                  value={formData.point_min}
                  onChange={handleChange}
                  min={0}
                />
              </label>

              <label className="row2">
                <p style={{ marginLeft: 4, marginBottom: 4 }}>Max Points:</p>
                <input
                  type="text"
                  name="point_max"
                  required
                  value={formData.point_max}
                  onChange={handleChange}
                  min={0}
                />
              </label>
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button onClick={handleSubmit} disabled={loading}>
                {loading ? "Adding..." : "Add"}
              </button>
              <button
                style={{ backgroundColor: "gray" }}
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <br />

      {message && <p>{message}</p>}

      <table className="category-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Min</th>
            <th>Max</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {categories.length === 0 ? (
            <tr>
              <td colSpan={6}>No categories found.</td>
            </tr>
          ) : (
            categories.map((cat) => (
              <tr key={cat.id}>
                <td>{cat.name}</td>
                <td>{cat.description}</td>
                <td>{cat.point_min}</td>
                <td>{cat.point_max}</td>
                <td>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={cat.is_active}
                      onChange={() =>
                        toggleStatus(cat.category_id || cat.id, cat.is_active)
                      }
                    />
                    <span className="slider round"></span>
                  </label>
                </td>
                <td>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      style={{ background: "#2563eb", height: 40, width: 40 }}
                      onClick={() => handleEditClick(cat)}
                    >
                      <FaEdit
                        style={{ paddingLeft: 2, height: 20, width: 20 }}
                      />
                    </button>
                    <button
                      style={{ background: "#4b5563", height: 40, width: 40 }}
                      onClick={() => {
                        setCategoryToDelete(cat);
                        setShowDeleteModal(true);
                      }}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showDeleteModal && categoryToDelete && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowDeleteModal(false);
            }
          }}
        >
          <div className="modal">
            <h3>Confirm Delete</h3>
            <p>
              Are you sure you want to delete the{" "}
              <strong>{categoryToDelete.name}</strong>?
            </p>
            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button
                style={{ backgroundColor: "red", color: "white" }}
                onClick={() => {
                  handleDelete(
                    categoryToDelete.category_id || categoryToDelete.id
                  );
                  setShowDeleteModal(false);
                  setCategoryToDelete(null);
                }}
              >
                Yes, Delete
              </button>
              <button
                style={{ backgroundColor: "gray" }}
                onClick={() => {
                  setShowDeleteModal(false);
                  setCategoryToDelete(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
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
          <div className="modal">
            <h3 className="head">Edit Category</h3>

            <p style={{ marginLeft: 5, marginBottom: 4 }}>Name:</p>
            <label className="label1">
              <input
                style={{ width: 356 }}
                type="text"
                name="name"
                value={editingData.name ?? ""}
                onChange={handleEditChange}
              />
            </label>

            <p style={{ marginLeft: 5, marginBottom: 4 }}>Description:</p>

            <label>
              <textarea
                name="description"
                value={editingData.description ?? ""}
                onChange={handleEditChange}
              />
            </label>
            <div className="row">
              <label className="row1">
                <p style={{ marginLeft: 4, marginBottom: 4 }}>Min Points:</p>
                <input
                  type="text"
                  name="point_min"
                  value={editingData.point_min ?? 0}
                  onChange={handleEditChange}
                  min={0}
                />
              </label>

              <label className="row2">
                <p style={{ marginLeft: 4, marginBottom: 4 }}>Max Points:</p>
                <input
                  type="text"
                  name="point_max"
                  value={editingData.point_max ?? 0}
                  onChange={handleEditChange}
                  min={0}
                />
              </label>
            </div>
            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button onClick={handleUpdate}>Save</button>
              <button
                style={{ backgroundColor: "gray" }}
                onClick={() => {
                  setShowModal(false);
                  setEditingId(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PointCategoryManager;
