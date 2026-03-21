import { useEffect, useState } from "react";
import { Alert, Button, Group, Loader, Paper, Table, Text, Title } from "@mantine/core";
import {
  entityRows,
  extractErrorMessage,
  getBudgets,
  gymkhanaEntityEvents,
  reviewBudget,
  finalizeBudget,
} from "../api";

export default function BudgetTable() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadRows = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getBudgets();
      setRows(entityRows(data, "budgets"));
    } catch (err) {
      setError(extractErrorMessage(err, "Failed to load budgets."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    function handleChanged() {
      loadRows();
    }
    loadRows();
    window.addEventListener(gymkhanaEntityEvents.budgets, handleChanged);
    return () => {
      window.removeEventListener(gymkhanaEntityEvents.budgets, handleChanged);
    };
  }, []);

  const handleCounsellorDecision = async (id, counsellor_decision) => {
    setError("");
    try {
      await reviewBudget({ id, counsellor_decision });
      await loadRows();
    } catch (err) {
      setError(extractErrorMessage(err, "Could not review budget."));
    }
  };

  const handleDeanDecision = async (id, dean_decision) => {
    setError("");
    try {
      await finalizeBudget({ id, dean_decision });
      await loadRows();
    } catch (err) {
      setError(extractErrorMessage(err, "Could not finalize budget."));
    }
  };

  if (loading) {
    return (
      <Group justify="center" py="md">
        <Loader size="sm" />
        <Text size="sm">Loading budgets...</Text>
      </Group>
    );
  }

  return (
    <Paper shadow="xs" p="md" radius="md" withBorder>
      <Group justify="space-between" mb="md">
        <Title order={4}>Budget Reviews</Title>
        <Button variant="light" onClick={loadRows}>Refresh</Button>
      </Group>
      {error && <Alert color="red" variant="light" mb="md">{error}</Alert>}
      {rows.length === 0 ? (
        <Text c="dimmed" ta="center" py="md">No budgets found.</Text>
      ) : (
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Club</Table.Th>
              <Table.Th>Year</Table.Th>
              <Table.Th>Amount</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Counsellor</Table.Th>
              <Table.Th>Dean</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.map((row) => {
              const locked = ["Approved", "Rejected"].includes(row.dean_decision);
              return (
                <Table.Tr key={row.id}>
                  <Table.Td>{row.club_name || row.club_id}</Table.Td>
                  <Table.Td>{row.year}</Table.Td>
                  <Table.Td>{row.amount}</Table.Td>
                  <Table.Td>{row.status}</Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <Button
                        size="xs"
                        variant="light"
                        disabled={locked}
                        onClick={() => handleCounsellorDecision(row.id, "Approved")}
                      >
                        Approve
                      </Button>
                      <Button
                        size="xs"
                        variant="light"
                        color="red"
                        disabled={locked}
                        onClick={() => handleCounsellorDecision(row.id, "Rejected")}
                      >
                        Reject
                      </Button>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <Button
                        size="xs"
                        variant="light"
                        color="green"
                        disabled={locked}
                        onClick={() => handleDeanDecision(row.id, "Approved")}
                      >
                        Final Approve
                      </Button>
                      <Button
                        size="xs"
                        variant="light"
                        color="red"
                        disabled={locked}
                        onClick={() => handleDeanDecision(row.id, "Rejected")}
                      >
                        Final Reject
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
