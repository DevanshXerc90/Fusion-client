import { useEffect, useState } from "react";
import { Alert, Button, Group, Loader, Paper, Table, Text, Title } from "@mantine/core";
import {
  deactivateClub,
  entityRows,
  extractErrorMessage,
  getInactiveClubs,
  gymkhanaEntityEvents,
} from "../api";

export default function DeactivationTable() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadRows = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getInactiveClubs();
      setRows(entityRows(data, "deactivation"));
    } catch (err) {
      setError(extractErrorMessage(err, "Failed to load inactive clubs."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    function handleChanged() {
      loadRows();
    }
    loadRows();
    window.addEventListener(gymkhanaEntityEvents.deactivation, handleChanged);
    return () => {
      window.removeEventListener(gymkhanaEntityEvents.deactivation, handleChanged);
    };
  }, []);

  const handleDeactivate = async (id) => {
    setError("");
    try {
      await deactivateClub({ id });
      await loadRows();
    } catch (err) {
      setError(extractErrorMessage(err, "Could not deactivate club."));
    }
  };

  if (loading) {
    return (
      <Group justify="center" py="md">
        <Loader size="sm" />
        <Text size="sm">Loading inactive clubs...</Text>
      </Group>
    );
  }

  return (
    <Paper shadow="xs" p="md" radius="md" withBorder>
      <Group justify="space-between" mb="md">
        <Title order={4}>Inactive Clubs</Title>
        <Button variant="light" onClick={loadRows}>Refresh</Button>
      </Group>
      {error && <Alert color="red" variant="light" mb="md">{error}</Alert>}
      {rows.length === 0 ? (
        <Text c="dimmed" ta="center" py="md">No inactive clubs found.</Text>
      ) : (
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>ID</Table.Th>
              <Table.Th>Club</Table.Th>
              <Table.Th>Financial Status</Table.Th>
              <Table.Th>Current Status</Table.Th>
              <Table.Th>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.map((row) => (
              <Table.Tr key={row.id}>
                <Table.Td>{row.id}</Table.Td>
                <Table.Td>{row.club_name || row.club_id}</Table.Td>
                <Table.Td>{row.financial_status}</Table.Td>
                <Table.Td>{row.status}</Table.Td>
                <Table.Td>
                  <Button
                    size="xs"
                    variant="light"
                    color="red"
                    disabled={row.deactivated}
                    onClick={() => handleDeactivate(row.id)}
                  >
                    {row.deactivated ? "Deactivated" : "Deactivate"}
                  </Button>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}
    </Paper>
  );
}
