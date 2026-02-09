import React, { useState, useEffect, useRef } from "react";
import Lottie from "lottie-react";
import "./StaffAttendance.css";
import api from "./../../../axiosConfig";
import done from "./../../assets/Done1.json";

const StaffAttendance: React.FC = () => {
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkedOut, setCheckedOut] = useState(false);
  const [onLunchBreak, setOnLunchBreak] = useState(false);
  const [lunchEnded, setLunchEnded] = useState(false);
  const [loading, setLoading] = useState(false);

  const [checkInTime, setCheckInTime] = useState<Date | null>(null);
  const [checkOutTime, setCheckOutTime] = useState<Date | null>(null);
  const [lunchStartTime, setLunchStartTime] = useState<Date | null>(null);
  const [lunchEndTime, setLunchEndTime] = useState<Date | null>(null);
  const [lunchDuration, setLunchDuration] = useState(0);
  const [totalWorkedTime, setTotalWorkedTime] = useState<number | null>(null);
  const [liveWorkedTime, setLiveWorkedTime] = useState<number | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<
    "lunch" | "back" | "checkout" | null
  >(null);

  const hasFetchedRef = useRef(false);

  useEffect(() => {
    let called = false;
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    const fetchStatus = async () => {
      if (called) return;
      called = true;

      try {
        const res = await api.get(`/attendance/status`);

        const data = res.data.data;

        if (!data.check_in) {
          console.log("Not checked in yet");
          return;
        }

        const checkIn = new Date(data.check_in);
        setCheckedIn(true);
        setCheckInTime(checkIn);

        if (data.lunch_start) {
          const lunchStart = new Date(data.lunch_start);
          setOnLunchBreak(true);
          setLunchStartTime(lunchStart);
        }

        if (data.lunch_end) {
          const lunchEnd = new Date(data.lunch_end);
          setLunchEnded(true);
          setOnLunchBreak(false);
          setLunchEndTime(lunchEnd);

          const duration = Math.floor(
            (lunchEnd.getTime() - new Date(data.lunch_start).getTime()) / 1000,
          );
          setLunchDuration(duration);
        }

        if (data.check_out) {
          const checkOut = new Date(data.check_out);
          setCheckedOut(true);
          setCheckOutTime(checkOut);

          const workedSeconds =
            (checkOut.getTime() - checkIn.getTime()) / 1000 - lunchDuration;

          setTotalWorkedTime(Math.max(0, Math.floor(workedSeconds)));
        }
      } catch (err) {
        console.warn("Error fetching attendance status", err);
      }
    };

    fetchStatus();
  }, []);

  useEffect(() => {
    if (checkedOut && liveWorkedTime !== null) {
      setTotalWorkedTime(liveWorkedTime);
    }
  }, [checkedOut, liveWorkedTime]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (checkedIn && !checkedOut && checkInTime) {
      interval = setInterval(() => {
        const now = new Date();
        let secondsWorked = Math.floor(
          (now.getTime() - checkInTime.getTime()) / 1000,
        );

        if (onLunchBreak && lunchStartTime) {
          secondsWorked -= Math.floor(
            (now.getTime() - lunchStartTime.getTime()) / 1000,
          );
        } else {
          secondsWorked -= lunchDuration;
        }

        setLiveWorkedTime(Math.max(0, secondsWorked));
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [
    checkedIn,
    checkedOut,
    checkInTime,
    onLunchBreak,
    lunchStartTime,
    lunchDuration,
  ]);

  const handleCheckIn = async () => {
    try {
      const res = await api.post(`/attendance/check_in`, {
        status: "present",
      });
      if (res.data.success) {
        const now = new Date();
        setCheckedIn(true);
        setCheckInTime(now);
      }
    } catch (err: any) {
      if (err.response?.status === 403) {
        alert("⚠️ Already checked in today.");
        setCheckedIn(true);
      } else {
        alert("❌ Error during check-in");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLunchBreak = async () => {
    setLoading(true);
    try {
      const res = await api.put(`/attendance/lunch`, {});
      if (res.data.success) {
        const now = new Date();
        setLunchStartTime(now);
        setOnLunchBreak(true);
      }
    } catch (err) {
      alert("❌ Error during lunch");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToWork = async () => {
    setLoading(true);
    try {
      const res = await api.put(`/attendance/back`, {});
      if (res.data.success) {
        const now = new Date();
        setOnLunchBreak(false);
        setLunchEnded(true);
        setLunchEndTime(now);
        if (lunchStartTime) {
          const duration = Math.floor(
            (now.getTime() - lunchStartTime.getTime()) / 1000,
          );
          setLunchDuration((prev) => prev + duration);
        }
      }
    } catch (err) {
      alert("❌ Error during back to work");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setLoading(true);
    try {
      const res = await api.put(`/attendance/check_out`, {});
      if (res.data.success) {
        const now = new Date();
        setCheckedOut(true);
        setCheckOutTime(now);

        if (checkInTime) {
          let workedSeconds = Math.floor(
            (now.getTime() - checkInTime.getTime()) / 1000,
          );

          if (lunchStartTime && lunchEndTime) {
            workedSeconds -= Math.floor(
              (lunchEndTime.getTime() - lunchStartTime.getTime()) / 1000,
            );
          } else if (lunchStartTime && !lunchEndTime) {
            workedSeconds -= Math.floor(
              (now.getTime() - lunchStartTime.getTime()) / 1000,
            );
          } else {
            workedSeconds -= lunchDuration;
          }

          const finalWorked = Math.max(0, workedSeconds);
          setTotalWorkedTime(finalWorked);
          setLiveWorkedTime(finalWorked);
        }
      }
    } catch (err) {
      alert("❌ Error during check-out");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  return (
    <div className="attendance-container">
      {showConfirmModal && confirmAction && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>
              Are you sure you want to{" "}
              {confirmAction === "lunch"
                ? "start lunch break"
                : confirmAction === "back"
                  ? "resume work"
                  : "check out"}
              ?
            </h3>
            <div className="modal-actions">
              <button
                className="confirm-btn"
                onClick={() => {
                  setShowConfirmModal(false);
                  if (confirmAction === "lunch") handleLunchBreak();
                  else if (confirmAction === "back") handleBackToWork();
                  else if (confirmAction === "checkout") handleCheckOut();
                }}
              >
                Yes
              </button>
              <button
                className="cancel-btn"
                onClick={() => setShowConfirmModal(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="live-timer">
        {liveWorkedTime !== null ? (
          <h3>
            {checkedIn && !checkedOut
              ? "Live Worked Time:"
              : "Total Worked Time:"}{" "}
            <span className="time">{formatTime(liveWorkedTime)}</span>
          </h3>
        ) : (
          <h3>{checkedOut ? "Day Ended Well" : "Live Worked Time:"} </h3>
        )}
      </div>

      {!checkedIn && (
        <button
          className="checkin-button"
          onClick={handleCheckIn}
          disabled={loading}
        >
          {loading ? "Checking In..." : "Check In"}
        </button>
      )}

      {checkedIn && !checkedOut && (
        <>
          {!onLunchBreak && !lunchEnded && (
            <button
              className="break-button"
              onClick={() => {
                setConfirmAction("lunch");
                setShowConfirmModal(true);
              }}
              disabled={loading}
            >
              {loading ? "Processing..." : "Lunch Break"}
            </button>
          )}

          {onLunchBreak && !lunchEnded && (
            <button
              className="back-button"
              onClick={() => {
                setConfirmAction("back");
                setShowConfirmModal(true);
              }}
              disabled={loading}
            >
              {loading ? "Processing..." : "Back to Work"}
            </button>
          )}

          <button
            className="checkout-button"
            onClick={() => {
              setConfirmAction("checkout");
              setShowConfirmModal(true);
            }}
            disabled={loading}
          >
            {loading ? "Checking Out..." : "Check Out"}
          </button>
        </>
      )}

      {checkedOut && (
        <>
          <Lottie
            animationData={done}
            loop={false}
            style={{ height: 100, marginTop: -10 }}
          />
          <p className="message" style={{ marginTop: 0 }}>
            You have checked out for the day.
          </p>
        </>
      )}
    </div>
  );
};

export default StaffAttendance;
