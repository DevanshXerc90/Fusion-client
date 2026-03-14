import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// Standardized backend split:
// selectors.py -> GET reads
// services.py -> POST/PUT/DELETE writes
const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

const SELECTOR_ROUTES = {
  events: "/gymkhana/selectors/get_events_selector/",
  clubs: "/gymkhana/selectors/get_clubs_selector/",
  facilities: "/gymkhana/selectors/get_facilities_selector/",
  bookings: "/gymkhana/selectors/get_bookings_selector/",
};

const SERVICE_ROUTES = {
  createEvent: "/gymkhana/services/create_event_service/",
  createClub: "/gymkhana/services/create_club_service/",
  createFacility: "/gymkhana/services/create_facility_service/",
  createBooking: "/gymkhana/services/create_booking_service/",
};

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
  return fetchSelector(SELECTOR_ROUTES.events);
}

export async function createEvent(data) {
  return mutateService(SERVICE_ROUTES.createEvent, data);
}

export async function getClubs() {
  return fetchSelector(SELECTOR_ROUTES.clubs);
}

export async function createClub(data) {
  return mutateService(SERVICE_ROUTES.createClub, data);
}

export async function getFacilities() {
  return fetchSelector(SELECTOR_ROUTES.facilities);
}

export async function createFacility(data) {
  return mutateService(SERVICE_ROUTES.createFacility, data);
}

export async function getBookings() {
  return fetchSelector(SELECTOR_ROUTES.bookings);
}

export async function createBooking(data) {
  return mutateService(SERVICE_ROUTES.createBooking, data);
}
