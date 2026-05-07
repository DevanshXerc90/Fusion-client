import { useState, Suspense, lazy, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Paper,
  Select,
  Group,
  Text,
  Badge,
  SimpleGrid,
  Card,
  Modal,
  Button,
  Alert,
  TextInput,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconSearch } from "@tabler/icons-react";
import dayjs from "dayjs";
import { useMediaQuery } from "@mantine/hooks";
import ModuleTabs from "../../components/moduleTabs";
import ClubDirectory from "./components/ClubDirectory";
import CoordinatorMembersWithProviders from "./CoordinatorMembersTable";
import LeadershipManager from "./components/LeadershipManager";
import NewClubProposal from "./components/NewClubProposal";
import InventoryManager from "./components/InventoryManager";
import BudgetApprovals from "./BudgetApprovalTable";
import EventActionsPanel from "./components/EventActionsPanel";
import ReportsAndAudit from "./components/ReportsAndAudit";

import { setActiveTab_ } from "../../redux/moduleslice";

import ClubFilter from "./calender/ClubFilter";
import DateSelector from "./calender/DateSelector";
import EventCalendar from "./calender/EventCalender";
import EventCard from "./calender/EventCard";

import {
  useGetClubMembers,
  useGetData,
  useGetPastEvents,
  useGetUpcomingEvents,
  useGetClubAcheivement,
  useGetFests,
} from "./BackendLogic/ApiRoutes";

const CustomTable = lazy(() => import("./CustomTable"));
const ClubViewComponent = lazy(() => import("./ClubViewComponent"));

