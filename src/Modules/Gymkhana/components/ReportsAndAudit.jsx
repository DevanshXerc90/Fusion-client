import React from "react";
import { Container, Title, Paper, Table, Text, Badge, Select, Grid } from "@mantine/core";

const mockAuditLogs = [
  { id: 1, action: "Budget Approved by Dean", user: "Dr. Sharma", role: "Dean_s", timestamp: "2026-04-18 10:30 AM" },
  { id: 2, action: "Inventory Request Approved", user: "Dr. Singh", role: "FIC", timestamp: "2026-04-17 02:15 PM" },
  { id: 3, action: "New Club 'AI Club' Proposed", user: "Rahul", role: "Student", timestamp: "2026-04-16 09:00 AM" },
  { id: 4, action: "Coordinator Assigned to BitByte", user: "Dr. Verma", role: "Tech_Counsellor", timestamp: "2026-04-15 11:45 AM" }
];

export default function ReportsAndAudit({ activeRole }) {
  if (activeRole !== "Dean_s" && !activeRole?.includes("Counsellor")) {
    return (
      <Container mt="xl">
        <Title order={2} color="red">Access Denied</Title>
        <Text>You do not have permission to view Audit Reports.</Text>
      </Container>
    );
  }

  return (
    <Container size="xl" mt="xl">
      <Title order={2} mb="lg">System Audit & Reports</Title>

      <Grid mb="xl">
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Paper shadow="sm" p="lg" withBorder style={{ textAlign: "center" }}>
            <Title order={3}>15</Title>
            <Text color="dimmed">Active Clubs</Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Paper shadow="sm" p="lg" withBorder style={{ textAlign: "center" }}>
            <Title order={3}>124</Title>
            <Text color="dimmed">Total Members</Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Paper shadow="sm" p="lg" withBorder style={{ textAlign: "center" }}>
            <Title order={3}>₹ 1.2M</Title>
            <Text color="dimmed">Total Budget Utilized</Text>
          </Paper>
        </Grid.Col>
      </Grid>

      <Paper shadow="sm" p="md" withBorder>
        <Grid align="center" mb="md">
          <Grid.Col span={8}>
            <Title order={4}>Activity Audit Trail</Title>
          </Grid.Col>
          <Grid.Col span={4}>
            <Select placeholder="Filter by Role" data={["All", "Dean_s", "FIC", "Counsellor", "Student"]} defaultValue="All" />
          </Grid.Col>
        </Grid>
        
        <Table striped highlightOnHover>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Action Completed</th>
              <th>System User</th>
              <th>Role Executed As</th>
            </tr>
          </thead>
          <tbody>
            {mockAuditLogs.map(log => (
              <tr key={log.id}>
                <td><Text size="sm">{log.timestamp}</Text></td>
                <td>{log.action}</td>
                <td>{log.user}</td>
                <td><Badge color="grape">{log.role}</Badge></td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Paper>
    </Container>
  );
}
