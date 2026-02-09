import React, { useEffect, useState } from "react";
import moment from "moment";
import api from "../../../axiosConfig";
import "./List.css";

interface AttendanceRecord {
  date: string;
  check_in: string | null;
  lunch_start: string | null;
  lunch_end: string | null;
  check_out: string | null;
  hours_worked: string | null;
  status: string;
}

const List: React.FC = () => {
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);

  const [startDate, setStartDate] = useState(
    moment().startOf("month").format("YYYY-MM-DD"),
  );
  const [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));

  // fetchAttendanceList should use currentPage directly
  const fetchAttendanceList = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Token not found. Please login again.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.post(
        `/attendance/list?page=${currentPage}&limit=${itemsPerPage}`,
        {
          start_date: startDate,
          end_date: endDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data.success) {
        setAttendanceData(response.data.data.attendance);

        // calculate total pages from backend
        const totalRecords = response.data.data.pagination.total_records;
        const perPage = response.data.data.pagination.per_page;
        setTotalPages(Math.ceil(totalRecords / perPage));
      } else {
        setAttendanceData([]);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong.");
      setAttendanceData([]);
    } finally {
      setLoading(false);
    }
  };

  // refetch whenever currentPage, startDate, or endDate changes
  useEffect(() => {
    fetchAttendanceList();
  }, [currentPage]);

  const formatDate = (iso: string | null) => {
    if (!iso) return "-";
    return moment(iso).format("ll");
  };

  const formatTime = (iso: string | null) => {
    if (!iso) return "-";
    return moment(iso).format("hh:mm:ss A");
  };

  // FRONTEND pagination using slice
  // const indexOfLastItem = currentPage * itemsPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentItems = attendanceData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="attendance-list-container">
      <div className="filter-section">
        <label>
          Start Date:{" "}
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label>
          End Date:{" "}
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
        <button onClick={fetchAttendanceList}>Filter</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : attendanceData.length === 0 ? (
        <p>No attendance records found.</p>
      ) : (
        <>
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Check In</th>
                <th>Lunch Start</th>
                <th>Lunch End</th>
                <th>Check Out</th>
                <th>Hours</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((entry, index) => (
                <tr key={index}>
                  <td>{formatDate(entry.date)}</td>
                  <td>{formatTime(entry.check_in)}</td>
                  <td>{formatTime(entry.lunch_start)}</td>
                  <td>{formatTime(entry.lunch_end)}</td>
                  <td>{formatTime(entry.check_out)}</td>
                  <td>
                    {(() => {
                      if (!entry.check_in || !entry.check_out) return "-";

                      const checkIn = moment(entry.check_in);
                      const checkOut = moment(entry.check_out);
                      const lunchStart = entry.lunch_start
                        ? moment(entry.lunch_start)
                        : null;
                      const lunchEnd = entry.lunch_end
                        ? moment(entry.lunch_end)
                        : null;

                      let totalDuration = moment.duration(
                        checkOut.diff(checkIn),
                      );

                      if (lunchStart && lunchEnd) {
                        const lunchDuration = moment.duration(
                          lunchEnd.diff(lunchStart),
                        );
                        totalDuration = moment.duration(
                          totalDuration.asMilliseconds() -
                            lunchDuration.asMilliseconds(),
                        );
                      }

                      const hours = Math.floor(totalDuration.asHours());
                      const minutes = totalDuration.minutes();
                      const seconds = totalDuration.seconds();

                      return `${hours}h ${minutes}m ${seconds}s`;
                    })()}
                  </td>
                  <td>{entry.status}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            {currentPage > 1 && (
              <button onClick={() => setCurrentPage((prev) => prev - 1)}>
                ◀ Previous
              </button>
            )}
            <span>
              Page {currentPage} of {totalPages}
            </span>
            {currentPage < totalPages && (
              <button onClick={() => setCurrentPage((prev) => prev + 1)}>
                Next ▶
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default List;
