import { useEffect, useState } from "react";
import { extractErrorMessage, extractRows, getFacilities } from "../api";

const FACILITIES_CHANGED_EVENT = "gymkhana:facilities:changed";

export default function FacilityTable() {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function fetchFacilities() {
      setLoading(true);
      setError("");
      try {
        const data = await getFacilities();
        if (mounted) {
          setFacilities(extractRows(data));
        }
      } catch (err) {
        if (mounted) {
          setError(extractErrorMessage(err, "Failed to load facilities."));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    function handleFacilitiesChanged() {
      fetchFacilities();
    }

    fetchFacilities();
    window.addEventListener(FACILITIES_CHANGED_EVENT, handleFacilitiesChanged);

    return () => {
      mounted = false;
      window.removeEventListener(
        FACILITIES_CHANGED_EVENT,
        handleFacilitiesChanged,
      );
    };
  }, []);

  if (loading) {
    return <p>Loading facilities...</p>;
  }

  if (error) {
    return <p style={{ color: "#b00020" }}>{error}</p>;
  }

  return (
    <table border="1" cellPadding="8" cellSpacing="0" width="100%">
      <thead>
        <tr>
          <th>Facility</th>
          <th>Sport Type</th>
          <th>Location</th>
          <th>Capacity</th>
        </tr>
      </thead>
      <tbody>
        {facilities.length === 0 && (
          <tr>
            <td colSpan="4" align="center">
              No facilities found.
            </td>
          </tr>
        )}
        {facilities.map((facility) => (
          <tr key={facility.id || facility.name}>
            <td>{facility.name || "-"}</td>
            <td>{facility.sport_type || "-"}</td>
            <td>{facility.location || "-"}</td>
            <td>{facility.capacity || "-"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
