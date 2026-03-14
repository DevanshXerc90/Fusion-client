import BookingTable from "./components/BookingTable";
import BookingForm from "./components/BookingForm";

export default function Bookings() {
  return (
    <section style={{ padding: "1rem" }}>
      <h2>Gymkhana Bookings</h2>
      <BookingForm />
      <BookingTable />
    </section>
  );
}
