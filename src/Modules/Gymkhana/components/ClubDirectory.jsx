import React from "react";
import { SimpleGrid, Paper, Group, Box, Text, Badge, Button } from "@mantine/core";

// Mock data to replace the 1400 line hardcoded list
const clubsData = {
  "Science & Technology": [
    { name: "The Programming Club", id: "BitByte", logo: "https://img.icons8.com/color/96/programming.png", desc: "The byte-sized problem solvers! We host weekly coding contests..." },
    { name: "Business & Management Club", id: "Business", logo: "https://img.icons8.com/color/96/business.png", desc: "Future CEOs in the making!" },
    { name: "Astronomy & Physics Society", id: "Astronomy", logo: "https://img.icons8.com/color/96/telescope.png", desc: "Exploring the universe one star at a time." },
    { name: "Aero Fabrication Club", id: "AFC", logo: "https://img.icons8.com/color/96/airplane.png", desc: "Building the future of flight." },
    { name: "Robotics Club", id: "Robotics", logo: "https://img.icons8.com/color/96/robot-2.png", desc: "Where machines come to life!" },
    { name: "Racing Club", id: "Racing", logo: "https://cdn-icons-png.flaticon.com/512/2583/2583344.png", desc: "Engineering speed demons!" }
  ],
  "Cultural": [
    { name: "Saaz", id: "Saaz", badge: "Music", color: "blue", logo: "https://img.icons8.com/color/96/music.png", desc: "The melody makers of campus!" },
    { name: "Jazbaat", id: "Jazbaat", badge: "Dramatics", color: "red", logo: "https://img.icons8.com/color/96/drama.png", desc: "Where stories come alive!" },
    { name: "Aavartan", id: "Aavartan", badge: "Dance", color: "violet", logo: "https://img.icons8.com/color/96/dancing-party.png", desc: "From Kathak to hip-hop." },
    { name: "Samvaad", id: "Samvaad", badge: "Literary", color: "orange", logo: "https://img.icons8.com/color/96/literature.png", desc: "Hosts poetry slams and debate competitions." },
    { name: "ShutterBox", id: "ShutterBox", badge: "Photography", color: "grape", logo: "https://img.icons8.com/color/96/compact-camera.png", desc: "From DSLR workshops to short films." },
    { name: "Abhivyakti", id: "Abhivyakti", badge: "Art & Craft", color: "green", logo: "https://img.icons8.com/color/96/paint-palette.png", desc: "Weekly pottery and sketching sessions." }
  ],
  "Sports": [
    { name: "Cricket", id: "Cricket", logo: "https://img.icons8.com/color/96/cricket.png", desc: "The willow warriors!" },
    { name: "Athletics", id: "Athletics", logo: "https://img.icons8.com/color/96/sprint.png", desc: "Speed, strength and stamina!" },
    { name: "Badminton", id: "Badminton Club", logo: "https://img.icons8.com/color/96/badminton.png", desc: "6 wood-floor courts." },
    { name: "Basketball", id: "Basketball", logo: "https://img.icons8.com/color/96/basketball.png", desc: "Floodlit courts with NBA-standard flooring." },
    { name: "Lawn Tennis", id: "Lawn Tennis", logo: "https://img.icons8.com/color/96/tennis.png", desc: "Clay and grass courts available." },
    { name: "Table Tennis", id: "Table Tennis", logo: "https://img.icons8.com/color/96/ping-pong.png", desc: "8 professional tables." },
    { name: "Football", id: "Football", logo: "https://img.icons8.com/color/96/soccer.png", desc: "FIFA-standard turf with floodlights." },
    { name: "Volleyball", id: "Volleyball Club", logo: "https://img.icons8.com/color/96/volleyball.png", desc: "4 professional courts (2 indoor)." },
    { name: "Kabaddi", id: "Kabaddi", logo: "https://img.icons8.com/color/96/kabaddi.png", desc: "National-level players." }
  ]
};

const categoryColors = {
  "Science & Technology": "#e67700",
  "Cultural": "#228be6",
  "Sports": "#40c057"
};

export default function ClubDirectory({ onSelectClub, onApplyMembership, activeRole }) {
  return (
    <Box>
      {Object.entries(clubsData).map(([category, clubs]) => (
        <Box key={category} mb="xl">
          <Box mb="xl" px="sm">
            <h2 style={{ borderBottom: `2px solid ${categoryColors[category]}`, paddingBottom: "8px" }}>
              {category} Clubs
            </h2>
          </Box>
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
            {clubs.map((club) => (
              <Paper
                key={club.name}
                withBorder
                p="lg"
                shadow="sm"
                style={{ height: 220, display: "flex", flexDirection: "column" }}
              >
                <Group position="apart" noWrap align="flex-start">
                  <Group spacing="xs" align="center">
                    <Text size="xl" fw={700}>{club.name}</Text>
                    {club.badge && <Badge color={club.color} variant="light">{club.badge}</Badge>}
                  </Group>
                  <Box style={{ width: 30, height: 30 }}>
                    <img src={club.logo} alt={club.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                  </Box>
                </Group>
                <Box style={{ flex: 1, overflowY: "auto", marginTop: 16, paddingRight: 8 }}>
                  <Text size="sm">{club.desc}</Text>
                </Box>
                <Group position="apart" mt="sm">
                  <Button variant="light" size="xs" onClick={() => onSelectClub(club.id)}>
                    View Details
                  </Button>
                  {(activeRole === "student" || activeRole === "Student") && (
                    <Button variant="filled" size="xs" color="blue" onClick={() => onApplyMembership(club.id)}>
                      Apply
                    </Button>
                  )}
                </Group>
              </Paper>
            ))}
          </SimpleGrid>
        </Box>
      ))}
    </Box>
  );
}
