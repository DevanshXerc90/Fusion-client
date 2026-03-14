import { useState } from "react";
import PropTypes from "prop-types";
import { createBooking, extractErrorMessage } from "../api";

const BOOKINGS_CHANGED_EVENT = "gymkhana:bookings:changed";

const initialState = {
  facility_id: "",
  user_id: "",
  booking_date: "",
  start_time: "",
  end_time: "",
  purpose: "",
};

export default function BookingForm({ onCreated }) {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (
      !form.facility_id ||
      !form.booking_date ||
      !form.start_time ||
      !form.end_time
    ) {
      return "Facility, date, start time and end time are mandatory.";
    }

    if (form.end_time <= form.start_time) {
      return "End time must be after start time.";
    }

    if (!form.purpose.trim()) {
      return "Purpose cannot be empty.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    try {
      await createBooking({
        ...form,
        facility_id: Number(form.facility_id),
        user_id: form.user_id ? Number(form.user_id) : null,
      });
      setForm(initialState);
      setSuccess("Booking created successfully.");
      window.dispatchEvent(new Event(BOOKINGS_CHANGED_EVENT));

      if (onCreated) {
        onCreated();
      }
    } catch (err) {
      setError(extractErrorMessage(err, "Could not create booking."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
      <h3>Create Booking</h3>
      <div>
        <input
          name="facility_id"
          type="number"
          value={form.facility_id}
          onChange={handleChange}
          placeholder="Facility ID"
        />
      </div>
      <div>
        <input
          name="user_id"
          type="number"
          value={form.user_id}
          onChange={handleChange}
          placeholder="User ID (optional)"
        />
      </div>
      <div>
        <input
          name="booking_date"
          type="date"
          value={form.booking_date}
          onChange={handleChange}
        />
      </div>
      <div>
        <input
          name="start_time"
          type="time"
          value={form.start_time}
          onChange={handleChange}
        />
      </div>
      <div>
        <input
          name="end_time"
          type="time"
          value={form.end_time}
          onChange={handleChange}
        />
      </div>
      <div>
        <textarea
          name="purpose"
          value={form.purpose}
          onChange={handleChange}
          placeholder="Purpose"
        />
      </div>
      <button type="submit" disabled={submitting}>
        {submitting ? "Creating..." : "Create Booking"}
      </button>
      {error && <p style={{ color: "#b00020" }}>{error}</p>}
      {success && <p style={{ color: "#0b6b2d" }}>{success}</p>}
    </form>
  );
}

BookingForm.propTypes = {
  onCreated: PropTypes.func,
};
