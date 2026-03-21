import { useEffect, useState } from "react";
import { Alert, Button, Group, Loader, Paper, Table, Text, Title } from "@mantine/core";
import {
  entityRows,
  extractErrorMessage,
  getElections,
  gymkhanaEntityEvents,
} from "../api";

export default function ElectionTable() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadRows = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getElections();
      setRows(entityRows(data, "elections"));
    } catch (err) {
      setError(extractErrorMessage(err, "Failed to load election entries."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    function handleChanged() {
      loadRows();
    }
    loadRows();
    window.addEventListener(gymkhanaEntityEvents.elections, handleChanged);
    return () => {
      window.removeEventListener(gymkhanaEntityEvents.elections, handleChanged);
    };
  }, []);

  if (loading) {
    return (
      <Group justify="center" py="md">
        <Loader size="sm" />
        <Text size="sm">Loading election entries...</Text>
      </Group>
    );
  }

  return (
    <Paper shadow="xs" p="md" radius="md" withBorder>
      <Group justify="space-between" mb="md">
        <Title order={4}>Election Participation Records</Title>
        <Button variant="light" onClick={loadRows}>Refresh</Button>
      </Group>
      {error && <Alert color="red" variant="light" mb="md">{error}</Alert>}
      {rows.length === 0 ? (
        <Text c="dimmed" ta="center" py="md">No election records found.</Text>
      ) : (
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Election ID</Table.Th>
              <Table.Th>Club</Table.Th>
              <Table.Th>Student</Table.Th>
              <Table.Th>Candidate</Table.Th>
              <Table.Th>Status</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.map((row) => (
              <Table.Tr key={row.id}>
                <Table.Td>{row.election_id}</Table.Td>
                <Table.Td>{row.club_name || row.club_id}</Table.Td>
                <Table.Td>{row.student_id}</Table.Td>
                <Table.Td>{row.candidate_name}</Table.Td>
                <Table.Td>{row.status}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}
    </Paper>
  );
}
