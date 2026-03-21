import { createTheme, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { Notifications } from "@mantine/notifications";
import { Layout } from "./components/layout";
import Dashboard from "./Modules/Dashboard/dashboardNotifications";
import Profile from "./Modules/Dashboard/StudentProfile/profilePage";
import LoginPage from "./pages/login";
import ForgotPassword from "./pages/forgotPassword";
import AcademicPage from "./Modules/Academic/index";
import ValidateAuth from "./helper/validateauth";
import FacultyProfessionalProfile from "./Modules/facultyProfessionalProfile/facultyProfessionalProfile";
import InactivityHandler from "./helper/inactivityhandler";
import Examination from "./Modules/Examination/examination";
import Database from "./Modules/Database/database";
import ProgrammeCurriculumRoutes from "./Modules/Program_curriculum/programmCurriculum";
import NotFoundPage from "./components/NotFoundPage";
import { moduleRoutes } from "./routes/globalRoutes";

const theme = createTheme({
  breakpoints: {
    xxs: "300px",
    xs: "375px",
    sm: "768px",
    md: "992px",
    lg: "1200px",
    xl: "1408px",
  },
});

export default function App() {
  const location = useLocation();
  const isGymkhanaPath = location.pathname.startsWith("/gymkhana");
  const shouldBypassAuthForGymkhana = import.meta.env.DEV && isGymkhanaPath;

  return (
    <MantineProvider theme={theme}>
      <Notifications position="top-center" autoClose={2000} limit={1} />
      {location.pathname !== "/accounts/login" &&
        !shouldBypassAuthForGymkhana && <ValidateAuth />}
      {location.pathname !== "/accounts/login" &&
        !shouldBypassAuthForGymkhana && <InactivityHandler />}

      <Routes>
        <Route path="/" element={<Navigate to="/accounts/login" replace />} />
        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        <Route
          path="/academics"
          element={
            <Layout>
              <AcademicPage />
            </Layout>
          }
        />
        <Route
          path="/profile"
          element={
            <Layout>
              <Profile />
            </Layout>
          }
        />
        <Route
          path="/facultyprofessionalprofile/*"
          element={
            <Layout>
              <FacultyProfessionalProfile />
            </Layout>
          }
        />
        <Route
          path="/programme_curriculum/*"
          element={
            <div>
              <ProgrammeCurriculumRoutes />
            </div>
          }
        />
        <Route path="/accounts/login" element={<LoginPage />} />
        <Route path="/reset-password" element={<ForgotPassword />} />
        <Route path="/examination/*" element={<Examination />} />
        <Route path="/database/*" element={<Database />} />
        {moduleRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={<Layout>{route.element}</Layout>}
          />
        ))}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </MantineProvider>
  );
}
