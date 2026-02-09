// import React, { useEffect, useState } from "react";
// import "./Leave.css";
// import moment from "moment";
// import api from "./../../../axiosConfig";
// import { FaTrash } from "react-icons/fa";

// interface LeaveType {
//   leave_type_id: string;
//   name: string;
//   description: string;
//   is_active: boolean;
// }

// interface LeaveApplication {
//   application_id: string;
//   applicant_first_name: string;
//   applicant_last_name: string;
//   reason: string;
//   leave_type: string;
//   date: string;
//   half: string;
//   status: "pending" | "approved" | "rejected";
//   review_comment: string | null;
//   reviewer_first_name: string | null;
//   reviewer_last_name: string | null;
// }

// interface LeaveGroup {
//   groupKey: string;
//   applicant_first_name: string;
//   applicant_last_name: string;
//   reason: string;
//   leave_type: string;
//   dates: {
//     application_id: string;
//     date: string;
//     half: string;
//     status: string;
//   }[];
// }

// const LeaveAdmin: React.FC = () => {
//   const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
//   const [applications, setApplications] = useState<LeaveApplication[]>([]);
//   const [filterStatus, setFilterStatus] = useState<
//     "" | "pending" | "approved" | "rejected"
//   >("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
//   const [totalPages, setTotalPages] = useState(1);

//   const [showModal, setShowModal] = useState(false);
//   const [newType, setNewType] = useState({ leave_type: "", description: "" });

//   const ITEMS_PER_PAGE = 10;

//   // ---------------- API Calls ----------------
//   const fetchLeaveTypes = async () => {
//     try {
//       const res = await api.post("/leave/type/list", { page: 1, limit: 99 });
//       setLeaveTypes(res.data.data.types || []);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const fetchApplications = async (page = 1) => {
//     try {
//       const res = await api.post("/leave/app/list", {
//         page,
//         limit: 10, // API pagination
//       });
//       setApplications(res.data.data.leave_applications || []);
//       setCurrentPage(res.data.data.meta.current_page || 1);
//       setTotalPages(res.data.data.meta.total_pages || 1);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchLeaveTypes();
//     fetchApplications();
//   }, []);

//   const handleTypeStatus = async (
//     leave_type_id: string,
//     is_active: boolean
//   ) => {
//     try {
//       await api.put("/leave/type/update-status", { leave_type_id, is_active });
//       fetchLeaveTypes();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleTypeDelete = async (leave_type_id: string) => {
//     try {
//       await api.delete("/leave/type/delete", { data: { leave_type_id } });
//       fetchLeaveTypes();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleReviewGroup = async (
//     group: LeaveGroup,
//     status: "approved" | "rejected"
//   ) => {
//     try {
//       await Promise.all(
//         group.dates.map((d) =>
//           api.put("/leave/review", {
//             application_id: d.application_id,
//             status,
//             review_comment: status === "approved" ? "Approved" : "Rejected",
//           })
//         )
//       );
//       fetchApplications();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleAddType = async () => {
//     if (!newType.leave_type) return alert("Leave type name is required");
//     try {
//       await api.post("/leave/type/add", newType);
//       setShowModal(false);
//       setNewType({ leave_type: "", description: "" });
//       fetchLeaveTypes();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // ---------------- Group Applications ----------------
//   const groupApplications = (): LeaveGroup[] => {
//     const grouped: Record<string, LeaveGroup> = {};
//     applications.forEach((app) => {
//       const key = `${app.reason}_${app.leave_type}_${app.applicant_first_name}_${app.applicant_last_name}`;
//       if (!grouped[key]) {
//         grouped[key] = {
//           groupKey: key,
//           applicant_first_name: app.applicant_first_name,
//           applicant_last_name: app.applicant_last_name,
//           reason: app.reason,
//           leave_type: app.leave_type,
//           dates: [],
//         };
//       }
//       grouped[key].dates.push({
//         application_id: app.application_id,
//         date: app.date,
//         half: app.half,
//         status: app.status,
//       });
//     });
//     return Object.values(grouped);
//   };

