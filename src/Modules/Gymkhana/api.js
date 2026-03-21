import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// Standardized backend split:
// selectors.py -> GET reads
// services.py -> POST/PUT/DELETE writes
const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

const ENTITY_CHANGED_EVENTS = {
  events: "gymkhana:events:changed",
  clubs: "gymkhana:clubs:changed",
  facilities: "gymkhana:facilities:changed",
  bookings: "gymkhana:bookings:changed",
  memberships: "gymkhana:memberships:changed",
  elections: "gymkhana:elections:changed",
  budgets: "gymkhana:budgets:changed",
  bills: "gymkhana:bills:changed",
  deactivation: "gymkhana:deactivation:changed",
  announcements: "gymkhana:announcements:changed",
};

const SELECTOR_ROUTES = {
  events: "/gymkhana/selectors/get_events_selector/",
  clubs: "/gymkhana/selectors/get_clubs_selector/",
  facilities: "/gymkhana/selectors/get_facilities_selector/",
  bookings: "/gymkhana/selectors/get_bookings_selector/",
  memberships: "/gymkhana/selectors/get_membership_applications_selector/",
  elections: "/gymkhana/selectors/get_elections_selector/",
  budgets: "/gymkhana/selectors/get_budgets_selector/",
  bills: "/gymkhana/selectors/get_bills_selector/",
  inactiveClubs: "/gymkhana/selectors/get_inactive_clubs_selector/",
  announcements: "/gymkhana/selectors/get_announcements_selector/",
};

const SERVICE_ROUTES = {
  createEvent: "/gymkhana/services/create_event_service/",
  createClub: "/gymkhana/services/create_club_service/",
  createFacility: "/gymkhana/services/create_facility_service/",
  createBooking: "/gymkhana/services/create_booking_service/",
  createMembership: "/gymkhana/services/create_membership_application_service/",
  updateMembership: "/gymkhana/services/update_membership_application_service/",
  createElectionParticipation: "/gymkhana/services/create_election_participation_service/",
  createBudget: "/gymkhana/services/create_budget_service/",
  reviewBudget: "/gymkhana/services/review_budget_service/",
  finalizeBudget: "/gymkhana/services/finalize_budget_service/",
  createBill: "/gymkhana/services/create_bill_service/",
  reviewBill: "/gymkhana/services/review_bill_service/",
  deactivateClub: "/gymkhana/services/deactivate_club_service/",
  createAnnouncement: "/gymkhana/services/create_announcement_service/",
};

const mockDb = {
  clubs: [
    {
      id: 1,
      name: "Dramatics Club",
      description: "Stage plays and theatre workshops.",
      coordinator_id: 101,
      coordinator_name: "Club Coordinator",
    },
    {
      id: 2,
      name: "Robotics Club",
      description: "Robotics projects and competitions.",
      coordinator_id: 102,
      coordinator_name: "Technical Coordinator",
    },
  ],
  events: [
    {
      id: 1,
      title: "Freshers Open Mic",
      club_id: 1,
      club_name: "Dramatics Club",
      event_date: "2026-04-10",
      start_time: "17:00",
      end_time: "19:00",
      venue: "Main Auditorium",
      description: "Open mic and stage interaction.",
    },
  ],
  facilities: [
    {
      id: 1,
      name: "Badminton Court 1",
      sport_type: "Badminton",
      location: "Sports Complex",
      capacity: 4,
    },
    {
      id: 2,
      name: "Music Room",
      sport_type: "Music",
      location: "Student Activity Center",
      capacity: 20,
    },
  ],
  bookings: [
    {
      id: 1,
      facility_id: 1,
      facility_name: "Badminton Court 1",
      user_id: 22001,
      user_name: "Student User",
      booking_date: "2026-04-12",
      start_time: "16:00",
      end_time: "17:00",
      purpose: "Practice Session",
    },
  ],
  memberships: [
    {
      id: 1,
      student_id: 22001,
      student_name: "Student User",
      club_id: 1,
      club_name: "Dramatics Club",
      motivation: "Interested in stage acting.",
      status: "Submitted",
    },
  ],
  elections: [
    {
      id: 1,
      election_id: "ELEC-2026-01",
      club_id: 1,
      club_name: "Dramatics Club",
      student_id: 22001,
      candidate_name: "Candidate A",
      status: "Recorded",
    },
  ],
  budgets: [
    {
      id: 1,
      club_id: 1,
      club_name: "Dramatics Club",
      year: 2026,
      amount: 120000,
      details: "Event logistics and club activities",
      status: "Submitted",
      counsellor_decision: "Pending",
      dean_decision: "Pending",
    },
  ],
  bills: [
    {
      id: 1,
      budget_id: 1,
      amount: 12000,
      category: "Logistics",
      file_type: "pdf",
      notes: "Stage setup vendor bill",
      status: "Submitted",
    },
  ],
  deactivation: [
    {
      id: 1,
      club_id: 3,
      club_name: "Photography Club",
      financial_status: "Cleared",
      status: "Inactive",
      deactivated: false,
    },
    {
      id: 2,
      club_id: 4,
      club_name: "Literary Club",
      financial_status: "Pending Settlements",
      status: "Inactive",
      deactivated: false,
    },
  ],
  announcements: [
    {
      id: 1,
      title: "Auditions Open",
      club_id: 1,
      club_name: "Dramatics Club",
      content: "Auditions start next Monday in the auditorium.",
      created_at: "2026-03-17",
    },
  ],
};

