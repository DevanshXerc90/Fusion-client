import { Stack, Title } from "@mantine/core";
import BookingTable from "./components/BookingTable";
import BookingForm from "./components/BookingForm";

export default function Bookings() {
  return (
    <Stack gap="md">
      <Title order={2}>Gymkhana Bookings</Title>
      <BookingForm />
      <BookingTable />
    </Stack>
  );
}
