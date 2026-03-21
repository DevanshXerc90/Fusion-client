import { Stack, Title } from "@mantine/core";
import AnnouncementForm from "./components/AnnouncementForm";
import AnnouncementTable from "./components/AnnouncementTable";

export default function Announcements() {
  return (
    <Stack gap="md">
      <Title order={2}>Gymkhana Announcements</Title>
      <AnnouncementForm />
      <AnnouncementTable />
    </Stack>
  );
}
