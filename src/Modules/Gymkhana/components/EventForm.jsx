import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  createEvent,
  extractErrorMessage,
  extractRows,
  getEvents,
} from "../api";

const EVENTS_CHANGED_EVENT = "gymkhana:events:changed";

const initialState = {
  title: "",
  club_id: "",
  event_date: "",
  start_time: "",
  end_time: "",
  venue: "",
  description: "",
};

export default function EventForm({ onCreated }) {
  const [form, setForm] = useState(initialState);
  const [existingEvents, setExistingEvents] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function fetchExistingEvents() {
      try {
        const data = await getEvents();
        if (mounted) {
          setExistingEvents(extractRows(data));
        }
      } catch {
        if (mounted) {
          setExistingEvents([]);
        }
      }
    }

    fetchExistingEvents();

    return () => {
      mounted = false;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const hasScheduleConflict = () => {
    const currentClubId = Number(form.club_id);

    if (!currentClubId || !form.event_date) {
      return false;
    }

    return existingEvents.some((existingEvent) => {
      const existingClubId = Number(existingEvent.club_id);
      const existingDate = existingEvent.event_date || existingEvent.date;

      if (
        existingClubId !== currentClubId ||
        existingDate !== form.event_date
      ) {
        return false;
      }

      const existingStart = existingEvent.start_time;
      const existingEnd = existingEvent.end_time;

      if (
        !form.start_time ||
        !form.end_time ||
        !existingStart ||
        !existingEnd
      ) {
        return true;
      }

      return form.start_time < existingEnd && form.end_time > existingStart;
    });
  };

  const validate = () => {
    if (!form.title || !form.club_id || !form.event_date || !form.venue) {
      return "Please fill all mandatory fields (title, club, date, venue).";
    }

    if (!form.start_time || !form.end_time) {
      return "Please provide event start and end time.";
    }

    if (form.start_time && form.end_time && form.end_time <= form.start_time) {
      return "End time must be after start time.";
    }

    if (hasScheduleConflict()) {
      return "An event already exists for this club at the selected date/time.";
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
      await createEvent({
        ...form,
        club_id: Number(form.club_id),
      });
      setForm(initialState);
      setSuccess("Event created successfully.");
      const refreshedEvents = await getEvents();
      setExistingEvents(extractRows(refreshedEvents));
      window.dispatchEvent(new Event(EVENTS_CHANGED_EVENT));

      if (onCreated) {
        onCreated();
      }
    } catch (err) {
      setError(extractErrorMessage(err, "Could not create event."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
      <h3>Create Event</h3>
      <div>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Event title"
        />
      </div>
      <div>
        <input
          name="club_id"
          type="number"
          value={form.club_id}
          onChange={handleChange}
          placeholder="Club ID"
        />
      </div>
      <div>
        <input
          name="event_date"
          type="date"
          value={form.event_date}
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
        <input
          name="venue"
          value={form.venue}
          onChange={handleChange}
          placeholder="Venue"
        />
      </div>
      <div>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
        />
      </div>
      <button type="submit" disabled={submitting}>
        {submitting ? "Creating..." : "Create Event"}
      </button>
      {error && <p style={{ color: "#b00020" }}>{error}</p>}
      {success && <p style={{ color: "#0b6b2d" }}>{success}</p>}
    </form>
  );
}

EventForm.propTypes = {
  onCreated: PropTypes.func,
};