//   // const filteredGroups = groupApplications().filter(
//   //   (group) =>
//   //     filterStatus === "" || group.dates.some((d) => d.status === filterStatus)
//   // );

//   // const totalGroupPages = Math.ceil(filteredGroups.length / ITEMS_PER_PAGE);
//   // const displayedGroups = filteredGroups.slice(
//   //   (currentPage - 1) * ITEMS_PER_PAGE,
//   //   currentPage * ITEMS_PER_PAGE
//   // );

//   // ---------------- Group Applications ----------------
//   const groupedApplications = groupApplications().filter(
//     (group) =>
//       filterStatus === "" || group.dates.some((d) => d.status === filterStatus)
//   );

//   const totalGroupPages = Math.ceil(
//     groupedApplications.length / ITEMS_PER_PAGE
//   );
//   const displayedGroups = groupedApplications.slice(
//     (currentPage - 1) * ITEMS_PER_PAGE,
//     currentPage * ITEMS_PER_PAGE
//   );

//   const toggleGroup = (groupKey: string) => {
//     setExpandedGroups((prev) =>
//       prev.includes(groupKey)
//         ? prev.filter((k) => k !== groupKey)
//         : [...prev, groupKey]
//     );
//   };

//   return (
//     <div className="leave-fullscreen-container">
//       {/* Leave Types */}
//       <h2>Leave Types</h2>
//       <button className="add-btn" onClick={() => setShowModal(true)}>
//         + Add Leave Type
//       </button>
//       <table className="leave-table" style={{ width: 600 }}>
//         <thead>
//           <tr>
//             <th>Name</th>
//             <th>Description</th>
//             <th>Status</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {leaveTypes.map((type) => (
//             <tr key={type.leave_type_id}>
//               <td>{type.name}</td>
//               <td>{type.description}</td>
//               <td>
//                 <label className="switch">
//                   <input
//                     type="checkbox"
//                     checked={type.is_active}
//                     onChange={() =>
//                       handleTypeStatus(type.leave_type_id, !type.is_active)
//                     }
//                   />
//                   <span className="slider round"></span>
//                 </label>
//               </td>
//               <td>
//                 <button onClick={() => handleTypeDelete(type.leave_type_id)}>
//                   <FaTrash />
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* Leave Applications */}
//       <h2 style={{ marginTop: "30px" }}>Leave Applications</h2>

//       {/* Filter Buttons */}
//       <div className="filter-buttons">
//         {["", "pending", "approved", "rejected"].map((status) => (
//           <button
//             key={status}
//             className={`filter-btn ${filterStatus === status ? "active" : ""}`}
//             onClick={() => {
//               setCurrentPage(1);
//               setFilterStatus(status as any);
//             }}
//           >
//             {status === ""
//               ? "All"
//               : status.charAt(0).toUpperCase() + status.slice(1)}
//           </button>
//         ))}
//       </div>

//       <table className="leave-table">
//         <thead>
//           <tr>
//             <th>Name</th>
//             <th>Dates</th>
//             <th>Type</th>
//             <th>Reason</th>
//             <th>Status</th>
//             <th>Review</th>
//           </tr>
//         </thead>
//         <tbody>
//           {displayedGroups.map((group) => {
//             const allApproved = group.dates.every(
//               (d) => d.status === "approved"
//             );
//             const allRejected = group.dates.every(
//               (d) => d.status === "rejected"
//             );
//             const isPending = group.dates.some((d) => d.status === "pending");
//             const expanded = expandedGroups.includes(group.groupKey);
//             const showDropdown = group.dates.length > 1;

