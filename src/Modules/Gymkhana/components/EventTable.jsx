import { useEffect, useState } from "react";
import { Alert, Button, Group, Loader, Paper, Table, Text, Title } from "@mantine/core";
import { entityRows, extractErrorMessage, getEvents, gymkhanaEntityEvents } from "../api";

export default function EventTable() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function fetchEvents() {
      setLoading(true);
      setError("");
      try {
        const data = await getEvents();
        if (mounted) {
          setEvents(entityRows(data, "events"));
        }
      } catch (err) {
        if (mounted) {
          setError(extractErrorMessage(err, "Failed to load events."));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    function handleEventsChanged() {
      fetchEvents();
    }

    fetchEvents();
    window.addEventListener(gymkhanaEntityEvents.events, handleEventsChanged);

    return () => {
      mounted = false;
      window.removeEventListener(gymkhanaEntityEvents.events, handleEventsChanged);
    };
  }, []);

  if (loading) {
    return (
      <Group justify="center" py="md">
        <Loader size="sm" />
        <Text size="sm">Loading events...</Text>
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
        <Title order={4}>Events</Title>
        <Button variant="light" onClick={() => window.dispatchEvent(new Event(gymkhanaEntityEvents.events))}>
          Refresh
        </Button>
      </Group>
      {events.length === 0 ? (
        <Text c="dimmed" ta="center" py="md">
          No events found.
        </Text>
      ) : (
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Event</Table.Th>
              <Table.Th>Club</Table.Th>
              <Table.Th>Date</Table.Th>
              <Table.Th>Venue</Table.Th>
              <Table.Th>Status</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {events.map((event) => {
              const eventDateRaw = event.event_date || event.date;
              const archived = eventDateRaw && new Date(eventDateRaw) < new Date();

              return (
                <Table.Tr key={event.id || `${event.title}-${eventDateRaw}`}>
                  <Table.Td>{event.title || event.name || "-"}</Table.Td>
                  <Table.Td>{event.club_name || event.club || event.club_id || "-"}</Table.Td>
                  <Table.Td>{eventDateRaw || "-"}</Table.Td>
                  <Table.Td>{event.venue || "-"}</Table.Td>
                  <Table.Td>{archived ? "Archived" : "Active"}</Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      )}
    </Paper>
  );
}