const mockCounters = {
  events: mockDb.events.length + 1,
  clubs: mockDb.clubs.length + 1,
  facilities: mockDb.facilities.length + 1,
  bookings: mockDb.bookings.length + 1,
  memberships: mockDb.memberships.length + 1,
  elections: mockDb.elections.length + 1,
  budgets: mockDb.budgets.length + 1,
  bills: mockDb.bills.length + 1,
  deactivation: mockDb.deactivation.length + 1,
  announcements: mockDb.announcements.length + 1,
};

function getNextId(entityName) {
  const nextId = mockCounters[entityName];
  mockCounters[entityName] += 1;
  return nextId;
}

function shouldUseFallback(error) {
  if (!error?.response) {
    return true;
  }

  const status = Number(error.response.status);
  return status === 404 || status >= 500;
}

function dispatchEntityChanged(entityName) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(ENTITY_CHANGED_EVENTS[entityName]));
  }
}

// Extracts list rows from common backend response shapes.
export function extractRows(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.results)) {
    return payload.results;
  }

  return [];
}

export function entityRows(payload, entityName) {
  const rows = extractRows(payload);
  if (rows.length) {
    return rows;
  }

  return mockDb[entityName];
}

// Normalizes API errors so UI components can show consistent messages.
export function extractErrorMessage(error, fallbackMessage) {
  const errorData = error?.response?.data;

  if (typeof errorData?.detail === "string") {
    return errorData.detail;
  }

  if (typeof errorData?.message === "string") {
    return errorData.message;
  }

  if (
    Array.isArray(errorData?.non_field_errors) &&
    errorData.non_field_errors[0]
  ) {
    return errorData.non_field_errors[0];
  }

  if (typeof error?.message === "string") {
    return error.message;
  }

  return fallbackMessage;
}

async function fetchSelector(route) {
  const response = await apiClient.get(route);
  return response.data;
}

async function mutateService(route, data) {
  const response = await apiClient.post(route, data);
  return response.data;
}

export async function getEvents() {
  try {
    return await fetchSelector(SELECTOR_ROUTES.events);
  } catch (error) {
    if (shouldUseFallback(error)) {
      return [...mockDb.events];
    }
    throw error;
  }
}

export async function createEvent(data) {
  try {
    const response = await mutateService(SERVICE_ROUTES.createEvent, data);
    dispatchEntityChanged("events");
    return response;
  } catch (error) {
    if (!shouldUseFallback(error)) {
      throw error;
    }

    const club = mockDb.clubs.find((item) => Number(item.id) === Number(data.club_id));
    const record = {
      id: getNextId("events"),
      title: data.title,
      club_id: Number(data.club_id),
      club_name: club?.name || `Club ${data.club_id}`,
      event_date: data.event_date,
      start_time: data.start_time,
      end_time: data.end_time,
      venue: data.venue,
      description: data.description || "",
    };
    mockDb.events.unshift(record);
    dispatchEntityChanged("events");
    return record;
  }
}

export async function getClubs() {
  try {
    return await fetchSelector(SELECTOR_ROUTES.clubs);
  } catch (error) {
    if (shouldUseFallback(error)) {
      return [...mockDb.clubs];
    }
    throw error;
  }
}

