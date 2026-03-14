import Events from "../../Modules/Gymkhana/Events";
import Clubs from "../../Modules/Gymkhana/Clubs";
import Facilities from "../../Modules/Gymkhana/Facilities";
import Bookings from "../../Modules/Gymkhana/Bookings";

const gymkhanaRoutes = [
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
];

export default gymkhanaRoutes;
