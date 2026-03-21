import { Stack, Title } from "@mantine/core";
import DeactivationForm from "./components/DeactivationForm";
import DeactivationTable from "./components/DeactivationTable";

export default function Deactivation() {
  return (
    <Stack gap="md">
      <Title order={2}>Gymkhana Club Deactivation</Title>
      <DeactivationForm />
      <DeactivationTable />
    </Stack>
  );
}
