import ClubTable from "./components/ClubTable";
import ClubForm from "./components/ClubForm";

export default function Clubs() {
  return (
    <section style={{ padding: "1rem" }}>
      <h2>Gymkhana Clubs</h2>
      <ClubForm />
      <ClubTable />
    </section>
  );
}
