import React, { useState } from "react";
import { Container, Title, TextInput, Textarea, Select, Button, Paper, Group, Alert, Table, Badge, ActionIcon, Tooltip } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconCheck, IconX } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";

const mockProposals = [
  { id: 1, name: "AI Research Club", category: "Technical", objectives: "To study LLMs", status: "COUNSELLOR_PENDING" },
  { id: 2, name: "Origami Club", category: "Cultural", objectives: "Paper folding art", status: "DEAN_PENDING" }
];

export default function NewClubProposal({ activeRole }) {
  const [proposals, setProposals] = useState(mockProposals);
  
  const form = useForm({
    initialValues: {
      clubName: "",
      category: "",
      objectives: "",
      activityPlan: ""
    },
    validate: {
      clubName: (val) => (val.length < 3 ? "Club name too short" : null),
      category: (val) => (!val ? "Select a category" : null),
      objectives: (val) => (val.length < 10 ? "Detail the objectives more" : null)
    }
  });

  const handleSubmit = (values) => {
    // Check BR-GM-002: Unique Name
    if (proposals.some(p => p.name.toLowerCase() === values.clubName.toLowerCase())) {
       form.setFieldError("clubName", "Club name already exists or is pending");
       return;
    }
    
    // Simulate Backend Save
    setProposals([...proposals, { 
      id: Math.random(), 
      name: values.clubName, 
      category: values.category, 
      objectives: values.objectives, 
      status: "COUNSELLOR_PENDING" 
    }]);

    notifications.show({ title: "Success", message: "Club Proposal Submitted", color: "green" });
    form.reset();
  };

  const handleAction = (id, newStatus, message) => {
    setProposals(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
    notifications.show({ title: "Action Successful", message, color: "blue" });
  };

  const isStudent = !activeRole || activeRole.toLowerCase() === "student";
  const isCounsellor = activeRole?.toLowerCase().includes("counsellor");
  const isDean = activeRole?.toLowerCase() === "dean_s";

  return (
    <Container size="xl" mt="xl">
      <Title order={2} mb="lg">New Club Proposals</Title>

      {isStudent && (
        <Paper shadow="sm" p="xl" withBorder mb="xl">
          <Title order={4} mb="md">Propose a New Club</Title>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <TextInput label="Club Name" placeholder="Unique Club Name" withAsterisk {...form.getInputProps("clubName")} mb="md" />
            <Select 
              label="Category" 
              placeholder="Select Category" 
              data={["Technical", "Cultural", "Sports"]} 
              withAsterisk 
              {...form.getInputProps("category")} 
              mb="md"
            />
            <Textarea label="Objectives" placeholder="What are the main goals?" minRows={3} withAsterisk {...form.getInputProps("objectives")} mb="md" />
            <Textarea label="Initial Activity Plan" placeholder="What will the club do in its first 3 months?" minRows={3} {...form.getInputProps("activityPlan")} mb="md" />
            
            <Button type="submit" color="blue">Submit Proposal</Button>
          </form>
        </Paper>
      )}

      {(isCounsellor || isDean || isStudent) && (
        <Paper shadow="sm" p="md" withBorder>
          <Title order={4} mb="md">Pending & Past Proposals</Title>
          <Table>
            <thead>
              <tr>
                <th>Club Name</th>
                <th>Category</th>
                <th>Objectives</th>
                <th>Status</th>
                {(isCounsellor || isDean) && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {proposals.map(proposal => (
                <tr key={proposal.id}>
                  <td>{proposal.name}</td>
                  <td>{proposal.category}</td>
                  <td>{proposal.objectives}</td>
                  <td>
                    <Badge color={
                      proposal.status === "APPROVED" ? "green" : 
                      proposal.status === "REJECTED" ? "red" : "yellow"
                    }>
                      {proposal.status.replace("_", " ")}
                    </Badge>
                  </td>
                  {(isCounsellor || isDean) && (
                    <td>
                      <Group spacing="xs">
                        {isCounsellor && proposal.status === "COUNSELLOR_PENDING" && (
                          <>
                            <Tooltip label="Approve & Forward to Dean">
                              <ActionIcon color="green" onClick={() => handleAction(proposal.id, "DEAN_PENDING", "Forwarded to Dean")}>
                                <IconCheck />
                              </ActionIcon>
                            </Tooltip>
                            <Tooltip label="Reject">
                              <ActionIcon color="red" onClick={() => handleAction(proposal.id, "REJECTED", "Proposal Rejected")}>
                                <IconX />
                              </ActionIcon>
                            </Tooltip>
                          </>
                        )}
                        {isDean && proposal.status === "DEAN_PENDING" && (
                          <>
                            <Tooltip label="Final Approval (Create Club)">
                              <ActionIcon color="green" onClick={() => handleAction(proposal.id, "APPROVED", "Club Officially Created")}>
                                <IconCheck />
                              </ActionIcon>
                            </Tooltip>
                            <Tooltip label="Reject">
                              <ActionIcon color="red" onClick={() => handleAction(proposal.id, "REJECTED", "Proposal Rejected")}>
                                <IconX />
                              </ActionIcon>
                            </Tooltip>
                          </>
                        )}
                      </Group>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </Table>
        </Paper>
      )}
    </Container>
  );
}
