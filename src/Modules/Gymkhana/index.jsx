import { Button, Group, Paper, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { useNavigate } from "react-router-dom";

const pages = [
  { label: "Events", path: "/gymkhana/events", phase: "Phase 1" },
  { label: "Clubs", path: "/gymkhana/clubs", phase: "Phase 1" },
  { label: "Facilities", path: "/gymkhana/facilities", phase: "Phase 1" },
  { label: "Bookings", path: "/gymkhana/bookings", phase: "Phase 1" },
  { label: "Memberships", path: "/gymkhana/memberships", phase: "Phase 2" },
  { label: "Elections", path: "/gymkhana/elections", phase: "Phase 2" },
  { label: "Budgets", path: "/gymkhana/budgets", phase: "Phase 2" },
  { label: "Bills", path: "/gymkhana/bills", phase: "Phase 2" },
  { label: "Deactivation", path: "/gymkhana/deactivation", phase: "Phase 2" },
  { label: "Announcements", path: "/gymkhana/announcements", phase: "Phase 2" },
];

export default function GymkhanaHome() {
  const navigate = useNavigate();

  return (
    <Stack gap="md">
      <Title order={2}>Gymkhana Module</Title>
      <Text c="dimmed">Access all Gymkhana workflows from here.</Text>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
        {pages.map((page) => (
          <Paper key={page.path} withBorder radius="md" p="md" shadow="xs">
            <Stack gap="xs">
              <Text fw={600}>{page.label}</Text>
              <Text size="sm" c="dimmed">{page.phase}</Text>
              <Group justify="flex-end">
                <Button variant="light" onClick={() => navigate(page.path)}>
                  Open
                </Button>
              </Group>
            </Stack>
          </Paper>
        ))}
      </SimpleGrid>
    </Stack>
  );
}
