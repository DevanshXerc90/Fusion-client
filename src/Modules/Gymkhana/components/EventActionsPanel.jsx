import { useState } from "react";
import {
  Box, Paper, Text, Button, Group, Badge, Stack, Modal, TextInput, Textarea, Divider,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { host } from "../../../routes/globalRoutes/index.jsx";

/**
 * Role-based Event Actions Panel
 * - Coordinator: Create Event + view own events
 * - FIC: Approve/Reject events with status "open"
 * - Counsellor: Approve/Reject events with status "fic_approved"
 * - Dean: Final Approve/Reject events with status "counsellor_approved"
 */
export default function EventActionsPanel({ userRole, events = [], token, onRefresh }) {
  const queryClient = useQueryClient();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    event_name: "", venue: "", incharge: "", date: "", start_time: "10:00", end_time: "17:00", details: "", club: "",
  });

  const role = (userRole || "").toLowerCase();

  const refreshAll = async () => {
    await queryClient.invalidateQueries({ queryKey: ["UpcomingEventsData"] });
    await queryClient.invalidateQueries({ queryKey: ["PastEventsData"] });
    if (onRefresh) await onRefresh();
  };

  // Filter events based on role
  const getActionableEvents = () => {
    if (role === "co-ordinator") return events.filter(e => e.status === "open");
    if (role === "fic") return events.filter(e => e.status === "open");
    if (role.includes("counsellor")) return events.filter(e => e.status === "fic_approved");
    if (role === "dean_s") return events.filter(e => e.status === "counsellor_approved");
    return [];
  };

  const actionableEvents = getActionableEvents();

  const handleApprove = async (eventId) => {
    let url = "";
    if (role === "fic") url = `${host}/gymkhana/api/fic_approve_event/`;
    else if (role.includes("counsellor")) url = `${host}/gymkhana/api/counsellor_approve_event/`;
    else if (role === "dean_s") url = `${host}/gymkhana/api/dean_approve_event/`;

    try {
      await axios.put(url, { id: eventId }, { headers: { Authorization: `Token ${token}` } });
      notifications.show({ title: "Approved", message: "Event approved successfully!", color: "green" });
      await refreshAll();
    } catch (err) {
      notifications.show({ title: "Error", message: err.response?.data?.error || "Approval failed", color: "red" });
    }
  };

  const handleReject = async (eventId) => {
    try {
      await axios.put(`${host}/gymkhana/api/reject_event/`, { id: eventId }, { headers: { Authorization: `Token ${token}` } });
      notifications.show({ title: "Rejected", message: "Event rejected.", color: "orange" });
      await refreshAll();
    } catch (err) {
      notifications.show({ title: "Error", message: err.response?.data?.error || "Rejection failed", color: "red" });
    }
  };

  const handleCreateEvent = async () => {
    try {
      await axios.post(`${host}/gymkhana/api/create_event/`, newEvent, { headers: { Authorization: `Token ${token}` } });
      notifications.show({ title: "Created", message: "Event created successfully!", color: "green" });
      setCreateModalOpen(false);
      setNewEvent({ event_name: "", venue: "", incharge: "", date: "", start_time: "10:00", end_time: "17:00", details: "", club: "" });
      await refreshAll();
    } catch (err) {
      notifications.show({ title: "Error", message: err.response?.data?.error || "Creation failed", color: "red" });
    }
  };

  const getRoleBadge = () => {
    const colors = { "co-ordinator": "blue", "fic": "violet", "dean_s": "green" };
    const labels = { "co-ordinator": "Coordinator", "fic": "Faculty In-Charge", "dean_s": "Dean (Students)" };
    if (role.includes("counsellor")) return <Badge color="teal" size="lg">Counsellor</Badge>;
    return <Badge color={colors[role] || "gray"} size="lg">{labels[role] || userRole || "Student"}</Badge>;
  };

  const getApproveLabel = () => {
    if (role === "fic") return "FIC Approve";
    if (role.includes("counsellor")) return "Counsellor Approve";
    if (role === "dean_s") return "Final Approve (Dean)";
    return "Approve";
  };

  const getPendingLabel = () => {
    if (role === "fic") return 'Pending FIC Approval (status: "open")';
    if (role.includes("counsellor")) return 'Pending Counsellor Approval (status: "fic_approved")';
    if (role === "dean_s") return 'Pending Dean Approval (status: "counsellor_approved")';
    if (role === "co-ordinator") return 'Your Events (status: "open")';
    return "Events";
  };

  // Student role — read only
  if (role === "student" || role === "") {
    return (
      <Paper shadow="sm" p="md" mt="lg" withBorder>
        <Group>{getRoleBadge()}<Text weight={700}>View Only</Text></Group>
        <Text size="sm" color="dimmed" mt="xs">Students can view events but cannot create or approve them.</Text>
      </Paper>
    );
  }

  return (
    <Paper shadow="sm" p="md" mt="lg" withBorder>
      <Group justify="space-between" mb="md">
        <Group>{getRoleBadge()}<Text weight={700} size="lg">Event Actions</Text></Group>
        {role === "co-ordinator" && (
          <Button color="blue" onClick={() => setCreateModalOpen(true)}>
            + Create New Event
          </Button>
        )}
      </Group>

      <Divider mb="md" />
      <Text size="sm" color="dimmed" mb="sm">{getPendingLabel()}</Text>

      {actionableEvents.length === 0 ? (
        <Text size="sm" color="dimmed" style={{ fontStyle: "italic" }}>No events pending your action.</Text>
      ) : (
        <Stack gap="sm">
          {actionableEvents.map((event) => (
            <Paper key={event.id} shadow="xs" p="sm" withBorder style={{ borderLeft: "4px solid #228be6" }}>
              <Group justify="space-between">
                <Box>
                  <Text weight={600}>{event.event_name}</Text>
                  <Text size="xs" color="dimmed">{event.club} • {event.venue} • {event.date}</Text>
                  <Badge size="xs" color="yellow" mt={4}>{event.status}</Badge>
                </Box>
                <Group>
                  {role !== "co-ordinator" && (
                    <>
                      <Button size="xs" color="green" onClick={() => handleApprove(event.id)}>
                        {getApproveLabel()}
                      </Button>
                      <Button size="xs" color="red" variant="outline" onClick={() => handleReject(event.id)}>
                        Reject
                      </Button>
                    </>
                  )}
                  {role === "co-ordinator" && (
                    <Badge color="blue">Awaiting FIC Review</Badge>
                  )}
                </Group>
              </Group>
            </Paper>
          ))}
        </Stack>
      )}

      {/* Create Event Modal */}
      <Modal opened={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Create New Event" size="lg">
        <Stack>
          <TextInput label="Event Name" required value={newEvent.event_name} onChange={(e) => setNewEvent({ ...newEvent, event_name: e.target.value })} />
          <TextInput label="Club Name" required value={newEvent.club} onChange={(e) => setNewEvent({ ...newEvent, club: e.target.value })} placeholder="e.g. The Programming Club" />
          <TextInput label="Venue" required value={newEvent.venue} onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })} />
          <TextInput label="In-Charge" required value={newEvent.incharge} onChange={(e) => setNewEvent({ ...newEvent, incharge: e.target.value })} />
          <TextInput label="Date" type="date" required
            value={newEvent.date}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
          />
          <Group grow>
            <TextInput label="Start Time" type="time" value={newEvent.start_time} onChange={(e) => setNewEvent({ ...newEvent, start_time: e.target.value })} />
            <TextInput label="End Time" type="time" value={newEvent.end_time} onChange={(e) => setNewEvent({ ...newEvent, end_time: e.target.value })} />
          </Group>
          <Textarea label="Details" value={newEvent.details} onChange={(e) => setNewEvent({ ...newEvent, details: e.target.value })} />
          <Button fullWidth color="blue" onClick={handleCreateEvent}>Submit Event</Button>
        </Stack>
      </Modal>
    </Paper>
  );
}
