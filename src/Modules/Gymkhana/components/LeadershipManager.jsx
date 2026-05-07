import React, { useState } from "react";
import { Container, Title, Paper, Table, Select, Button, Group, Alert, Text } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { host } from "../../../routes/globalRoutes/index.jsx";
// In real use, these paths might differ slightly based on the actual Fusion structure

// Dummy mock data for students who can be appointed
const DUMMY_STUDENTS = [
  { value: "23BCS001", label: "Alice Smith (23BCS001)" },
  { value: "23BCS002", label: "Bob Johnson (23BCS002)" },
  { value: "23BCS003", label: "Charlie Brown (23BCS003)" },
  { value: "23BCS004", label: "Diana Prince (23BCS004)" }
];

export default function LeadershipManager({ activeRole }) {
  const [successMsg, setSuccessMsg] = useState("");
  const [clubsData, setClubsData] = useState([
    { id: 1, name: "BitByte", currentCoordinator: "23BCS001" },
    { id: 2, name: "Jazbaat", currentCoordinator: null },
    { id: 3, name: "Badminton Club", currentCoordinator: "23BCS002" }
  ]);
  const [selectedStudent, setSelectedStudent] = useState({});

  // Mock Mutation for updating leadership
  const assignMutation = useMutation({
    mutationFn: async ({ clubId, roleType, studentRoll }) => {
      // return axios.post(`${host}/gymkhana/api/assign_leadership/`, { clubId, roleType, studentRoll });
      return new Promise((resolve) => setTimeout(() => resolve({ data: "Success" }), 500));
    },
    onSuccess: (_, variables) => {
      setSuccessMsg(`Successfully assigned ${variables.studentRoll} as ${variables.roleType}!`);
      // Update local mock state for visual update
      setClubsData((prev) => 
        prev.map(c => c.id === variables.clubId ? { ...c, currentCoordinator: variables.studentRoll } : c)
      );
      setTimeout(() => setSuccessMsg(""), 3000);
    }
  });

  const handleAssign = (clubId, roleType) => {
    const studentRoll = selectedStudent[clubId];
    if (!studentRoll) return;
    assignMutation.mutate({ clubId, roleType, studentRoll });
  };

  if (!activeRole || !activeRole.toLowerCase().includes("counsellor")) {
    return <Alert color="red">Access Denied: Only Counsellors can manage club leadership.</Alert>;
  }

  return (
    <Container size="xl" mt="xl">
      <Title order={2} mb="lg">Leadership Management</Title>
      <Text mb="md">Assign Coordinators and Co-Coordinators to clubs under your domain.</Text>

      {successMsg && <Alert color="green" mb="md">{successMsg}</Alert>}

      <Paper shadow="sm" p="md" withBorder>
        <Table>
          <thead>
            <tr>
              <th>Club Name</th>
              <th>Current Coordinator</th>
              <th>Assign New Leader</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clubsData.map((club) => (
              <tr key={club.id}>
                <td>{club.name}</td>
                <td>{club.currentCoordinator || "None"}</td>
                <td>
                  <Select 
                    placeholder="Select Student Roll No"
                    data={DUMMY_STUDENTS}
                    value={selectedStudent[club.id] || null}
                    onChange={(val) => setSelectedStudent(prev => ({...prev, [club.id]: val}))}
                    searchable
                  />
                </td>
                <td>
                  <Group spacing="xs">
                    <Button 
                      size="xs" 
                      color="blue" 
                      onClick={() => handleAssign(club.id, "Coordinator")}
                      disabled={!selectedStudent[club.id]}
                    >
                      Set Coordinator
                    </Button>
                    <Button 
                      size="xs" 
                      color="cyan" 
                      onClick={() => handleAssign(club.id, "Co-Coordinator")}
                      disabled={!selectedStudent[club.id]}
                    >
                      Set Co-Coordinator
                    </Button>
                  </Group>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Paper>
    </Container>
  );
}
