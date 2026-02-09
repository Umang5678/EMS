import React, { useState, useEffect } from "react";
import "./Leave.css";
import moment from "moment";
import api from "./../../../axiosConfig";

interface LeaveRequest {
  application_id: string;
  leave_type: string;
  applicant_first_name: string;
  applicant_last_name: string;
  reason: string;
  date: string;
  half: string;
  status: "pending" | "approved" | "rejected";
  review_comment?: string | null;
  reviewer_first_name?: string | null;
  reviewer_last_name?: string | null;
}

interface LeaveType {
  leave_type_id: string;
  name: string;
}

const Leave: React.FC = () => {
  const [formData, setFormData] = useState({
    leave_type_id: "",
    start_date: "",
    end_date: "",
    reason: "",
  });

  const [dateSelections, setDateSelections] = useState<{
    [key: string]: string;
  }>({});
  const [showForm, setShowForm] = useState(false);
  const [leaveList, setLeaveList] = useState<LeaveRequest[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const generateDateRange = (start: string, end: string) => {
    const range: string[] = [];
    let current = moment(start);
    const last = moment(end);
    while (current <= last) {
      range.push(current.format("YYYY-MM-DD"));
      current = current.add(1, "day");
    }
    return range;
  };

  const fetchLeaveTypes = async () => {
    try {
      const res = await api.post("/leave/type/list", {
        page: 1,
        limit: 10,
        is_active: true,
      });
      setLeaveTypes(res.data?.data?.types || []);
    } catch (err) {
      console.error("Error fetching leave types", err);
    }
  };

  const fetchLeaveList = async () => {
    try {
      setLoading(true);
      const res = await api.post("/leave/list", { page: 1, limit: 50 });
      console.log("====================================");
      console.log(res);
      console.log("====================================");
      setLeaveList(res.data?.data?.leave_applications || []);
    } catch (err) {
      console.error("Error fetching leave list", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.start_date || !formData.end_date) {
      alert("Please select start and end dates");
      return;
    }

    const dates = generateDateRange(formData.start_date, formData.end_date).map(
      (date) => ({ [date]: dateSelections[date] || "full" }),
    );

    try {
      await api.post("/leave/apply", {
        leave_type_id: formData.leave_type_id,
        dates,
        reason: formData.reason,
      });
      setShowForm(false);
      resetForm();
      fetchLeaveList();
    } catch (err) {
      console.error("Error applying leave", err);
    }
  };

  const resetForm = () => {
    setFormData({
      leave_type_id: "",
      start_date: "",
      end_date: "",
      reason: "",
    });
    setDateSelections({});
  };

  const handleCloseModal = () => {
    resetForm();
    setShowForm(false);
  };

  useEffect(() => {
    fetchLeaveTypes();
    fetchLeaveList();
  }, []);

  useEffect(() => {
    if (formData.start_date && formData.end_date) {
      const range = generateDateRange(formData.start_date, formData.end_date);
      const newSelections: { [key: string]: string } = {};
      range.forEach((d) => {
        newSelections[d] = dateSelections[d] || "full";
      });
      setDateSelections(newSelections);
    }
  }, [formData.start_date, formData.end_date]);

  const groupLeaves = (leaves: LeaveRequest[]) => {
    return leaves.map((leave) => ({
      application_id: leave.application_id,
      leave_type: leave.leave_type,
      applicant_first_name: leave.applicant_first_name,
      applicant_last_name: leave.applicant_last_name,
      reason: leave.reason,
      status: leave.status,
      review_comment: leave.review_comment,
      reviewer_first_name: leave.reviewer_first_name,
      reviewer_last_name: leave.reviewer_last_name,
      dates: leave?.dates.map((d: any) => ({
        date: d.date,
        half: d.half,
      })),
    }));
  };

  // ✅ Correct usage
  console.log("group leaves", groupLeaves(leaveList));

  const toggleRow = (key: string) => {
    setExpandedRows((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="leave-container1">
      <div className="leave-header">
        <button className="leave-toggle-btn" onClick={() => setShowForm(true)}>
          + New Leave Request
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : leaveList.length === 0 ? (
        <p>No leave requests found.</p>
      ) : (
        <table className="leave-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Dates</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Reviewer Comment</th>
            </tr>
          </thead>
          <tbody>
            {groupLeaves(leaveList).map((leave: any, idx: number) => {
              const rowKey = `${leave.reason}_${leave.leave_type}_${leave.applicant_first_name}`;
              const showDropdown = leave.dates.length > 2;
              const isExpanded = expandedRows[rowKey];

              const firstComment =
                leave.dates.find((d: any) => d.review_comment)
                  ?.review_comment || "-";
              const firstReviewer = leave.dates.find(
                (d: any) => d.review_comment,
              )
                ? `${
                    leave.dates.find((d: any) => d.review_comment)
                      ?.reviewer_first_name
                  } ${
                    leave.dates.find((d: any) => d.review_comment)
                      ?.reviewer_last_name
                  }`
                : "";

              return (
                <tr key={idx}>
                  <td>{leave.leave_type}</td>
                  <td>
                    {showDropdown ? (
                      <div>
                        <button
                          onClick={() => toggleRow(rowKey)}
                          style={{
                            cursor: "pointer",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            border: "1px solid #ccc",
                            background: "#2196f3",
                          }}
                        >
                          {isExpanded
                            ? "Hide Dates"
                            : `Show ${leave.dates.length} Dates`}
                        </button>
                        {isExpanded && (
                          <ul style={{ marginTop: "5px", paddingLeft: "20px" }}>
                            {leave.dates.map((d: any, i: number) => (
                              <li key={i}>
                                {moment(d.date).format("MMM D, YYYY")} (
                                {d.half === "full"
                                  ? "Full Day"
                                  : d.half === "first"
                                    ? "First Half"
                                    : "Second Half"}
                                )
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ) : (
                      leave.dates.map((d: any, i: number) => (
                        <div key={i}>
                          {moment(d.date).format("MMM D, YYYY")} (
                          {d.half === "full"
                            ? "Full Day"
                            : d.half === "first"
                              ? "First Half"
                              : "Second Half"}
                          )
                        </div>
                      ))
                    )}
                  </td>
                  <td>{leave.reason}</td>
                  <td>
                    <span className={`status ${leave.status}`}>
                      {leave.status.toUpperCase()}
                    </span>
                  </td>
                  <td>{firstComment !== "-" ? `${firstComment} ` : "-"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* Modal code remains unchanged */}
      {showForm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={handleCloseModal}
        >
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "8px",
              width: "400px",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>New Leave Request</h3>
            <form onSubmit={handleSubmit}>
              {/* Leave Type */}
              <div style={{ marginBottom: "10px", marginTop: "10px" }}>
                <label>Leave Type:</label>
                <select
                  value={formData.leave_type_id}
                  onChange={(e) =>
                    setFormData({ ...formData, leave_type_id: e.target.value })
                  }
                  required
                >
                  <option value="">Select Leave Type</option>
                  {leaveTypes.map((lt) => (
                    <option key={lt.leave_type_id} value={lt.leave_type_id}>
                      {lt.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Start Date */}
              <div style={{ marginBottom: "10px" }}>
                <label>Start Date:</label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) =>
                    setFormData({ ...formData, start_date: e.target.value })
                  }
                  required
                />
              </div>

              {/* End Date */}
              <div style={{ marginBottom: "10px" }}>
                <label>End Date:</label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) =>
                    setFormData({ ...formData, end_date: e.target.value })
                  }
                  required
                />
              </div>

              {/* Date-wise half/full selection (if range selected) */}
              {Object.keys(dateSelections).length > 0 && (
                <div style={{ marginBottom: "10px" }}>
                  <h4>Date Selection</h4>
                  {Object.entries(dateSelections).map(([date, value]) => (
                    <div
                      key={date}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "6px",
                      }}
                    >
                      <span style={{ marginRight: "8px", minWidth: "110px" }}>
                        {moment(date).format("MMM D, YYYY")}
                      </span>
                      <select
                        value={value}
                        onChange={(e) =>
                          setDateSelections((prev) => ({
                            ...prev,
                            [date]: e.target.value,
                          }))
                        }
                      >
                        <option value="full">Full Day</option>
                        <option value="first">First Half</option>
                        <option value="second">Second Half</option>
                      </select>
                    </div>
                  ))}
                </div>
              )}

              {/* Reason */}
              <div style={{ marginBottom: "10px" }}>
                <label>Reason:</label>
                <textarea
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                  required
                  rows={3}
                  style={{ width: "100%" }}
                />
              </div>

              {/* Buttons */}
              <div
                style={{
                  marginTop: "15px",
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                }}
              >
                <button
                  type="button"
                  onClick={handleCloseModal}
                  style={{
                    padding: "6px 12px",
                    background: "gray",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "6px 12px",
                    background: "#2196f3",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leave;
