import { useState } from "react";
import { Alert, Button, Group, Paper, Stack, Text, TextInput, Title } from "@mantine/core";
import { deactivateClub, extractErrorMessage } from "../api";

const initialState = {
  id: "",
};

export default function DeactivationForm() {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.id) {
      setError("Inactive club record ID is mandatory.");
      return;
    }

    setSubmitting(true);
    try {
      await deactivateClub({ id: Number(form.id) });
      setForm(initialState);
      setSuccess("Club deactivated successfully.");
    } catch (err) {
      setError(extractErrorMessage(err, "Could not deactivate club."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Paper shadow="xs" p="md" radius="md" withBorder mb="md">
      <form onSubmit={handleSubmit}>
        <Stack>
          <Title order={4}>Deactivate Inactive Club</Title>
          {error && <Alert color="red" variant="light">{error}</Alert>}
          {success && <Alert color="green" variant="light">{success}</Alert>}
          <TextInput
            label="Inactive Club Record ID"
            name="id"
            type="number"
            value={form.id}
            onChange={(event) => setForm({ id: event.target.value })}
            required
          />
          <Group justify="space-between">
            <Text size="sm" c="dimmed">Financial clearance must be completed before deactivation.</Text>
            <Button type="submit" loading={submitting}>Deactivate</Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
}
