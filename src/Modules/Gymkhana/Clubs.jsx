import { Stack, Title } from "@mantine/core";
import ClubTable from "./components/ClubTable";
import ClubForm from "./components/ClubForm";

export default function Clubs() {
  return (
    <Stack gap="md">
      <Title order={2}>Gymkhana Clubs</Title>
      <ClubForm />
      <ClubTable />
    </Stack>
  );
}
