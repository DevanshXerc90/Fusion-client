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
  createAnnouncement,
  entityRows,
  extractErrorMessage,
  getClubs,
} from "../api";

const initialState = {
  title: "",
  club_id: "",
  content: "",
};

export default function AnnouncementForm() {
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
    if (!form.title || !form.club_id || !form.content.trim()) {
      return "Title, club and content are mandatory.";
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
      await createAnnouncement({
        ...form,
        club_id: Number(form.club_id),
      });
      setForm(initialState);
      setSuccess("Announcement posted successfully.");
    } catch (err) {
      setError(extractErrorMessage(err, "Could not post announcement."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Paper shadow="xs" p="md" radius="md" withBorder mb="md">
      <form onSubmit={handleSubmit}>
        <Stack>
          <Title order={4}>Club Announcement / Report</Title>
          {error && <Alert color="red" variant="light">{error}</Alert>}
          {success && <Alert color="green" variant="light">{success}</Alert>}
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
            <TextInput
              label="Title"
              name="title"
              value={form.title}
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
          </SimpleGrid>
          <Textarea
            label="Content"
            name="content"
            value={form.content}
            onChange={handleChange}
            minRows={4}
            required
          />
          <Group justify="space-between">
            <Text size="sm" c="dimmed">Submission blocks empty content.</Text>
            <Button type="submit" loading={submitting}>Publish</Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
}