export async function createClub(data) {
  try {
    const response = await mutateService(SERVICE_ROUTES.createClub, data);
    dispatchEntityChanged("clubs");
    return response;
  } catch (error) {
    if (!shouldUseFallback(error)) {
      throw error;
    }

    const record = {
      id: getNextId("clubs"),
      name: data.name,
      description: data.description,
      coordinator_id: data.coordinator_id || null,
      coordinator_name: data.coordinator_id ? `User ${data.coordinator_id}` : "-",
    };
    mockDb.clubs.unshift(record);
    dispatchEntityChanged("clubs");
    return record;
  }
}

export async function getFacilities() {
  try {
    return await fetchSelector(SELECTOR_ROUTES.facilities);
  } catch (error) {
    if (shouldUseFallback(error)) {
      return [...mockDb.facilities];
    }
    throw error;
  }
}

export async function createFacility(data) {
  try {
    const response = await mutateService(SERVICE_ROUTES.createFacility, data);
    dispatchEntityChanged("facilities");
    return response;
  } catch (error) {
    if (!shouldUseFallback(error)) {
      throw error;
    }

    const record = {
      id: getNextId("facilities"),
      name: data.name,
      sport_type: data.sport_type,
      location: data.location,
      capacity: data.capacity || null,
    };
    mockDb.facilities.unshift(record);
    dispatchEntityChanged("facilities");
    return record;
  }
}

export async function getBookings() {
  try {
    return await fetchSelector(SELECTOR_ROUTES.bookings);
  } catch (error) {
    if (shouldUseFallback(error)) {
      return [...mockDb.bookings];
    }
    throw error;
  }
}

export async function createBooking(data) {
  try {
    const response = await mutateService(SERVICE_ROUTES.createBooking, data);
    dispatchEntityChanged("bookings");
    return response;
  } catch (error) {
    if (!shouldUseFallback(error)) {
      throw error;
    }

    const hasOverlap = mockDb.bookings.some((booking) => {
      const sameFacility =
        Number(booking.facility_id) === Number(data.facility_id);
      const sameDate = booking.booking_date === data.booking_date;
      if (!sameFacility || !sameDate) {
        return false;
      }

      return data.start_time < booking.end_time && data.end_time > booking.start_time;
    });

    if (hasOverlap) {
      throw new Error("Selected facility is not available for this time slot.");
    }

    const facility = mockDb.facilities.find(
      (item) => Number(item.id) === Number(data.facility_id),
    );

    const record = {
      id: getNextId("bookings"),
      facility_id: Number(data.facility_id),
      facility_name: facility?.name || `Facility ${data.facility_id}`,
      user_id: data.user_id || null,
      user_name: data.user_id ? `User ${data.user_id}` : "-",
      booking_date: data.booking_date,
      start_time: data.start_time,
      end_time: data.end_time,
      purpose: data.purpose,
    };
    mockDb.bookings.unshift(record);
    dispatchEntityChanged("bookings");
    return record;
  }
}

export async function getMemberships() {
  try {
    return await fetchSelector(SELECTOR_ROUTES.memberships);
  } catch (error) {
    if (shouldUseFallback(error)) {
      return [...mockDb.memberships];
    }
    throw error;
  }
}

export async function createMembership(data) {
  try {
    const response = await mutateService(SERVICE_ROUTES.createMembership, data);
    dispatchEntityChanged("memberships");
    return response;
  } catch (error) {
    if (!shouldUseFallback(error)) {
      throw error;
    }

    const existing = mockDb.memberships.find(
      (item) =>
        Number(item.student_id) === Number(data.student_id) &&
        Number(item.club_id) === Number(data.club_id) &&
        item.status === "Approved",
    );

    if (existing) {
      throw new Error("Student is already a member of this club.");
    }

    const club = mockDb.clubs.find((item) => Number(item.id) === Number(data.club_id));
    const record = {
      id: getNextId("memberships"),
      student_id: Number(data.student_id),
      student_name: data.student_name || `Student ${data.student_id}`,
      club_id: Number(data.club_id),
      club_name: club?.name || `Club ${data.club_id}`,
      motivation: data.motivation,
      status: "Submitted",
    };
    mockDb.memberships.unshift(record);
    dispatchEntityChanged("memberships");
    return record;
  }
}

