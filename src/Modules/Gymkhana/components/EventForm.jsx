import { useEffect, useState } from "react";
import PropTypes from "prop-types";
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
  createEvent,
  extractErrorMessage,
  getEvents,
  getClubs,
  entityRows,
} from "../api";

const initialState = {
  title: "",
  club_id: "",
  event_date: "",
  start_time: "",
  end_time: "",
  venue: "",
  description: "",
};

export default function EventForm({ onCreated }) {
  const [form, setForm] = useState(initialState);
  const [existingEvents, setExistingEvents] = useState([]);
  const [clubOptions, setClubOptions] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadReferenceData() {
      try {
        const [eventData, clubData] = await Promise.all([getEvents(), getClubs()]);
        if (mounted) {
          setExistingEvents(entityRows(eventData, "events"));
          const clubs = entityRows(clubData, "clubs");
          setClubOptions(
            clubs.map((club) => ({
              value: String(club.id),
              label: club.name || club.club_name || `Club ${club.id}`,
            })),
          );
        }
      } catch {
        if (mounted) {
          setExistingEvents([]);
          setClubOptions([]);
        }
      }
    }

    loadReferenceData();

    return () => {
      mounted = false;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const hasScheduleConflict = () => {
    const currentClubId = Number(form.club_id);

    if (!currentClubId || !form.event_date) {
      return false;
    }

    return existingEvents.some((existingEvent) => {
      const existingClubId = Number(existingEvent.club_id);
      const existingDate = existingEvent.event_date || existingEvent.date;

      if (
        existingClubId !== currentClubId ||
        existingDate !== form.event_date
      ) {
        return false;
      }

      const existingStart = existingEvent.start_time;
      const existingEnd = existingEvent.end_time;

      if (
        !form.start_time ||
        !form.end_time ||
        !existingStart ||
        !existingEnd
      ) {
        return true;
      }

      return form.start_time < existingEnd && form.end_time > existingStart;
    });
  };

  const validate = () => {
    if (!form.title || !form.club_id || !form.event_date || !form.venue) {
      return "Please fill all mandatory fields (title, club, date, venue).";
    }

    if (!form.start_time || !form.end_time) {
      return "Please provide event start and end time.";
    }

    if (form.start_time && form.end_time && form.end_time <= form.start_time) {
      return "End time must be after start time.";
    }

    if (hasScheduleConflict()) {
      return "An event already exists for this club at the selected date/time.";
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
      await createEvent({
        ...form,
        club_id: Number(form.club_id),
      });
      setForm(initialState);
      setSuccess("Event created successfully.");
      const refreshedEvents = await getEvents();
      setExistingEvents(entityRows(refreshedEvents, "events"));

      if (onCreated) {
        onCreated();
      }
    } catch (err) {
      setError(extractErrorMessage(err, "Could not create event."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Paper shadow="xs" p="md" radius="md" withBorder mb="md">
      <form onSubmit={handleSubmit}>
        <Stack>
          <Title order={4}>Create Event</Title>
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
              label="Event title"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
            <Select
              label="Club"
              name="club_id"
              data={clubOptions}
              value={form.club_id}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, club_id: value || "" }))
              }
              searchable
              required
              placeholder="Select club"
              nothingFoundMessage="No clubs"
            />
            <TextInput
              label="Event date"
              type="date"
              name="event_date"
              value={form.event_date}
              onChange={handleChange}
              required
            />
            <TextInput
              label="Venue"
              name="venue"
              value={form.venue}
              onChange={handleChange}
              required
            />
            <TextInput
              label="Start time"
              type="time"
              name="start_time"
              value={form.start_time}
              onChange={handleChange}
              required
            />
            <TextInput
              label="End time"
              type="time"
              name="end_time"
              value={form.end_time}
              onChange={handleChange}
              required
            />
          </SimpleGrid>
          <Textarea
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            minRows={3}
          />
          <Group justify="space-between">
            <Text c="dimmed" size="sm">
              BR-GM-009 conflict checks are enforced before submission.
            </Text>
            <Button type="submit" loading={submitting}>
              Create Event
            </Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
}

EventForm.propTypes = {
  onCreated: PropTypes.func,
};
