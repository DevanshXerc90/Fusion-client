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
import { createBudget, entityRows, extractErrorMessage, getClubs } from "../api";

const initialState = {
  club_id: "",
  year: "",
  amount: "",
  details: "",
};

export default function BudgetForm() {
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
    if (!form.club_id || !form.year || !form.amount || !form.details.trim()) {
      return "All fields are mandatory.";
    }
    if (Number(form.amount) <= 0) {
      return "Amount must be greater than zero.";
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
      await createBudget({
        ...form,
        club_id: Number(form.club_id),
        year: Number(form.year),
        amount: Number(form.amount),
      });
      setForm(initialState);
      setSuccess("Budget submitted successfully.");
    } catch (err) {
      setError(extractErrorMessage(err, "Could not submit budget."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Paper shadow="xs" p="md" radius="md" withBorder mb="md">
      <form onSubmit={handleSubmit}>
        <Stack>
          <Title order={4}>Budget Submission</Title>
          {error && <Alert color="red" variant="light">{error}</Alert>}
          {success && <Alert color="green" variant="light">{success}</Alert>}
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
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
              label="Financial Year"
              name="year"
              type="number"
              value={form.year}
              onChange={handleChange}
              required
            />
            <TextInput
              label="Requested Amount"
              name="amount"
              type="number"
              value={form.amount}
              onChange={handleChange}
              required
            />
          </SimpleGrid>
          <Textarea
            label="Budget Details"
            name="details"
            value={form.details}
            onChange={handleChange}
            minRows={3}
            required
          />
          <Group justify="space-between">
            <Text size="sm" c="dimmed">Mandatory fields and workflow states are enforced.</Text>
            <Button type="submit" loading={submitting}>Submit Budget</Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
}