export async function updateMembershipStatus(data) {
  try {
    const response = await mutateService(SERVICE_ROUTES.updateMembership, data);
    dispatchEntityChanged("memberships");
    return response;
  } catch (error) {
    if (!shouldUseFallback(error)) {
      throw error;
    }

    const membership = mockDb.memberships.find((item) => Number(item.id) === Number(data.id));
    if (!membership) {
      throw new Error("Membership application not found.");
    }

    if (["Approved", "Rejected"].includes(membership.status)) {
      throw new Error("Application already finalized.");
    }

    membership.status = data.status;
    dispatchEntityChanged("memberships");
    return membership;
  }
}

export async function getElections() {
  try {
    return await fetchSelector(SELECTOR_ROUTES.elections);
  } catch (error) {
    if (shouldUseFallback(error)) {
      return [...mockDb.elections];
    }
    throw error;
  }
}

export async function createElectionParticipation(data) {
  try {
    const response = await mutateService(
      SERVICE_ROUTES.createElectionParticipation,
      data,
    );
    dispatchEntityChanged("elections");
    return response;
  } catch (error) {
    if (!shouldUseFallback(error)) {
      throw error;
    }

    const duplicate = mockDb.elections.find(
      (item) =>
        item.election_id === data.election_id &&
        Number(item.student_id) === Number(data.student_id),
    );
    if (duplicate) {
      throw new Error("Student has already participated in this election.");
    }

    const club = mockDb.clubs.find((item) => Number(item.id) === Number(data.club_id));
    const record = {
      id: getNextId("elections"),
      election_id: data.election_id,
      club_id: Number(data.club_id),
      club_name: club?.name || `Club ${data.club_id}`,
      student_id: Number(data.student_id),
      candidate_name: data.candidate_name,
      status: "Recorded",
    };
    mockDb.elections.unshift(record);
    dispatchEntityChanged("elections");
    return record;
  }
}

export async function getBudgets() {
  try {
    return await fetchSelector(SELECTOR_ROUTES.budgets);
  } catch (error) {
    if (shouldUseFallback(error)) {
      return [...mockDb.budgets];
    }
    throw error;
  }
}

export async function createBudget(data) {
  try {
    const response = await mutateService(SERVICE_ROUTES.createBudget, data);
    dispatchEntityChanged("budgets");
    return response;
  } catch (error) {
    if (!shouldUseFallback(error)) {
      throw error;
    }

    const club = mockDb.clubs.find((item) => Number(item.id) === Number(data.club_id));
    const record = {
      id: getNextId("budgets"),
      club_id: Number(data.club_id),
      club_name: club?.name || `Club ${data.club_id}`,
      year: Number(data.year),
      amount: Number(data.amount),
      details: data.details,
      status: "Submitted",
      counsellor_decision: "Pending",
      dean_decision: "Pending",
    };
    mockDb.budgets.unshift(record);
    dispatchEntityChanged("budgets");
    return record;
  }
}

export async function reviewBudget(data) {
  try {
    const response = await mutateService(SERVICE_ROUTES.reviewBudget, data);
    dispatchEntityChanged("budgets");
    return response;
  } catch (error) {
    if (!shouldUseFallback(error)) {
      throw error;
    }

    const budget = mockDb.budgets.find((item) => Number(item.id) === Number(data.id));
    if (!budget) {
      throw new Error("Budget not found.");
    }

    if (["Approved", "Rejected"].includes(budget.dean_decision)) {
      throw new Error("Budget is locked after final decision.");
    }

    budget.counsellor_decision = data.counsellor_decision;
    budget.status = data.counsellor_decision === "Rejected" ? "Rejected" : "Under Dean Review";
    dispatchEntityChanged("budgets");
    return budget;
  }
}

export async function finalizeBudget(data) {
  try {
    const response = await mutateService(SERVICE_ROUTES.finalizeBudget, data);
    dispatchEntityChanged("budgets");
    return response;
  } catch (error) {
    if (!shouldUseFallback(error)) {
      throw error;
    }

    const budget = mockDb.budgets.find((item) => Number(item.id) === Number(data.id));
    if (!budget) {
      throw new Error("Budget not found.");
    }

    if (["Approved", "Rejected"].includes(budget.dean_decision)) {
      throw new Error("Budget cannot be modified after final dean decision.");
    }

    budget.dean_decision = data.dean_decision;
    budget.status = data.dean_decision;
    dispatchEntityChanged("budgets");
    return budget;
  }
}

