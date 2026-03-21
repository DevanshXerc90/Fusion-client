import { useEffect, useState } from "react";
import { Alert, Button, Group, Loader, Paper, Table, Text, Title } from "@mantine/core";
import { entityRows, extractErrorMessage, getFacilities, gymkhanaEntityEvents } from "../api";

export default function FacilityTable() {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function fetchFacilities() {
      setLoading(true);
      setError("");
      try {
        const data = await getFacilities();
        if (mounted) {
          setFacilities(entityRows(data, "facilities"));
        }
      } catch (err) {
        if (mounted) {
          setError(extractErrorMessage(err, "Failed to load facilities."));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    function handleFacilitiesChanged() {
      fetchFacilities();
    }

    fetchFacilities();
    window.addEventListener(gymkhanaEntityEvents.facilities, handleFacilitiesChanged);

    return () => {
      mounted = false;
      window.removeEventListener(
        gymkhanaEntityEvents.facilities,
        handleFacilitiesChanged,
      );
    };
  }, []);

  if (loading) {
    return (
      <Group justify="center" py="md">
        <Loader size="sm" />
        <Text size="sm">Loading facilities...</Text>
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
        <Title order={4}>Facilities</Title>
        <Button variant="light" onClick={() => window.dispatchEvent(new Event(gymkhanaEntityEvents.facilities))}>
          Refresh
        </Button>
      </Group>
      {facilities.length === 0 ? (
        <Text c="dimmed" ta="center" py="md">
          No facilities found.
        </Text>
      ) : (
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Facility</Table.Th>
              <Table.Th>Sport Type</Table.Th>
              <Table.Th>Location</Table.Th>
              <Table.Th>Capacity</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {facilities.map((facility) => (
              <Table.Tr key={facility.id || facility.name}>
                <Table.Td>{facility.name || "-"}</Table.Td>
                <Table.Td>{facility.sport_type || "-"}</Table.Td>
                <Table.Td>{facility.location || "-"}</Table.Td>
                <Table.Td>{facility.capacity || "-"}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}
    </Paper>
  );
}