function GymkhanaDashboard() {
  const isMobile = useMediaQuery(`(max-width: 750px)`);
  const token = localStorage.getItem("authToken");
  const reduxUserRole = useSelector((state) => state.user?.role);
  const [overrideRole, setOverrideRole] = useState(null);
  const userRole = overrideRole || reduxUserRole;
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("0");
  const [value, setValue] = useState("Select a Club");
  const [searchInput, setSearchInput] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedClub, setSelectedClub] = useState("All Clubs");
  const getTabsForRole = (role) => {
    const baseTabs = [
      { title: "Clubs" },
      { title: "Calendar" },
      { title: "Fests" },
      { title: "Events" },
    ];
    const lowerRole = role ? role.toLowerCase() : "";
    if (lowerRole === "co-ordinator") {
      baseTabs.push({ title: "My Club Admin" }, { title: "Finance" }, { title: "Inventory" });
    }
    if (lowerRole === "fic" || lowerRole.includes("counsellor") || lowerRole === "dean_s") {
      baseTabs.push({ title: "Administration" }, { title: "Finance" }, { title: "Inventory" }, { title: "Reports & Audit" });
    }
    return baseTabs;
  };
  const tabs = getTabsForRole(userRole);
  useEffect(() => {
    if (Number(activeTab) >= tabs.length) setActiveTab("0");
  }, [userRole, activeTab, tabs.length]);
  const badges = []; // Add badge data if needed
  const [opened, setOpened] = useState(false);
  const [selectedFest, setSelectedFest] = useState(null);

  const openModal = (fest) => {
    setSelectedFest(fest);
    setOpened(true);
  };

  const { data: upcomingEvents, refetch: refetchUpcoming } = useGetUpcomingEvents(token);
  const { data: pastEvents } = useGetPastEvents(token);
  console.log(pastEvents);
  const { data: fests } = useGetFests(token);
  const { data: clubMembers, refetch: refetchClubMembers } = useGetClubMembers(
    value,
    token,
  );
  const { data: clubDetails, refetch: refetchClubDetail, isError: isClubError, error: clubError } = useGetData(
    value,
    token,
  );
  const { data: Acheivements, refetch: refetchAcheivements } =
    useGetClubAcheivement(value, token);
  // Use useEffect to refetch data when `value` (selected club) changes
  useEffect(() => {
    if (value && value !== "Select a Club") {
      refetchClubMembers(); // Trigger refetch of club members
      refetchClubDetail();
      refetchAcheivements(); // Trigger refetch of club details
    }
  }, [value, refetchClubMembers, refetchClubDetail]);
  // Error Handling Demo: show notification when club not found
  useEffect(() => {
    if (isClubError && value !== "Select a Club") {
      notifications.show({
        title: "Error: Club Not Found",
        message: `The club "${value}" does not exist in the database. This error was handled gracefully.`,
        color: "red",
        autoClose: 5000,
      });
    }
  }, [isClubError, value]);
  return (
    <>
      <ModuleTabs
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(String(tab));
          dispatch(setActiveTab_(tabs[tab].title)); // Dispatch the Redux action if necessary
        }}
        badges={badges}
      />
      {activeTab === "0" && (
        <Box
          mt={{ base: "5px", sm: "30px" }}
          mx={{ base: "5px", sm: "30px" }}
          px={{ base: "5px", sm: "30px" }}
          mb={{ base: "xs", sm: "30px" }}
          w="90vw"
        >
          <Group justify="end" mb="5px" mr="110px">
            <TextInput
              placeholder="Type a club name and press Search..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.currentTarget.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && searchInput.trim()) setValue(searchInput.trim()); }}
              w="300px"
              rightSection={
                <IconSearch
                  size={18}
                  style={{ cursor: "pointer" }}
                  onClick={() => { if (searchInput.trim()) setValue(searchInput.trim()); }}
                />
              }
            />
            <Button
              onClick={() => { if (searchInput.trim()) setValue(searchInput.trim()); }}
              size="sm"
            >
              Search
            </Button>
          </Group>
          {value === "Select a Club" ? (
            <Paper
              shadow="md"
              p="xl"
              style={{
                height: "80vh",
                overflow: "auto",
                width: "100%",
                maxWidth: "1200px",
                margin: "10px auto",
              }}
            >
              {/* Role Switcher for Dev purposes ONLY */}
              <Box mb="md" p="sm" style={{ border: "1px dashed red" }}>
                <Text size="sm" weight={700} color="red">Dev Role Switcher (Current: {userRole || "None"})</Text>
                <Group>
                  <Button size="xs" onClick={() => setOverrideRole("student")}>Student</Button>
                  <Button size="xs" onClick={() => setOverrideRole("co-ordinator")}>Coordinator</Button>
                  <Button size="xs" onClick={() => setOverrideRole("FIC")}>FIC</Button>
                  <Button size="xs" onClick={() => setOverrideRole("Tech_Counsellor")}>Counsellor (Tech)</Button>
                  <Button size="xs" onClick={() => setOverrideRole("Dean_s")}>Dean</Button>
                  <Button size="xs" color="red" onClick={() => setOverrideRole(null)}>Reset to Redux</Button>
                </Group>
              </Box>

              <ClubDirectory
                activeRole={userRole}
                onSelectClub={(id) => setValue(id)}
                onApplyMembership={(id) => {
                  import('@mantine/notifications').then(({ notifications }) => {
                    notifications.show({ title: "Applied", message: "Application sent for " + id, color: "green" });
                  });
                }}
              />
            </Paper>
          ) : isClubError ? (
            <Paper shadow="md" p="xl" style={{ maxWidth: "800px", margin: "20px auto", textAlign: "center" }}>
              <Alert title="Club Not Found" color="red" variant="filled" mb="md">
                The club "{value}" does not exist in the database. This error was caught and handled gracefully by the frontend.
              </Alert>
              <Text size="sm" color="dimmed" mb="md">
                Backend returned: 404 — {"{"}"error": "Club not found"{"}"}
              </Text>
              <Button color="blue" onClick={() => { setValue("Select a Club"); setSearchInput(""); }}>
                ← Back to Club Directory
              </Button>
            </Paper>
          ) : (
            <Suspense fallback={<div>Loading .......</div>}>
              {upcomingEvents && Acheivements && clubMembers && (
                <ClubViewComponent
                  AboutClub={clubDetails?.description}
                  clubName={value}
                  membersData={clubMembers}
                  achievementsData={Acheivements}
                  eventsData={[...upcomingEvents, ...pastEvents]
                    .filter((item) => {
                      if (item.club === value && item.status === "ACCEPT")
                        return true;
                      return false;
                    })
                    .sort((a, b) => new Date(a.date) < new Date(b.date))}
                  membersColumns={[
                    {
                      accessorKey: "club", // Key in your data object
                      header: "Club", // Column header name
                    },
                    { accessorKey: "description", header: "Description" },

                    { accessorKey: "member", header: "Member" },
                    { accessorKey: "remarks", header: "Remarks" },
                    { accessorKey: "status", header: "Status" },
                  ]}
                  achievementsColumns={[
                    { accessorKey: "title", header: "Title" },
                    { accessorKey: "achievement", header: "Acheivement" },
                  ]}
                  eventsColumns={[
                    { accessorKey: "club", header: "Club" },
                    { accessorKey: "event_name", header: "Event Name" },
                    { accessorKey: "incharge", header: "Incharge" },
                    { accessorKey: "venue", header: "Venue" },
                    {
                      accessorKey: "date",
                      header: "Date",
                      render: (data) =>
                        new Date(data.date).toLocaleDateString(), // optional formatting
                    },
                    {
                      accessorKey: "start_time",
                      header: "Start Time",
                      render: (data) => data.start_time.substring(0, 5), // optional formatting (HH:MM)
                    },

                    { accessorKey: "details", header: "Details" },
                  ]}
                />
              )}
            </Suspense>
          )}
        </Box>
      )}
      {activeTab === "1" && (
        <Box>
          {pastEvents && upcomingEvents && (
            <Box
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                height: "100%",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              {/* Left Section */}
              <Box
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: "50px",
                  paddingTop: "35px",
                  boxSizing: "border-box",
                }}
              >
                <DateSelector
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                />
                <EventCard
                  events={[...pastEvents, ...upcomingEvents]
                    .filter((event) =>
                      dayjs(event.date).isSame(selectedDate, "day"),
                    )
                    .filter((event) => {
                      if (event.status === "ACCEPT") return true;
                      return false;
                    })}
                />
              </Box>

              {/* Right Section */}
              <Box
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  boxSizing: "border-box",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    alignItems: "center",
                    overflow: "auto",
                  }}
                >
                  <h2>{dayjs(selectedDate).format("MMMM YYYY")}</h2>
                  <ClubFilter
                    selectedClub={selectedClub}
                    setSelectedClub={setSelectedClub}
                  />
                </div>
                <EventCalendar
                  selectedDate={selectedDate}
                  selectedClub={selectedClub}
                  events={[...pastEvents, ...upcomingEvents].filter((event) => {
                    if (event.status === "ACCEPT") return true;
                    return false;
                  })}
                />
              </Box>
            </Box>
          )}
        </Box>
      )}
      {activeTab === "2" && (
        <Box mt="10px" mx="0" my="xs">
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
            {fests.map((fest) => (
              <Card
                key={fest.id}
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
              >
                <Text weight={700} size="lg">
                  {fest.name}
                </Text>
                <Badge color="blue" mt="sm" size="sm" variant="light">
                  {fest.category}
                </Badge>
                <Text size="sm" mt="sm">
                  Date: {fest.date}
                </Text>
                <Text size="sm" mt="sm" color="blue">
                  <a href={fest.link} target="_blank" rel="noopener noreferrer">
                    Visit Link
                  </a>
                </Text>
                <Button
                  color="blue"
                  fullWidth
                  mt="md"
                  radius="md"
                  onClick={() => openModal(fest)}
                >
                  View Description
                </Button>
              </Card>
            ))}
          </SimpleGrid>

          <Modal
            opened={opened}
            onClose={() => setOpened(false)}
            title={selectedFest?.name}
            centered
            size="70%"
          >
            <Text align="justify" size="md" mt="md">
              {selectedFest?.description.split("\n").map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </Text>
          </Modal>
        </Box>
      )}
      {activeTab === "3" && (
        <Box mt="10px">
          <Box>
            <Suspense fallback={<div>Loading Events Table for you ...</div>}>
              {upcomingEvents && (
                <>
                  <Text size="xl" m="lg">
                    UpcomingEvents Table
                  </Text>
                  <CustomTable
                    data={upcomingEvents}
                    columns={[
                      { accessorKey: "club", header: "Club" },
                      { accessorKey: "status", header: "Status" },
                      { accessorKey: "event_name", header: "Event Name" },
                      { accessorKey: "incharge", header: "Incharge" },
                      { accessorKey: "venue", header: "Venue" },
                      {
                        accessorKey: "date",
                        header: "Date",
                        render: (data) =>
                          new Date(data.date).toLocaleDateString(),
                      },
                      {
                        accessorKey: "start_time",
                        header: "Start Time",
                        render: (data) => data.start_time.substring(0, 5),
                      },
                      { accessorKey: "details", header: "Details" },
                    ]}
                    TableName="Upcoming Events"
                  />
                </>
              )}
            </Suspense>
          </Box>
          <Box>
            <Suspense fallback={<div>Loading Events Table for you ...</div>}>
              {pastEvents && (
                <>
                  <Text size="xl" m="lg">
                    PastEvents Table
                  </Text>
                  <CustomTable
                    data={pastEvents}
                    columns={[
                      { accessorKey: "club", header: "Club" },
                      { accessorKey: "status", header: "Status" },
                      { accessorKey: "event_name", header: "Event Name" },
                      { accessorKey: "incharge", header: "Incharge" },
                      { accessorKey: "venue", header: "Venue" },
                      {
                        accessorKey: "date",
                        header: "Date",
                        render: (data) =>
                          new Date(data.date).toLocaleDateString(),
                      },
                      {
                        accessorKey: "start_time",
                        header: "Start Time",
                        render: (data) => data.start_time.substring(0, 5),
                      },
                      { accessorKey: "details", header: "Details" },
                    ]}
                    TableName="Past Events"
                  />
                </>
              )}
            </Suspense>
          </Box>
          {/* Role-based Event Actions */}
          <EventActionsPanel
            userRole={userRole}
            events={upcomingEvents || []}
            token={token}
            onRefresh={refetchUpcoming}
          />
        </Box>
      )}
      {tabs[Number(activeTab)]?.title === "My Club Admin" && (
        <Box mt="10px" mx={{ base: "xs", sm: "xl" }}>
          <CoordinatorMembersWithProviders clubName={value !== "Select a Club" ? value : "BitByte"} />
        </Box>
      )}
      {tabs[Number(activeTab)]?.title === "Administration" && (
        <Box mt="10px" mx={{ base: "xs", sm: "xl" }}>
          <LeadershipManager activeRole={userRole} />
          <NewClubProposal activeRole={userRole} />
        </Box>
      )}
      {tabs[Number(activeTab)]?.title === "Finance" && (
        <Box mt="10px" mx={{ base: "xs", sm: "xl" }}>
          <BudgetApprovals clubName={value !== "Select a Club" ? value : "BitByte"} />
        </Box>
      )}
      {tabs[Number(activeTab)]?.title === "Inventory" && (
        <Box mt="10px" mx={{ base: "xs", sm: "xl" }}>
          <InventoryManager activeRole={userRole} />
        </Box>
      )}
      {tabs[Number(activeTab)]?.title === "Reports & Audit" && (
        <Box mt="10px" mx={{ base: "xs", sm: "xl" }}>
          <ReportsAndAudit activeRole={userRole} />
        </Box>
      )}
    </>
  );
}

export default GymkhanaDashboard;
