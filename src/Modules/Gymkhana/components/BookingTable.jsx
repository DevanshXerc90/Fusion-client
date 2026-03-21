import { useEffect, useState } from "react";
import { Alert, Button, Group, Loader, Paper, Table, Text, Title } from "@mantine/core";
import { entityRows, extractErrorMessage, getBookings, gymkhanaEntityEvents } from "../api";

export default function BookingTable() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function fetchBookings() {
      setLoading(true);
      setError("");
      try {
        const data = await getBookings();
        if (mounted) {
          setBookings(entityRows(data, "bookings"));
        }
      } catch (err) {
        if (mounted) {
          setError(extractErrorMessage(err, "Failed to load bookings."));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    function handleBookingsChanged() {
      fetchBookings();
    }

    fetchBookings();
    window.addEventListener(gymkhanaEntityEvents.bookings, handleBookingsChanged);

    return () => {
      mounted = false;
      window.removeEventListener(gymkhanaEntityEvents.bookings, handleBookingsChanged);
    };
  }, []);

  if (loading) {
    return (
      <Group justify="center" py="md">
        <Loader size="sm" />
        <Text size="sm">Loading bookings...</Text>
      </Group>
    );
  }

  if (error) {
    return (
      <Alert color="red" variant="light" mb="md">
        {error}
      </Alert>
    );
  }

  return (
    <Paper shadow="xs" p="md" radius="md" withBorder>
      <Group justify="space-between" mb="md">
        <Title order={4}>Bookings</Title>
        <Button variant="light" onClick={() => window.dispatchEvent(new Event(gymkhanaEntityEvents.bookings))}>
          Refresh
        </Button>
      </Group>
      {bookings.length === 0 ? (
        <Text c="dimmed" ta="center" py="md">
          No bookings found.
        </Text>
      ) : (
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Facility</Table.Th>
              <Table.Th>User</Table.Th>
              <Table.Th>Booking Date</Table.Th>
              <Table.Th>Start</Table.Th>
              <Table.Th>End</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {bookings.map((booking) => (
              <Table.Tr key={booking.id || `${booking.facility_id}-${booking.booking_date}`}>
                <Table.Td>{booking.facility_name || booking.facility_id || "-"}</Table.Td>
                <Table.Td>{booking.user_name || booking.user_id || "-"}</Table.Td>
                <Table.Td>{booking.booking_date || "-"}</Table.Td>
                <Table.Td>{booking.start_time || "-"}</Table.Td>
                <Table.Td>{booking.end_time || "-"}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}
    </Paper>
  );
}
