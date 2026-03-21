import Events from "../../Modules/Gymkhana/Events";
import Clubs from "../../Modules/Gymkhana/Clubs";
import Facilities from "../../Modules/Gymkhana/Facilities";
import Bookings from "../../Modules/Gymkhana/Bookings";
import GymkhanaHome from "../../Modules/Gymkhana";
import Memberships from "../../Modules/Gymkhana/Memberships";
import Elections from "../../Modules/Gymkhana/Elections";
import Budgets from "../../Modules/Gymkhana/Budgets";
import Bills from "../../Modules/Gymkhana/Bills";
import Deactivation from "../../Modules/Gymkhana/Deactivation";
import Announcements from "../../Modules/Gymkhana/Announcements";

const gymkhanaRoutes = [
  {
    path: "/gymkhana",
    element: <GymkhanaHome />,
  },
  {
    path: "/gymkhana/events",
    element: <Events />,
  },
  {
    path: "/gymkhana/clubs",
    element: <Clubs />,
  },
  {
    path: "/gymkhana/facilities",
    element: <Facilities />,
  },
  {
    path: "/gymkhana/bookings",
    element: <Bookings />,
  },
  {
    path: "/gymkhana/memberships",
    element: <Memberships />,
  },
  {
    path: "/gymkhana/elections",
    element: <Elections />,
  },
  {
    path: "/gymkhana/budgets",
    element: <Budgets />,
  },
  {
    path: "/gymkhana/bills",
    element: <Bills />,
  },
  {
    path: "/gymkhana/deactivation",
    element: <Deactivation />,
  },
  {
    path: "/gymkhana/announcements",
    element: <Announcements />,
  },
];

export default gymkhanaRoutes;
