import { useEffect, useState } from "react";
import { Alert, Button, Group, Loader, Paper, Table, Text, Title } from "@mantine/core";
import {
  entityRows,
  extractErrorMessage,
  getBills,
  gymkhanaEntityEvents,
  reviewBill,
} from "../api";

export default function BillTable() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadRows = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getBills();
      setRows(entityRows(data, "bills"));
    } catch (err) {
      setError(extractErrorMessage(err, "Failed to load bills."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    function handleChanged() {
      loadRows();
    }
    loadRows();
    window.addEventListener(gymkhanaEntityEvents.bills, handleChanged);
    return () => {
      window.removeEventListener(gymkhanaEntityEvents.bills, handleChanged);
    };
  }, []);

  const handleDecision = async (id, status) => {
    setError("");
    try {
      await reviewBill({ id, status });
      await loadRows();
    } catch (err) {
      setError(extractErrorMessage(err, "Could not update bill status."));
    }
  };

  if (loading) {
    return (
      <Group justify="center" py="md">
        <Loader size="sm" />
        <Text size="sm">Loading bills...</Text>
      </Group>
    );
  }

  return (
    <Paper shadow="xs" p="md" radius="md" withBorder>
      <Group justify="space-between" mb="md">
        <Title order={4}>Bill Settlements</Title>
        <Button variant="light" onClick={loadRows}>Refresh</Button>
      </Group>
      {error && <Alert color="red" variant="light" mb="md">{error}</Alert>}
      {rows.length === 0 ? (
        <Text c="dimmed" ta="center" py="md">No bills found.</Text>
      ) : (
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Budget ID</Table.Th>
              <Table.Th>Amount</Table.Th>
              <Table.Th>Category</Table.Th>
              <Table.Th>Format</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.map((row) => (
              <Table.Tr key={row.id}>
                <Table.Td>{row.budget_id}</Table.Td>
                <Table.Td>{row.amount}</Table.Td>
                <Table.Td>{row.category}</Table.Td>
                <Table.Td>{row.file_type}</Table.Td>
                <Table.Td>{row.status}</Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <Button
                      size="xs"
                      variant="light"
                      color="green"
                      onClick={() => handleDecision(row.id, "Approved")}
                    >
                      Approve
                    </Button>
                    <Button
                      size="xs"
                      variant="light"
                      color="red"
                      onClick={() => handleDecision(row.id, "Rejected")}
                    >
                      Reject
                    </Button>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}
    </Paper>
  );
}
