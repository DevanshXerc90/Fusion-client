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
  createBooking,
  entityRows,
  extractErrorMessage,
  getBookings,
  getFacilities,
} from "../api";

const initialState = {
  facility_id: "",
  user_id: "",
  booking_date: "",
  start_time: "",
  end_time: "",
  purpose: "",
};

export default function BookingForm({ onCreated }) {
  const [form, setForm] = useState(initialState);
  const [facilities, setFacilities] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        const [facilityData, bookingData] = await Promise.all([
          getFacilities(),
          getBookings(),
        ]);
        if (mounted) {
          setFacilities(entityRows(facilityData, "facilities"));
          setBookings(entityRows(bookingData, "bookings"));
        }
      } catch {
        if (mounted) {
          setFacilities([]);
          setBookings([]);
        }
      }
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (
      !form.facility_id ||
      !form.booking_date ||
      !form.start_time ||
      !form.end_time
    ) {
      return "Facility, date, start time and end time are mandatory.";
    }

    if (form.end_time <= form.start_time) {
      return "End time must be after start time.";
    }

    if (!form.purpose.trim()) {
      return "Purpose cannot be empty.";
    }

    const hasConflict = bookings.some((booking) => {
      const sameFacility = Number(booking.facility_id) === Number(form.facility_id);
      const sameDate = booking.booking_date === form.booking_date;
      if (!sameFacility || !sameDate) {
        return false;
      }

      return form.start_time < booking.end_time && form.end_time > booking.start_time;
    });

    if (hasConflict) {
      return "Selected facility is not available in the selected slot.";
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
      await createBooking({
        ...form,
        facility_id: Number(form.facility_id),
        user_id: form.user_id ? Number(form.user_id) : null,
      });
      const refreshedBookings = await getBookings();
      setBookings(entityRows(refreshedBookings, "bookings"));
      setForm(initialState);
      setSuccess("Booking created successfully.");

      if (onCreated) {
        onCreated();
      }
    } catch (err) {
      setError(extractErrorMessage(err, "Could not create booking."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Paper shadow="xs" p="md" radius="md" withBorder mb="md">
      <form onSubmit={handleSubmit}>
        <Stack>
          <Title order={4}>Create Booking</Title>
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
            <Select
              label="Facility"
              data={facilities.map((facility) => ({
                value: String(facility.id),
                label: facility.name || `Facility ${facility.id}`,
              }))}
              value={form.facility_id}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, facility_id: value || "" }))
              }
              searchable
              required
              placeholder="Select facility"
              nothingFoundMessage="No facilities"
            />
            <TextInput
              label="User ID"
              name="user_id"
              type="number"
              value={form.user_id}
              onChange={handleChange}
              placeholder="Optional"
            />
            <TextInput
              label="Booking date"
              type="date"
              name="booking_date"
              value={form.booking_date}
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
            label="Purpose"
            name="purpose"
            value={form.purpose}
            onChange={handleChange}
            minRows={3}
            required
          />
          <Group justify="space-between">
            <Text c="dimmed" size="sm">
              Availability is validated before booking submission.
            </Text>
            <Button type="submit" loading={submitting}>
              Create Booking
            </Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
}

BookingForm.propTypes = {
  onCreated: PropTypes.func,
};
