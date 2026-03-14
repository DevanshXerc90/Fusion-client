import FacilityTable from "./components/FacilityTable";
import FacilityForm from "./components/FacilityForm";

export default function Facilities() {
  return (
    <section style={{ padding: "1rem" }}>
      <h2>Gymkhana Facilities</h2>
      <FacilityForm />
      <FacilityTable />
    </section>
  );
}
