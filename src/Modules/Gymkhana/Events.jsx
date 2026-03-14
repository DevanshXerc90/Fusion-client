import EventTable from "./components/EventTable";
import EventForm from "./components/EventForm";

export default function Events() {
  return (
    <section style={{ padding: "1rem" }}>
      <h2>Gymkhana Events</h2>
      <EventForm />
      <EventTable />
    </section>
  );
}
