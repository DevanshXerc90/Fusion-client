import { useEffect, useState } from "react";
import { extractErrorMessage, extractRows, getClubs } from "../api";

const CLUBS_CHANGED_EVENT = "gymkhana:clubs:changed";

export default function ClubTable() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function fetchClubs() {
      setLoading(true);
      setError("");
      try {
        const data = await getClubs();
        if (mounted) {
          setClubs(extractRows(data));
        }
      } catch (err) {
        if (mounted) {
          setError(extractErrorMessage(err, "Failed to load clubs."));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    function handleClubsChanged() {
      fetchClubs();
    }

    fetchClubs();
    window.addEventListener(CLUBS_CHANGED_EVENT, handleClubsChanged);

    return () => {
      mounted = false;
      window.removeEventListener(CLUBS_CHANGED_EVENT, handleClubsChanged);
    };
  }, []);

  if (loading) {
    return <p>Loading clubs...</p>;
  }

  if (error) {
    return <p style={{ color: "#b00020" }}>{error}</p>;
  }

  return (
    <table border="1" cellPadding="8" cellSpacing="0" width="100%">
      <thead>
        <tr>
          <th>Club Name</th>
          <th>Description</th>
          <th>Coordinator</th>
        </tr>
      </thead>
      <tbody>
        {clubs.length === 0 && (
          <tr>
            <td colSpan="3" align="center">
              No clubs found.
            </td>
          </tr>
        )}
        {clubs.map((club) => (
          <tr key={club.id || club.name}>
            <td>{club.name || club.club_name || "-"}</td>
            <td>{club.description || "-"}</td>
            <td>{club.coordinator_name || club.coordinator_id || "-"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
