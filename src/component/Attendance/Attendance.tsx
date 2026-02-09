import React, { useEffect, useState } from "react";
import moment from "moment-timezone";
import { FaEdit } from "react-icons/fa";
import api from "./../../../axiosConfig";
import "./Attendance.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface AttendanceEntry {
  id: string;
  date: string;
  check_in: string;
  lunch_start: string;
  lunch_end: string;
  check_out: string;
  hours_worked: string;
  status: string;
}

interface AttendanceData {
  attendance: AttendanceEntry[];
  total_hours_worked: string;
}

interface Props {
  userId: string;
  userName: string;
  onClose: () => void;
}

const formatDuration = (seconds: number) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs}h ${mins}m ${secs}s`;
};

const Attendance: React.FC<Props> = ({ userId, userName, onClose }) => {
  const [attendanceData, setAttendanceData] = useState<any | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [startDate, setStartDate] = useState(
    moment().startOf("month").format("YYYY-MM-DD"),
  );
  const [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));
  const [currentPage, setCurrentPage] = useState(1);
  console.log(currentPage);

  const itemsPerPage = 10;
  const [editingEntry, setEditingEntry] = useState<AttendanceEntry | null>(
    null,
  );

  const handleEdit = (entry: AttendanceEntry) => {
    setEditingEntry(entry);
  };
  const closeEditModal = () => setEditingEntry(null);

  const fetchAttendance = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post(
        `/attendance/list/${userId}?page=${currentPage}&limit=10`,
        {
          start_date: startDate,
          end_date: endDate,
        },
      );

      if (response.data.success && response.data.data) {
        setAttendanceData(response.data.data);
        // setCurrentPage(1);
      } else {
        setAttendanceData(null);
        setError("No attendance data available between selected dates.");
      }
    } catch (err: any) {
      console.error(
        "Attendance fetch error:",
        err.response?.data || err.message,
      );
      setAttendanceData(null);
      setError("No attendance data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchAttendance();
    }
  }, [userId, currentPage]);

  const totalPages = attendanceData?.pagination?.total_pages;
  console.log(attendanceData);

  const paginatedData = attendanceData
    ? attendanceData.attendance.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
      )
    : [];
  console.log("====================================");
  console.log("paginatedData>>>>>>>>>", paginatedData);
  console.log("====================================");

  const tableData = attendanceData?.attendance || [];

  const graphData = tableData.map((entry) => {
    const formattedDate = entry.date
      ? moment(entry.date).format("DD MMM")
      : "N/A";

    if (entry.status === "absent") {
      return {
        date: formattedDate,
        seconds: 0,
        label: "Absent",
        status: "absent",
      };
    }

    const checkIn = moment(entry.check_in);
    const checkOut = moment(entry.check_out);
    const lunchStart = moment(entry.lunch_start);
    const lunchEnd = moment(entry.lunch_end);

    let totalSeconds = 0;
    if (checkIn.isValid() && checkOut.isValid()) {
      totalSeconds = checkOut.diff(checkIn, "seconds");

      if (lunchStart.isValid() && lunchEnd.isValid()) {
        totalSeconds -= lunchEnd.diff(lunchStart, "seconds");
      }
    }

    return {
      date: formattedDate,
      seconds: totalSeconds,
      label: formatDuration(totalSeconds),
      status: "present",
    };
  });

  return (
    <div className="attendance-wrapper">
      <div className="attendance-header">
        <h2>Attendance for {userName}</h2>
        <button onClick={onClose} className="close-btn">
          ✕
        </button>
      </div>

      <div className="date-filter">
        <label>
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>

        <label>
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>

        <button onClick={fetchAttendance}>Filter</button>
      </div>

      {loading ? (
        <p>Loading attendance...</p>
      ) : error ? (
        <p className="no-data-message">{error}</p>
      ) : attendanceData ? (
        <>
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Check In</th>
                <th>Lunch Start</th>
                <th>Lunch End</th>
                <th>Check Out</th>
                <th>Hours Worked</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((entry, idx) => (
                <tr key={idx}>
                  <td>{moment(entry.date).format("DD MMM YYYY")}</td>
                  <td>
                    {entry.check_in && moment(entry.check_in).isValid()
                      ? moment(entry.check_in)
                          .tz("Asia/Kolkata")
                          .format("hh:mm:ss A")
                      : "-"}
                  </td>

                  <td>
                    {entry.lunch_start && moment(entry.lunch_start).isValid()
                      ? moment(entry.lunch_start)
                          .tz("Asia/Kolkata")
                          .format("hh:mm:ss A")
                      : "-"}
                  </td>

                  <td>
                    {entry.lunch_end && moment(entry.lunch_end).isValid()
                      ? moment(entry.lunch_end)
                          .tz("Asia/Kolkata")
                          .format("hh:mm:ss A")
                      : "-"}
                  </td>

                  <td>
                    {entry.check_out && moment(entry.check_out).isValid()
                      ? moment(entry.check_out)
                          .tz("Asia/Kolkata")
                          .format("hh:mm:ss A")
                      : "-"}
                  </td>

                  <td>
                    {(() => {
                      const checkIn = moment(entry.check_in);
                      const checkOut = moment(entry.check_out);
                      const lunchStart = moment(entry.lunch_start);
                      const lunchEnd = moment(entry.lunch_end);

                      if (checkIn.isValid() && checkOut.isValid()) {
                        let net = checkOut.diff(checkIn); // total duration by default

                        if (lunchStart.isValid() && lunchEnd.isValid()) {
                          const lunch = lunchEnd.diff(lunchStart);
                          net -= lunch; // subtract lunch only if both are valid
                        }

                        const duration = moment.duration(net);
                        const hours = Math.floor(duration.asHours());
                        const minutes = duration.minutes();
                        const seconds = duration.seconds();

                        return `${hours}h ${minutes}m ${seconds}s`;
                      }

                      return "-";
                    })()}
                  </td>

                  <td>{entry.status}</td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(entry)}
                      style={{ width: 60 }}
                    >
                      <FaEdit
                        style={{ paddingLeft: 2, height: 20, width: 20 }}
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {editingEntry && (
            <div className="edit-modal">
              <div className="edit-modal-content">
                <h3>
                  Edit Attendance -{" "}
                  {moment(editingEntry.date).format("DD MMM YYYY")}
                </h3>

                <label>
                  Check In:
                  <input
                    type="time"
                    value={moment(editingEntry.check_in).format("HH:mm")}
                    onChange={(e) => {
                      const time = e.target.value;
                      const combined = moment(
                        `${editingEntry.date.substring(0, 10)}T${time}:00+05:30`,
                      ).format();
                      setEditingEntry({ ...editingEntry, check_in: combined });
                    }}
                  />
                </label>

                <label>
                  Lunch Start:
                  <input
                    type="time"
                    value={moment(editingEntry.lunch_start).format("HH:mm")}
                    onChange={(e) => {
                      const time = e.target.value;
                      const combined = moment(
                        `${editingEntry.date.substring(0, 10)}T${time}:00+05:30`,
                      ).format();
                      setEditingEntry({
                        ...editingEntry,
                        lunch_start: combined,
                      });
                    }}
                  />
                </label>

                <label>
                  Lunch End:
                  <input
                    type="time"
                    value={moment(editingEntry.lunch_end).format("HH:mm")}
                    onChange={(e) => {
                      const time = e.target.value;
                      const combined = moment(
                        `${editingEntry.date.substring(0, 10)}T${time}:00+05:30`,
                      ).format();
                      setEditingEntry({ ...editingEntry, lunch_end: combined });
                    }}
                  />
                </label>

                <label>
                  Check Out:
                  <input
                    type="time"
                    value={moment(editingEntry.check_out).format("HH:mm")}
                    onChange={(e) => {
                      const time = e.target.value;
                      const combined = moment(
                        `${editingEntry.date.substring(0, 10)}T${time}:00+05:30`,
                      ).format();
                      setEditingEntry({ ...editingEntry, check_out: combined });
                    }}
                  />
                </label>

                <label>
                  Status:
                  <select
                    value={editingEntry.status}
                    onChange={(e) =>
                      setEditingEntry({
                        ...editingEntry,
                        status: e.target.value,
                      })
                    }
                  >
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                  </select>
                </label>

                <div className="edit-modal-buttons">
                  <button
                    onClick={async () => {
                      try {
                        await api.put("/attendance/update", {
                          user_id: userId,
                          date: moment(editingEntry.date).format("YYYY-MM-DD"),
                          check_in: editingEntry.check_in,
                          lunch_start: editingEntry.lunch_start,
                          lunch_end: editingEntry.lunch_end,
                          check_out: editingEntry.check_out,
                          status: editingEntry.status,
                        });
                        closeEditModal();
                        fetchAttendance();
                      } catch (err) {
                        alert("Failed to update.");
                        console.error(err);
                      }
                    }}
                  >
                    Save
                  </button>
                  <button className="cancel-btn" onClick={closeEditModal}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="pagination-controls">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              ◀ Prev
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next ▶
            </button>
          </div>

          <h3 style={{ marginTop: "2rem" }}>Working Hours:</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={graphData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis
                tickFormatter={(value: number) =>
                  `${Math.floor(value / 3600)}h`
                }
                label={{ value: "Hours", angle: -90, position: "insideLeft" }}
              />
              <Tooltip
                formatter={(value: number, name: string, props: any) => {
                  const { payload } = props;
                  return payload?.status === "absent"
                    ? "Absent"
                    : formatDuration(value);
                }}
                labelFormatter={(label) => `Date: ${label}`}
              />

              <Bar dataKey="seconds" name="Worked Time" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </>
      ) : null}
    </div>
  );
};

export default Attendance;
