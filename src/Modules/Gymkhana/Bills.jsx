import { Stack, Title } from "@mantine/core";
import BillForm from "./components/BillForm";
import BillTable from "./components/BillTable";

export default function Bills() {
  return (
    <Stack gap="md">
      <Title order={2}>Gymkhana Bills</Title>
      <BillForm />
      <BillTable />
    </Stack>
  );
}