export async function getBills() {
  try {
    return await fetchSelector(SELECTOR_ROUTES.bills);
  } catch (error) {
    if (shouldUseFallback(error)) {
      return [...mockDb.bills];
    }
    throw error;
  }
}

export async function createBill(data) {
  try {
    const response = await mutateService(SERVICE_ROUTES.createBill, data);
    dispatchEntityChanged("bills");
    return response;
  } catch (error) {
    if (!shouldUseFallback(error)) {
      throw error;
    }

    const budget = mockDb.budgets.find((item) => Number(item.id) === Number(data.budget_id));
    if (!budget) {
      throw new Error("Budget not found.");
    }

    if (Number(data.amount) > Number(budget.amount)) {
      throw new Error("Bill amount exceeds approved budget.");
    }

    const allowedTypes = ["pdf", "jpg", "jpeg", "png"];
    if (!allowedTypes.includes(String(data.file_type || "").toLowerCase())) {
      throw new Error("Invalid document format. Allowed: PDF, JPG, JPEG, PNG.");
    }

    const record = {
      id: getNextId("bills"),
      budget_id: Number(data.budget_id),
      amount: Number(data.amount),
      category: data.category,
      file_type: String(data.file_type).toLowerCase(),
      notes: data.notes,
      status: "Submitted",
    };
    mockDb.bills.unshift(record);
    dispatchEntityChanged("bills");
    return record;
  }
}

export async function reviewBill(data) {
  try {
    const response = await mutateService(SERVICE_ROUTES.reviewBill, data);
    dispatchEntityChanged("bills");
    return response;
  } catch (error) {
    if (!shouldUseFallback(error)) {
      throw error;
    }

    const bill = mockDb.bills.find((item) => Number(item.id) === Number(data.id));
    if (!bill) {
      throw new Error("Bill not found.");
    }

    bill.status = data.status;
    dispatchEntityChanged("bills");
    return bill;
  }
}

export async function getInactiveClubs() {
  try {
    return await fetchSelector(SELECTOR_ROUTES.inactiveClubs);
  } catch (error) {
    if (shouldUseFallback(error)) {
      return [...mockDb.deactivation];
    }
    throw error;
  }
}

export async function deactivateClub(data) {
  try {
    const response = await mutateService(SERVICE_ROUTES.deactivateClub, data);
    dispatchEntityChanged("deactivation");
    return response;
  } catch (error) {
    if (!shouldUseFallback(error)) {
      throw error;
    }

    const record = mockDb.deactivation.find((item) => Number(item.id) === Number(data.id));
    if (!record) {
      throw new Error("Inactive club record not found.");
    }

    if (record.financial_status === "Pending Settlements") {
      throw new Error("Club cannot be deactivated due to pending financial settlements.");
    }

    record.deactivated = true;
    record.status = "Deactivated";
    dispatchEntityChanged("deactivation");
    return record;
  }
}

export async function getAnnouncements() {
  try {
    return await fetchSelector(SELECTOR_ROUTES.announcements);
  } catch (error) {
    if (shouldUseFallback(error)) {
      return [...mockDb.announcements];
    }
    throw error;
  }
}

export async function createAnnouncement(data) {
  try {
    const response = await mutateService(SERVICE_ROUTES.createAnnouncement, data);
    dispatchEntityChanged("announcements");
    return response;
  } catch (error) {
    if (!shouldUseFallback(error)) {
      throw error;
    }

    if (!String(data.content || "").trim()) {
      throw new Error("Announcement content cannot be empty.");
    }

    const club = mockDb.clubs.find((item) => Number(item.id) === Number(data.club_id));
    const record = {
      id: getNextId("announcements"),
      title: data.title,
      club_id: Number(data.club_id),
      club_name: club?.name || `Club ${data.club_id}`,
      content: data.content,
      created_at: new Date().toISOString().slice(0, 10),
    };
    mockDb.announcements.unshift(record);
    dispatchEntityChanged("announcements");
    return record;
  }
}

export const gymkhanaEntityEvents = ENTITY_CHANGED_EVENTS;
