import { useState } from "react";
import PropTypes from "prop-types";
import {
  Alert,
  Button,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { createFacility, extractErrorMessage } from "../api";

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
    <Paper shadow="xs" p="md" radius="md" withBorder mb="md">
      <form onSubmit={handleSubmit}>
        <Stack>
          <Title order={4}>Add Facility</Title>
          {error && (
            <Alert color="red" variant="light">
              {error}
            </Alert>
          )}
          {success && (
            <Alert color="green" variant="light">
              {success}
            </Alert>
          )}
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
            <TextInput
              label="Facility name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <TextInput
              label="Sport type"
              name="sport_type"
              value={form.sport_type}
              onChange={handleChange}
              required
            />
            <TextInput
              label="Location"
              name="location"
              value={form.location}
              onChange={handleChange}
              required
            />
            <TextInput
              label="Capacity"
              name="capacity"
              type="number"
              value={form.capacity}
              onChange={handleChange}
            />
          </SimpleGrid>
          <Group justify="space-between">
            <Text c="dimmed" size="sm">
              Mandatory fields must be completed before submission.
            </Text>
            <Button type="submit" loading={submitting}>
              Create Facility
            </Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
}

FacilityForm.propTypes = {
  onCreated: PropTypes.func,
};
