import { useState } from "react";
import PropTypes from "prop-types";
import { createFacility, extractErrorMessage } from "../api";

const FACILITIES_CHANGED_EVENT = "gymkhana:facilities:changed";

const initialState = {
  name: "",
  sport_type: "",
  location: "",
  capacity: "",
};

export default function FacilityForm({ onCreated }) {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!form.name || !form.sport_type || !form.location) {
      return "Name, sport type and location are mandatory.";
    }
    if (form.capacity && Number(form.capacity) <= 0) {
      return "Capacity must be a positive number.";
    }

    if (!form.name.trim() || !form.sport_type.trim() || !form.location.trim()) {
      return "Mandatory fields cannot contain only whitespace.";
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
      await createFacility({
        ...form,
        capacity: form.capacity ? Number(form.capacity) : null,
      });
      setForm(initialState);
      setSuccess("Facility created successfully.");
      window.dispatchEvent(new Event(FACILITIES_CHANGED_EVENT));

      if (onCreated) {
        onCreated();
      }
    } catch (err) {
      setError(extractErrorMessage(err, "Could not create facility."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
      <h3>Add Facility</h3>
      <div>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Facility name"
        />
      </div>
      <div>
        <input
          name="sport_type"
          value={form.sport_type}
          onChange={handleChange}
          placeholder="Sport type"
        />
      </div>
      <div>
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Location"
        />
      </div>
      <div>
        <input
          name="capacity"
          type="number"
          value={form.capacity}
          onChange={handleChange}
          placeholder="Capacity"
        />
      </div>
      <button type="submit" disabled={submitting}>
        {submitting ? "Creating..." : "Create Facility"}
      </button>
      {error && <p style={{ color: "#b00020" }}>{error}</p>}
      {success && <p style={{ color: "#0b6b2d" }}>{success}</p>}
    </form>
  );
}

FacilityForm.propTypes = {
  onCreated: PropTypes.func,
};
