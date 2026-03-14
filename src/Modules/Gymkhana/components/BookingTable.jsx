import { useEffect, useState } from "react";
import { extractErrorMessage, extractRows, getBookings } from "../api";

const BOOKINGS_CHANGED_EVENT = "gymkhana:bookings:changed";

export default function BookingTable() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function fetchBookings() {
      setLoading(true);
      setError("");
      try {
        const data = await getBookings();
        if (mounted) {
          setBookings(extractRows(data));
        }
      } catch (err) {
        if (mounted) {
          setError(extractErrorMessage(err, "Failed to load bookings."));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    function handleBookingsChanged() {
      fetchBookings();
    }

    fetchBookings();
    window.addEventListener(BOOKINGS_CHANGED_EVENT, handleBookingsChanged);

    return () => {
      mounted = false;
      window.removeEventListener(BOOKINGS_CHANGED_EVENT, handleBookingsChanged);
    };
  }, []);

  if (loading) {
    return <p>Loading bookings...</p>;
  }

  if (error) {
    return <p style={{ color: "#b00020" }}>{error}</p>;
  }

  return (
    <table border="1" cellPadding="8" cellSpacing="0" width="100%">
      <thead>
        <tr>
          <th>Facility</th>
          <th>User</th>
          <th>Booking Date</th>
          <th>Start</th>
          <th>End</th>
        </tr>
      </thead>
      <tbody>
        {bookings.length === 0 && (
          <tr>
            <td colSpan="5" align="center">
              No bookings found.
            </td>
          </tr>
        )}
        {bookings.map((booking) => (
          <tr
            key={booking.id || `${booking.facility_id}-${booking.booking_date}`}
          >
            <td>{booking.facility_name || booking.facility_id || "-"}</td>
            <td>{booking.user_name || booking.user_id || "-"}</td>
            <td>{booking.booking_date || "-"}</td>
            <td>{booking.start_time || "-"}</td>
            <td>{booking.end_time || "-"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
