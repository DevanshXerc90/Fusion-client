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
  Title,
} from "@mantine/core";
import {
  createElectionParticipation,
  entityRows,
  extractErrorMessage,
  getClubs,
} from "../api";

const initialState = {
  election_id: "",
  club_id: "",
  student_id: "",
  candidate_name: "",
};

export default function ElectionForm() {
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
        setClubOptions(clubs.map((club) => ({ value: String(club.id), label: club.name })));
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
    if (!form.election_id || !form.club_id || !form.student_id || !form.candidate_name.trim()) {
      return "All fields are mandatory.";
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
      await createElectionParticipation({
        ...form,
        student_id: Number(form.student_id),
        club_id: Number(form.club_id),
      });
      setForm(initialState);
      setSuccess("Election participation recorded.");
    } catch (err) {
      setError(extractErrorMessage(err, "Could not record participation."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Paper shadow="xs" p="md" radius="md" withBorder mb="md">
      <form onSubmit={handleSubmit}>
        <Stack>
          <Title order={4}>Election Participation</Title>
          {error && <Alert color="red" variant="light">{error}</Alert>}
          {success && <Alert color="green" variant="light">{success}</Alert>}
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
            <TextInput
              label="Election ID"
              name="election_id"
              value={form.election_id}
              onChange={handleChange}
              required
            />
            <Select
              label="Club"
              data={clubOptions}
              value={form.club_id}
              onChange={(value) => setForm((prev) => ({ ...prev, club_id: value || "" }))}
              searchable
              required
              placeholder="Select club"
            />
            <TextInput
              label="Student ID"
              name="student_id"
              type="number"
              value={form.student_id}
              onChange={handleChange}
              required
            />
            <TextInput
              label="Candidate"
              name="candidate_name"
              value={form.candidate_name}
              onChange={handleChange}
              required
            />
          </SimpleGrid>
          <Group justify="space-between">
            <Text size="sm" c="dimmed">Single participation per election is enforced.</Text>
            <Button type="submit" loading={submitting}>Submit Vote</Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
}