//             return (
//               <React.Fragment key={group.groupKey}>
//                 <tr>
//                   <td>
//                     {group.applicant_first_name} {group.applicant_last_name}
//                   </td>
//                   <td>
//                     {showDropdown ? (
//                       <button
//                         className="dropdown-btn"
//                         onClick={() => toggleGroup(group.groupKey)}
//                       >
//                         {expanded ? "Hide Dates" : "Show Dates"}
//                       </button>
//                     ) : (
//                       moment(group.dates[0].date).format("MMM D, YYYY") +
//                       ` (${group.dates[0].half})`
//                     )}
//                   </td>
//                   <td>{group.leave_type}</td>
//                   <td>{group.reason}</td>
//                   <td>
//                     {allApproved
//                       ? "APPROVED"
//                       : allRejected
//                       ? "REJECTED"
//                       : "PENDING"}
//                   </td>
//                   <td>
//                     {isPending ? (
//                       <>
//                         <button
//                           className="approve-btn"
//                           onClick={() => handleReviewGroup(group, "approved")}
//                         >
//                           Approve
//                         </button>
//                         <button
//                           className="reject-btn"
//                           style={{ marginLeft: 5 }}
//                           onClick={() => handleReviewGroup(group, "rejected")}
//                         >
//                           Reject
//                         </button>
//                       </>
//                     ) : (
//                       "-"
//                     )}
//                   </td>
//                 </tr>
//                 {showDropdown && expanded && (
//                   <tr>
//                     <td colSpan={6}>
//                       <ul>
//                         {group.dates.map((d) => (
//                           <li key={d.application_id}>
//                             {moment(d.date).format("MMM D, YYYY")} ({d.half})
//                           </li>
//                         ))}
//                       </ul>
//                     </td>
//                   </tr>
//                 )}
//               </React.Fragment>
//             );
//           })}
//         </tbody>
//       </table>

//       {/* Pagination */}
//       <div className="pagination">
//         <button
//           disabled={currentPage === 1}
//           onClick={() => setCurrentPage((prev) => prev - 1)}
//         >
//           Prev
//         </button>
//         <span className="current-page">{currentPage}</span>
//         <button
//           disabled={currentPage === totalGroupPages}
//           onClick={() => setCurrentPage((prev) => prev + 1)}
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default LeaveAdmin;

import React, { useEffect, useState } from "react";
import "./Leave.css";
import moment from "moment";
import api from "./../../../axiosConfig";
import { FaTrash } from "react-icons/fa";

interface LeaveType {
  leave_type_id: string;
  name: string;
  description: string;
  is_active: boolean;
}

interface LeaveApplication {
  application_id: string;
  applicant_first_name: string;
  applicant_last_name: string;
  reason: string;
  leave_type: string;
  date: string;
  half: string;
  status: "pending" | "approved" | "rejected";
  review_comment: string | null;
  reviewer_first_name: string | null;
  reviewer_last_name: string | null;
}

interface LeaveGroup {
  groupKey: string;
  applicant_first_name: string;
  applicant_last_name: string;
  reason: string;
  leave_type: string;
  dates: {
    application_id: string;
    date: string;
    half: string;
    status: string;
    review_comment?: string | null;
  }[];
}

const ITEMS_PER_PAGE = 10;

