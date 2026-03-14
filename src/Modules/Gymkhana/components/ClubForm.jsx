import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { createClub, extractErrorMessage, extractRows, getClubs } from "../api";

const CLUBS_CHANGED_EVENT = "gymkhana:clubs:changed";

const initialState = {
  name: "",
  description: "",
  coordinator_id: "",
};

export default function ClubForm({ onCreated }) {
  const [form, setForm] = useState(initialState);
  const [existingClubNames, setExistingClubNames] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function fetchClubsForValidation() {
      try {
        const data = await getClubs();
        if (!mounted) {
          return;
        }

        const names = extractRows(data)
          .map((club) =>
            (club.name || club.club_name || "").trim().toLowerCase(),
          )
          .filter(Boolean);
        setExistingClubNames(names);
      } catch {
        if (mounted) {
          setExistingClubNames([]);
        }
      }
    }

    fetchClubsForValidation();

    return () => {
      mounted = false;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!form.name || !form.description) {
      return "Club name and description are mandatory.";
    }

    const normalizedName = form.name.trim().toLowerCase();
    if (existingClubNames.includes(normalizedName)) {
      return "A club with this name already exists.";
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
      await createClub({
        ...form,
        coordinator_id: form.coordinator_id
          ? Number(form.coordinator_id)
          : null,
      });

      const normalizedName = form.name.trim().toLowerCase();
      if (normalizedName) {
        setExistingClubNames((prev) => [...prev, normalizedName]);
      }

      setForm(initialState);
      setSuccess("Club created successfully.");
      window.dispatchEvent(new Event(CLUBS_CHANGED_EVENT));

      if (onCreated) {
        onCreated();
      }
    } catch (err) {
      setError(extractErrorMessage(err, "Could not create club."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
      <h3>Create Club</h3>
      <div>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Club name"
        />
      </div>
      <div>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Club description"
        />
      </div>
      <div>
        <input
          name="coordinator_id"
          type="number"
          value={form.coordinator_id}
          onChange={handleChange}
          placeholder="Coordinator ID (optional)"
        />
      </div>
      <button type="submit" disabled={submitting}>
        {submitting ? "Creating..." : "Create Club"}
      </button>
      {error && <p style={{ color: "#b00020" }}>{error}</p>}
      {success && <p style={{ color: "#0b6b2d" }}>{success}</p>}
    </form>
  );
}

ClubForm.propTypes = {
  onCreated: PropTypes.func,
};
