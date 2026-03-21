import { useState } from "react";
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
import { createBill, extractErrorMessage } from "../api";

const initialState = {
  budget_id: "",
  amount: "",
  category: "",
  file_type: "pdf",
  notes: "",
};

export default function BillForm() {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!form.budget_id || !form.amount || !form.category.trim() || !form.file_type) {
      return "Budget, amount, category and file type are mandatory.";
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
      await createBill({
        ...form,
        budget_id: Number(form.budget_id),
        amount: Number(form.amount),
      });
      setForm(initialState);
      setSuccess("Bill submitted for settlement.");
    } catch (err) {
      setError(extractErrorMessage(err, "Could not submit bill."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Paper shadow="xs" p="md" radius="md" withBorder mb="md">
      <form onSubmit={handleSubmit}>
        <Stack>
          <Title order={4}>Bill Settlement Submission</Title>
          {error && <Alert color="red" variant="light">{error}</Alert>}
          {success && <Alert color="green" variant="light">{success}</Alert>}
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
            <TextInput
              label="Budget ID"
              name="budget_id"
              type="number"
              value={form.budget_id}
              onChange={handleChange}
              required
            />
            <TextInput
              label="Amount"
              name="amount"
              type="number"
              value={form.amount}
              onChange={handleChange}
              required
            />
            <TextInput
              label="Category"
              name="category"
              value={form.category}
              onChange={handleChange}
              required
            />
            <TextInput
              label="Receipt format"
              name="file_type"
              value={form.file_type}
              onChange={handleChange}
              required
              placeholder="pdf/jpg/jpeg/png"
            />
          </SimpleGrid>
          <Textarea
            label="Notes"
            name="notes"
            value={form.notes}
            onChange={handleChange}
            minRows={3}
          />
          <Group justify="space-between">
            <Text c="dimmed" size="sm">Budget adherence and file format checks are enforced.</Text>
            <Button type="submit" loading={submitting}>Submit Bill</Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
}
