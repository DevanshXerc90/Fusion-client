import { useEffect, useState } from "react";
import { Alert, Button, Group, Loader, Paper, Table, Text, Title } from "@mantine/core";
import {
  entityRows,
  extractErrorMessage,
  getMemberships,
  gymkhanaEntityEvents,
  updateMembershipStatus,
} from "../api";

export default function MembershipTable() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadRows = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getMemberships();
      setRows(entityRows(data, "memberships"));
    } catch (err) {
      setError(extractErrorMessage(err, "Failed to load membership applications."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    function handleChanged() {
      loadRows();
    }
    loadRows();
    window.addEventListener(gymkhanaEntityEvents.memberships, handleChanged);
    return () => {
      window.removeEventListener(gymkhanaEntityEvents.memberships, handleChanged);
    };
  }, []);

  const handleDecision = async (id, status) => {
    setError("");
    try {
      await updateMembershipStatus({ id, status });
      await loadRows();
    } catch (err) {
      setError(extractErrorMessage(err, "Could not update membership status."));
    }
  };

  if (loading) {
    return (
      <Group justify="center" py="md">
        <Loader size="sm" />
        <Text size="sm">Loading memberships...</Text>
      </Group>
    );
  }

  return (
    <Paper shadow="xs" p="md" radius="md" withBorder>
      <Group justify="space-between" mb="md">
        <Title order={4}>Membership Applications</Title>
        <Button variant="light" onClick={loadRows}>Refresh</Button>
      </Group>
      {error && <Alert color="red" variant="light" mb="md">{error}</Alert>}
      {rows.length === 0 ? (
        <Text c="dimmed" ta="center" py="md">No applications found.</Text>
      ) : (
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Student</Table.Th>
              <Table.Th>Club</Table.Th>
              <Table.Th>Motivation</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.map((row) => {
              const locked = ["Approved", "Rejected"].includes(row.status);
              return (
                <Table.Tr key={row.id}>
                  <Table.Td>{row.student_name || row.student_id}</Table.Td>
                  <Table.Td>{row.club_name || row.club_id}</Table.Td>
                  <Table.Td>{row.motivation || "-"}</Table.Td>
                  <Table.Td>{row.status}</Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <Button
                        size="xs"
                        variant="light"
                        color="green"
                        disabled={locked}
                        onClick={() => handleDecision(row.id, "Approved")}
                      >
                        Approve
                      </Button>
                      <Button
                        size="xs"
                        variant="light"
                        color="red"
                        disabled={locked}
                        onClick={() => handleDecision(row.id, "Rejected")}
                      >
                        Reject
                      </Button>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      )}
    </Paper>
  );
}
