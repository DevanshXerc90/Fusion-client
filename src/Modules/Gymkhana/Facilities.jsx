import { Stack, Title } from "@mantine/core";
import FacilityTable from "./components/FacilityTable";
import FacilityForm from "./components/FacilityForm";

export default function Facilities() {
  return (
    <Stack gap="md">
      <Title order={2}>Gymkhana Facilities</Title>
      <FacilityForm />
      <FacilityTable />
    </Stack>
  );
}