const LeaveAdmin: React.FC = () => {
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [applications, setApplications] = useState<LeaveApplication[]>([]);
  const [filterStatus, setFilterStatus] = useState<
    "" | "pending" | "approved" | "rejected"
  >("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [newType, setNewType] = useState({ leave_type: "", description: "" });
  const [groupComments, setGroupComments] = useState<Record<string, string>>(
    {}
  );
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  // ---------------- API Calls ----------------
  const fetchLeaveTypes = async () => {
    try {
      const res = await api.post("/leave/type/list", { page: 1, limit: 99 });
      setLeaveTypes(res.data.data.types || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAllApplications = async () => {
    try {
      let allApps: LeaveApplication[] = [];
      let page = 1;
      let totalPages = 1;

      do {
        const res = await api.post("/leave/app/list", { page, limit: 100 });
        console.log(res);

        const data = res.data.data.leave_applications || [];
        allApps = [...allApps, ...data];
        totalPages = res.data.data.meta.total_pages || 1;
        page++;
      } while (page <= totalPages);

      setApplications(allApps);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLeaveTypes();
    fetchAllApplications();
  }, []);

  const handleTypeStatus = async (
    leave_type_id: string,
    is_active: boolean
  ) => {
    try {
      await api.put("/leave/type/update-status", { leave_type_id, is_active });
      fetchLeaveTypes();
    } catch (err) {
      console.error(err);
    }
  };

  const handleTypeDelete = async (leave_type_id: string) => {
    try {
      await api.delete("/leave/type/delete", { data: { leave_type_id } });
      fetchLeaveTypes();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddType = async () => {
    if (!newType.leave_type) return alert("Leave type name is required");
    try {
      await api.post("/leave/type/add", newType);
      setShowModal(false);
      setNewType({ leave_type: "", description: "" });
      fetchLeaveTypes();
    } catch (err) {
      console.error(err);
    }
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };

 

  const groupApplications = (): LeaveGroup[] => {
    const groups: LeaveGroup[] = applications.map((app) => {
      // Sort the app.dates for display
      const sortedDates = (app as any).dates
        ? [...(app as any).dates].sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          )
        : [];

      return {
        groupKey: app.application_id,
        applicant_first_name: app.applicant_first_name,
        applicant_last_name: app.applicant_last_name,
        reason: app.reason,
        leave_type: app.leave_type,
        dates: sortedDates.map((d: any) => ({
          application_id: app.application_id,
          date: d.date,
          half: d.half,
          status: app.status,
          review_comment: app.review_comment,
        })),
      };
    });

    return groups;
  };

  const toggleRow = (key: string) => {
    setExpandedRows((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  const filteredGroups = groupApplications().filter(
    (group) =>
      filterStatus === "" || group.dates.some((d) => d.status === filterStatus)
  );

  // Update total pages whenever filter changes
  React.useEffect(() => {
    const pages = Math.ceil(filteredGroups.length / ITEMS_PER_PAGE) || 1;
    setTotalPages(pages);
    if (currentPage > pages) setCurrentPage(1);
  }, [applications, filterStatus]);

  const displayedGroups = filteredGroups.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // ---------------- Review Handlers ----------------
  const handleReviewGroupWithComment = async (
    group: LeaveGroup,
    status: "approved" | "rejected"
  ) => {
    try {
      const comment =
        groupComments[group.groupKey] ||
        (status === "approved" ? "Approved" : "Rejected");
      await Promise.all(
        group.dates.map((d) =>
          api.put("/leave/review", {
            application_id: d.application_id,
            status,
            review_comment: comment,
          })
        )
      );
      setGroupComments({ ...groupComments, [group.groupKey]: "" });
      fetchAllApplications();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleGroup = (groupKey: string) => {
    if (expandedGroups.includes(groupKey)) {
      setExpandedGroups(expandedGroups.filter((k) => k !== groupKey));
    } else {
      setExpandedGroups([...expandedGroups, groupKey]);
    }
  };

  return (
    <div className="leave-fullscreen-container">
      <h2>Leave Types</h2>
      <button className="add-btn" onClick={() => setShowModal(true)}>
        + Add Leave Type
      </button>
      <table className="leave-table" style={{ width: 600 }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leaveTypes.map((type) => (
            <tr key={type.leave_type_id}>
              <td>{type.name}</td>
              <td>{type.description}</td>
              <td>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={type.is_active}
                    onChange={() =>
                      handleTypeStatus(type.leave_type_id, !type.is_active)
                    }
                  />
                  <span className="slider round"></span>
                </label>
              </td>
              <td>
                <button onClick={() => handleTypeDelete(type.leave_type_id)}>
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add Leave Type</h3>
            <input
              type="text"
              placeholder="Leave Type"
              value={newType.leave_type}
              onChange={(e) =>
                setNewType({ ...newType, leave_type: e.target.value })
              }
            />
            <textarea
              placeholder="Description"
              value={newType.description}
              onChange={(e) =>
                setNewType({ ...newType, description: e.target.value })
              }
            />
            <div style={{ width: 355, height: 40, display: "flex", gap: 20 }}>
              <button onClick={handleAddType}>Add</button>
              <button
                style={{ background: "gray" }}
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <h2 style={{ marginTop: "30px" }}>Leave Applications</h2>
      <div className="filter-buttons">
        {["", "pending", "approved", "rejected"].map((status) => (
          <button
            key={status}
            className={`filter-btn ${filterStatus === status ? "active" : ""}`}
            onClick={() => {
              setFilterStatus(status as any);
              setCurrentPage(1);
            }}
          >
            {status === ""
              ? "All"
              : status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      <table className="leave-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Dates</th>
            <th>Type</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Review Comment</th>
          </tr>
        </thead>
        <tbody>
          {displayedGroups.map((group) => {
            const rowKey = `${group.reason}_${group.leave_type}_${group.applicant_first_name}`;
            const showDropdown = group.dates.length > 2;
            const isExpanded = expandedRows[rowKey];
            const allApproved = group.dates.every(
              (d) => d.status === "approved"
            );
            const allRejected = group.dates.every(
              (d) => d.status === "rejected"
            );
            const isPending = group.dates.some((d) => d.status === "pending");
            const expanded = expandedGroups.includes(group.groupKey);

            return (
              <React.Fragment key={group.groupKey}>
                <tr>
                  <td>
                    {group.applicant_first_name} {group.applicant_last_name}
                  </td>
                  {/* <td>
                    {group.dates.length > 1 ? (
                      <button
                        className="dropdown-btn"
                        onClick={() => toggleGroup(group.groupKey)}
                      >
                        {expanded ? "Hide Dates" : "Show Dates"}
                      </button>
                    ) : (
                      moment(group.dates[0].date).format("MMM D, YYYY") +
                      ` (${group.dates[0].half})`
                    )}
                  </td> */}
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
                            : `Show ${group.dates.length} Dates`}
                        </button>
                        {isExpanded && (
                          <ul style={{ marginTop: "5px", paddingLeft: "20px" }}>
                            {group.dates.map((d: any, i: number) => (
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
                      group.dates.map((d: any, i: number) => (
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
                  <td>{group.leave_type}</td>
                  <td>{group.reason}</td>
                  <td>
                    <span
                      className={`status ${
                        allApproved
                          ? "approved"
                          : allRejected
                          ? "rejected"
                          : "pending"
                      }`}
                    >
                      {allApproved
                        ? "APPROVED"
                        : allRejected
                        ? "REJECTED"
                        : "PENDING"}
                    </span>
                  </td>

                  <td>
                    {isPending ? (
                      <>
                        <textarea
                          placeholder="Add comment..."
                          value={groupComments[group.groupKey] || ""}
                          onChange={(e) =>
                            setGroupComments({
                              ...groupComments,
                              [group.groupKey]: e.target.value,
                            })
                          }
                          style={{ width: "100%", marginBottom: 5 }}
                        />
                        <div className="review-buttons">
                          <button
                            className="approve-btn"
                            onClick={() =>
                              handleReviewGroupWithComment(group, "approved")
                            }
                          >
                            Approve
                          </button>
                          <button
                            className="reject-btn"
                            onClick={() =>
                              handleReviewGroupWithComment(group, "rejected")
                            }
                          >
                            Reject
                          </button>
                        </div>
                      </>
                    ) : (
                      // ✅ Show only the first non-empty review comment for the group
                      (() => {
                        const firstComment =
                          group.dates.find((d) => d.review_comment)
                            ?.review_comment || "-";
                        return firstComment;
                      })()
                    )}
                  </td>
                </tr>
                {group.dates.length > 1 && expanded && (
                  <tr>
                    <td colSpan={6}>
                      <ul>
                        {group.dates
                          .sort(
                            (a, b) =>
                              new Date(a.date).getTime() -
                              new Date(b.date).getTime()
                          )
                          .map((d) => (
                            <li key={d.application_id}>
                              {moment(d.date).format("MMM D, YYYY")} ({d.half})
                            </li>
                          ))}
                      </ul>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>

      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          Prev
        </button>
        <span className="current-page">
          {currentPage} / {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default LeaveAdmin;
