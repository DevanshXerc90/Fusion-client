import { useEffect, useState } from "react";
import { extractErrorMessage, extractRows, getEvents } from "../api";

const EVENTS_CHANGED_EVENT = "gymkhana:events:changed";

export default function EventTable() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function fetchEvents() {
      setLoading(true);
      setError("");
      try {
        const data = await getEvents();
        if (mounted) {
          setEvents(extractRows(data));
        }
      } catch (err) {
        if (mounted) {
          setError(extractErrorMessage(err, "Failed to load events."));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    function handleEventsChanged() {
      fetchEvents();
    }

    fetchEvents();
    window.addEventListener(EVENTS_CHANGED_EVENT, handleEventsChanged);

    return () => {
      mounted = false;
      window.removeEventListener(EVENTS_CHANGED_EVENT, handleEventsChanged);
    };
  }, []);

  if (loading) {
    return <p>Loading events...</p>;
  }

  if (error) {
    return <p style={{ color: "#b00020" }}>{error}</p>;
  }

  return (
    <table border="1" cellPadding="8" cellSpacing="0" width="100%">
      <thead>
        <tr>
          <th>Event</th>
          <th>Club</th>
          <th>Date</th>
          <th>Venue</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {events.length === 0 && (
          <tr>
            <td colSpan="5" align="center">
              No events found.
            </td>
          </tr>
        )}
        {events.map((event) => {
          const eventDateRaw = event.event_date || event.date;
          const archived = eventDateRaw && new Date(eventDateRaw) < new Date();

          return (
            <tr key={event.id || `${event.title}-${eventDateRaw}`}>
              <td>{event.title || event.name || "-"}</td>
              <td>{event.club_name || event.club || event.club_id || "-"}</td>
              <td>{eventDateRaw || "-"}</td>
              <td>{event.venue || "-"}</td>
              <td>{archived ? "Archived" : "Active"}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
