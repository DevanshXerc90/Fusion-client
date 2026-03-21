import { useEffect, useState } from "react";
import { Alert, Button, Group, Loader, Paper, Table, Text, Title } from "@mantine/core";
import { entityRows, extractErrorMessage, getClubs, gymkhanaEntityEvents } from "../api";

export default function ClubTable() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function fetchClubs() {
      setLoading(true);
      setError("");
      try {
        const data = await getClubs();
        if (mounted) {
          setClubs(entityRows(data, "clubs"));
        }
      } catch (err) {
        if (mounted) {
          setError(extractErrorMessage(err, "Failed to load clubs."));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    function handleClubsChanged() {
      fetchClubs();
    }

    fetchClubs();
    window.addEventListener(gymkhanaEntityEvents.clubs, handleClubsChanged);

    return () => {
      mounted = false;
      window.removeEventListener(gymkhanaEntityEvents.clubs, handleClubsChanged);
    };
  }, []);

  if (loading) {
    return (
      <Group justify="center" py="md">
        <Loader size="sm" />
        <Text size="sm">Loading clubs...</Text>
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
        <Title order={4}>Clubs</Title>
        <Button variant="light" onClick={() => window.dispatchEvent(new Event(gymkhanaEntityEvents.clubs))}>
          Refresh
        </Button>
      </Group>
      {clubs.length === 0 ? (
        <Text c="dimmed" ta="center" py="md">
          No clubs found.
        </Text>
      ) : (
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Club Name</Table.Th>
              <Table.Th>Description</Table.Th>
              <Table.Th>Coordinator</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {clubs.map((club) => (
              <Table.Tr key={club.id || club.name}>
                <Table.Td>{club.name || club.club_name || "-"}</Table.Td>
                <Table.Td>{club.description || "-"}</Table.Td>
                <Table.Td>{club.coordinator_name || club.coordinator_id || "-"}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}
    </Paper>
  );
}
