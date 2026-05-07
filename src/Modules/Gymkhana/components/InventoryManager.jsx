import React, { useState } from "react";
import { Container, Title, TextInput, NumberInput, Textarea, Button, Paper, Group, Table, Badge, ActionIcon, Tooltip, Tabs } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconCheck, IconX } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";

const mockRequests = [
  { id: 1, itemName: "Arduino Kits", qty: 5, justify: "For upcoming workshop", cost: 15000, status: "FIC_PENDING" },
  { id: 2, itemName: "Badminton Nets", qty: 2, justify: "Old ones torn", cost: 4000, status: "COUNSELLOR_PENDING" },
  { id: 3, itemName: "Guitars", qty: 3, justify: "Saaz performance", cost: 25000, status: "DEAN_PENDING" }
];

const mockInventory = [
  { id: 101, item: "Projector", qty: 1, status: "Available" },
  { id: 102, item: "Cricket Bats", qty: 5, status: "In Use" },
  { id: 103, item: "Soldering Station", qty: 2, status: "Damaged" }
];

export default function InventoryManager({ activeRole }) {
  const [requests, setRequests] = useState(mockRequests);
  const [inventory, setInventory] = useState(mockInventory);
  const [activeTab, setActiveTab] = useState("requests");
  
  const form = useForm({
    initialValues: {
      itemName: "",
      qty: 1,
      justify: "",
      cost: 0
    },
    validate: {
      itemName: (val) => (!val ? "Item name required" : null),
      qty: (val) => (val <= 0 ? "Quantity must be > 0" : null),
      cost: (val) => (val < 0 ? "Cost cannot be negative" : null)
    }
  });

  const handleSubmit = (values) => {
    setRequests([...requests, { 
      id: Math.random(), 
      ...values, 
      status: "FIC_PENDING" 
    }]);

    notifications.show({ title: "Request Sent", message: "Inventory request submitted successfully.", color: "green" });
    form.reset();
  };

  const handleAction = (id, newStatus, message) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    notifications.show({ title: "Action Successful", message, color: "blue" });

    // If final approval, add to inventory register
    if (newStatus === "APPROVED") {
      const item = requests.find(r => r.id === id);
      if (item) {
        setInventory(prev => [...prev, { id: Math.random(), item: item.itemName, qty: item.qty, status: "Available" }]);
      }
    }
  };

  const isCoordinator = activeRole?.toLowerCase() === "co-ordinator";
  const isFIC = activeRole?.toLowerCase() === "fic";
  const isCounsellor = activeRole?.toLowerCase().includes("counsellor");
  const isDean = activeRole?.toLowerCase() === "dean_s";

  return (
    <Container size="xl" mt="xl">
      <Title order={2} mb="lg">Inventory Management</Title>

      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List mb="md">
          <Tabs.Tab value="requests">Inventory Requests</Tabs.Tab>
          <Tabs.Tab value="register">Club Inventory Register</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="requests">
          {isCoordinator && (
            <Paper shadow="sm" p="xl" withBorder mb="xl">
              <Title order={4} mb="md">Request New Inventory</Title>
              <form onSubmit={form.onSubmit(handleSubmit)}>
                <Group grow mb="md">
                  <TextInput label="Item Name" placeholder="e.g. Arduino Uno" withAsterisk {...form.getInputProps("itemName")} />
                  <NumberInput label="Quantity" min={1} withAsterisk {...form.getInputProps("qty")} />
                  <NumberInput label="Estimated Cost (INR)" min={0} withAsterisk {...form.getInputProps("cost")} />
                </Group>
                <Textarea label="Justification" placeholder="Why is this needed?" minRows={2} withAsterisk {...form.getInputProps("justify")} mb="md" />
                
                <Button type="submit" color="blue">Submit Request</Button>
              </form>
            </Paper>
          )}

          <Paper shadow="sm" p="md" withBorder>
            <Title order={4} mb="md">Pending & Past Requests</Title>
            <Table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Cost</th>
                  <th>Justification</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map(req => (
                  <tr key={req.id}>
                    <td>{req.itemName}</td>
                    <td>{req.qty}</td>
                    <td>₹{req.cost}</td>
                    <td>{req.justify}</td>
                    <td>
                      <Badge color={req.status === "APPROVED" ? "green" : req.status === "REJECTED" ? "red" : "yellow"}>
                        {req.status.replace("_", " ")}
                      </Badge>
                    </td>
                    <td>
                      <Group spacing="xs">
                        {isFIC && req.status === "FIC_PENDING" && (
                          <>
                            <Tooltip label="Approve & Forward to Counsellor">
                              <ActionIcon color="green" onClick={() => handleAction(req.id, "COUNSELLOR_PENDING", "Forwarded to Counsellor")}>
                                <IconCheck />
                              </ActionIcon>
                            </Tooltip>
                            <Tooltip label="Return to Coordinator">
                              <ActionIcon color="red" onClick={() => handleAction(req.id, "REJECTED", "Request Returned")}>
                                <IconX />
                              </ActionIcon>
                            </Tooltip>
                          </>
                        )}
                        {isCounsellor && req.status === "COUNSELLOR_PENDING" && (
                          <>
                            <Tooltip label="Approve & Forward to Dean">
                              <ActionIcon color="green" onClick={() => handleAction(req.id, "DEAN_PENDING", "Forwarded to Dean")}>
                                <IconCheck />
                              </ActionIcon>
                            </Tooltip>
                            <Tooltip label="Return to FIC">
                              <ActionIcon color="red" onClick={() => handleAction(req.id, "FIC_PENDING", "Returned to FIC")}>
                                <IconX />
                              </ActionIcon>
                            </Tooltip>
                          </>
                        )}
                        {isDean && req.status === "DEAN_PENDING" && (
                          <>
                            <Tooltip label="Final Approval">
                              <ActionIcon color="green" onClick={() => handleAction(req.id, "APPROVED", "Inventory Approved")}>
                                <IconCheck />
                              </ActionIcon>
                            </Tooltip>
                            <Tooltip label="Reject">
                              <ActionIcon color="red" onClick={() => handleAction(req.id, "REJECTED", "Inventory Denied")}>
                                <IconX />
                              </ActionIcon>
                            </Tooltip>
                          </>
                        )}
                      </Group>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="register">
          <Paper shadow="sm" p="md" withBorder>
            <Table>
              <thead>
                <tr>
                  <th>Item ID</th>
                  <th>Item Name</th>
                  <th>Quantity</th>
                  <th>Condition/Status</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map(item => (
                  <tr key={item.id}>
                    <td>#{item.id}</td>
                    <td>{item.item}</td>
                    <td>{item.qty}</td>
                    <td>
                      <Badge color={item.status === "Available" ? "green" : item.status === "In Use" ? "blue" : "red"}>
                         {item.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Paper>
        </Tabs.Panel>
      </Tabs>

    </Container>
  );
}
