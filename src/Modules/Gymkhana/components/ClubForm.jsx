import { useEffect, useState } from "react";
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
  Textarea,
  Title,
} from "@mantine/core";
import { createClub, entityRows, extractErrorMessage, getClubs } from "../api";

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

        const names = entityRows(data, "clubs")
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
    <Paper shadow="xs" p="md" radius="md" withBorder mb="md">
      <form onSubmit={handleSubmit}>
        <Stack>
          <Title order={4}>Propose / Create Club</Title>
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
              label="Club name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <TextInput
              label="Coordinator ID"
              name="coordinator_id"
              type="number"
              value={form.coordinator_id}
              onChange={handleChange}
              placeholder="Optional"
            />
          </SimpleGrid>
          <Textarea
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            minRows={3}
            required
          />
          <Group justify="space-between">
            <Text c="dimmed" size="sm">
              BR-GM-002 unique name and BR-GM-003 mandatory fields are enforced.
            </Text>
            <Button type="submit" loading={submitting}>
              Submit
            </Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
}

ClubForm.propTypes = {
  onCreated: PropTypes.func,
};
