import { Stack, Title } from "@mantine/core";
import EventTable from "./components/EventTable";
import EventForm from "./components/EventForm";

export default function Events() {
  return (
    <Stack gap="md">
      <Title order={2}>Gymkhana Events</Title>
      <EventForm />
      <EventTable />
    </Stack>
  );
}
