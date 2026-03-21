import { Stack, Title } from "@mantine/core";
import ElectionForm from "./components/ElectionForm";
import ElectionTable from "./components/ElectionTable";

export default function Elections() {
  return (
    <Stack gap="md">
      <Title order={2}>Gymkhana Elections</Title>
      <ElectionForm />
      <ElectionTable />
    </Stack>
  );
}
