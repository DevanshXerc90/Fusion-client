import { Stack, Title } from "@mantine/core";
import BudgetForm from "./components/BudgetForm";
import BudgetTable from "./components/BudgetTable";

export default function Budgets() {
  return (
    <Stack gap="md">
      <Title order={2}>Gymkhana Budgets</Title>
      <BudgetForm />
      <BudgetTable />
    </Stack>
  );
}
