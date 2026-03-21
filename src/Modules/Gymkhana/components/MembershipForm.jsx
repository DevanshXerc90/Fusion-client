import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Group,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import {
  createMembership,
  entityRows,
  extractErrorMessage,
  getClubs,
} from "../api";

const initialState = {
  student_id: "",
  student_name: "",
  club_id: "",
  motivation: "",
};

export default function MembershipForm() {
  const [form, setForm] = useState(initialState);
  const [clubOptions, setClubOptions] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function loadClubs() {
      try {
        const data = await getClubs();
        if (!mounted) return;
        const clubs = entityRows(data, "clubs");
        setClubOptions(
          clubs.map((club) => ({
            value: String(club.id),
            label: club.name || `Club ${club.id}`,
          })),
        );
      } catch {
        if (mounted) setClubOptions([]);
      }
    }
    loadClubs();
    return () => {
      mounted = false;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!form.student_id || !form.club_id || !form.motivation.trim()) {
      return "Student ID, Club and Motivation are mandatory.";
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
      await createMembership({
        ...form,
        student_id: Number(form.student_id),
        club_id: Number(form.club_id),
      });
      setForm(initialState);
      setSuccess("Membership application submitted.");
    } catch (err) {
      setError(extractErrorMessage(err, "Could not submit membership application."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Paper shadow="xs" p="md" radius="md" withBorder mb="md">
      <form onSubmit={handleSubmit}>
        <Stack>
          <Title order={4}>Membership Application</Title>
          {error && <Alert color="red" variant="light">{error}</Alert>}
          {success && <Alert color="green" variant="light">{success}</Alert>}
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
            <TextInput
              label="Student ID"
              name="student_id"
              type="number"
              value={form.student_id}
              onChange={handleChange}
              required
            />
            <TextInput
              label="Student Name"
              name="student_name"
              value={form.student_name}
              onChange={handleChange}
              placeholder="Optional"
            />
            <Select
              label="Club"
              data={clubOptions}
              value={form.club_id}
              onChange={(value) => setForm((prev) => ({ ...prev, club_id: value || "" }))}
              searchable
              required
              placeholder="Select club"
              nothingFoundMessage="No clubs"
            />
          </SimpleGrid>
          <Textarea
            label="Motivation"
            name="motivation"
            value={form.motivation}
            onChange={handleChange}
            required
            minRows={3}
          />
          <Group justify="space-between">
            <Text size="sm" c="dimmed">Duplicate member checks are enforced.</Text>
            <Button type="submit" loading={submitting}>Submit Application</Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
}
