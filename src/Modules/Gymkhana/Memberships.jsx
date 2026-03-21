import { Stack, Title } from "@mantine/core";
import MembershipForm from "./components/MembershipForm";
import MembershipTable from "./components/MembershipTable";

export default function Memberships() {
  return (
    <Stack gap="md">
      <Title order={2}>Gymkhana Memberships</Title>
      <MembershipForm />
      <MembershipTable />
    </Stack>
  );
}
