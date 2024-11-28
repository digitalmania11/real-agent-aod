import { Link, NavLink, Outlet } from "react-router-dom";
import HeaderText from "../components/HeaderText/HeaderText";
import { LiaUsersCogSolid } from "react-icons/lia";
import { FaRegUserCircle, FaUserSecret } from "react-icons/fa";
import { FaBuildingUser } from "react-icons/fa6";
import { MdRateReview, MdReviews } from "react-icons/md";
import { TiThMenuOutline } from "react-icons/ti";
import {
  BsBuildingExclamation,
  BsBuildingFillAdd,
  BsBuildingFillGear,
  BsClipboardHeart,
  BsFillHousesFill,
  BsBook
} from "react-icons/bs";
import { GrMoney } from "react-icons/gr";
import { RiAdminFill } from "react-icons/ri";
import { IoIosHome } from "react-icons/io";
import useRole from "../hooks/useRole";
import useAuth from "../hooks/useAuth";
import LogOutButton from "../components/Buttons/LogOutButton";
import { useEffect, useState } from "react";

const DashboardLayout = () => {
  const { user, loading } = useAuth();
  const [role, isLoading] = useRole(user?.email);
  const [sidebarOpen, setSidebarOpen] = useState(true); // Sidebar state

  let headerText = "";
  let headerText2 = "DASHBOARD";
  if (!isLoading) {
    if (role !== "user") {
      headerText = role.toUpperCase();
    }
  }

  const [isdark, setIsdark] = useState(
    JSON.parse(localStorage.getItem("isdark"))
  );

  // Set theme in Dashboard
  useEffect(() => {
    localStorage.setItem("isdark", JSON.stringify(isdark));
  }, [isdark]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen); // Toggle sidebar visibility
  };

  const userNavlinks = (
    <>
      <NavLink
        to="profile"
        className={({ isActive, isPending }) =>
          isPending
            ? "pending"
            : isActive
            ? " active bg-base-100  px-3 py-2 text-neutral rounded-full font-semibold"
            : "hover:bg-base-100 px-3 py-2 hover:text-neutral transition duration-200 rounded-full "
        }
      >
        <FaRegUserCircle className="inline text-xl mr-3" /> My Profile
      </NavLink>
      <NavLink
        to="/dashboard/wishlist"
        className={({ isActive, isPending }) =>
          isPending
            ? "pending"
            : isActive
            ? " active bg-base-100  px-3 py-2 text-neutral rounded-full font-semibold"
            : "hover:bg-base-100 px-3 py-2 hover:text-neutral transition duration-200 rounded-full "
        }
      >
        <BsClipboardHeart className="inline text-xl mr-3" />
        WishList
      </NavLink>
      <NavLink
        to="/dashboard/property-bought"
        className={({ isActive, isPending }) =>
          isPending
            ? "pending"
            : isActive
            ? " active bg-base-100  px-3 py-2 text-neutral rounded-full font-semibold"
            : "hover:bg-base-100 px-3 py-2 hover:text-neutral transition duration-200 rounded-full "
        }
      >
        <FaBuildingUser className="inline text-xl mr-3" /> Property Bought
      </NavLink>
      <NavLink
        to="/dashboard/my-reviews"
        className={({ isActive, isPending }) =>
          isPending
            ? "pending"
            : isActive
            ? " active bg-base-100  px-3 py-2 text-neutral rounded-full font-semibold"
            : "hover:bg-base-100 px-3 py-2 hover:text-neutral transition duration-200 rounded-full "
        }
      >
        <MdReviews className="inline text-xl mr-3" /> My Reviews
      </NavLink>
      <NavLink
        to="/dashboard/meetups"
        className={({ isActive, isPending }) =>
          isPending
            ? "pending"
            : isActive
            ? " active bg-base-100  px-3 py-2 text-neutral rounded-full font-semibold"
            : "hover:bg-base-100 px-3 py-2 hover:text-neutral transition duration-200 rounded-full "
        }
      >
        <MdReviews className="inline text-xl mr-3" /> My Meetups
      </NavLink>
    </>
  );
  const agentNavlinks = (
    <>
      <NavLink
        to="profile"
        className={({ isActive, isPending }) =>
          isPending
            ? "pending"
            : isActive
            ? " active bg-base-100  px-3 py-2 text-neutral rounded-full font-semibold"
            : "hover:bg-base-100 px-3 py-2 hover:text-neutral transition duration-200 rounded-full "
        }
      >
        <FaUserSecret className="inline text-xl mr-3" /> Agent Profile
      </NavLink>
      <NavLink
        to="/dashboard/learning-modules"
        className={({ isActive, isPending }) =>
          isPending
            ? "pending"
            : isActive
            ? " active bg-base-100  px-3 py-2 text-neutral rounded-full font-semibold"
            : "hover:bg-base-100 px-3 py-2 hover:text-neutral transition duration-200 rounded-full "
        }
      >
        <BsBook className="inline text-xl mr-3" />
        Learning Modules
      </NavLink>
      <NavLink
        to="/dashboard/add-property"
        className={({ isActive, isPending }) =>
          isPending
            ? "pending"
            : isActive
            ? " active bg-base-100  px-3 py-2 text-neutral rounded-full font-semibold"
            : "hover:bg-base-100 px-3 py-2 hover:text-neutral transition duration-200 rounded-full "
        }
      >
        <BsBuildingFillAdd className="inline text-xl mr-3" />
        Add Property
      </NavLink>
      <NavLink
        to="/dashboard/added-properties"
        className={({ isActive, isPending }) =>
          isPending
            ? "pending"
            : isActive
            ? " active bg-base-100  px-3 py-2 text-neutral rounded-full font-semibold"
            : "hover:bg-base-100 px-3 py-2 hover:text-neutral transition duration-200 rounded-full "
        }
      >
        <BsFillHousesFill className="inline text-xl mr-3" />
        My Added Properties
      </NavLink>
      <NavLink
        to="/dashboard/sold-properties"
        className={({ isActive, isPending }) =>
          isPending
            ? "pending"
            : isActive
            ? " active bg-base-100  px-3 py-2 text-neutral rounded-full font-semibold"
            : "hover:bg-base-100 px-3 py-2 hover:text-neutral transition duration-200 rounded-full "
        }
      >
        <GrMoney className="inline text-xl mr-3" />
        My Sold Properties
      </NavLink>
      <NavLink
        to="/dashboard/requested-properties"
        className={({ isActive, isPending }) =>
          isPending
            ? "pending"
            : isActive
            ? " active bg-base-100  px-3 py-2 text-neutral rounded-full font-semibold"
            : "hover:bg-base-100 px-3 py-2 hover:text-neutral transition duration-200 rounded-full "
        }
      >
        <BsBuildingExclamation className="inline text-xl mr-3" /> Requested
        Properties
      </NavLink>
      <NavLink
        to="/dashboard/meetup-scheduled"
        className={({ isActive, isPending }) =>
          isPending
            ? "pending"
            : isActive
            ? " active bg-base-100  px-3 py-2 text-neutral rounded-full font-semibold"
            : "hover:bg-base-100 px-3 py-2 hover:text-neutral transition duration-200 rounded-full "
        }
      >
        <BsBuildingExclamation className="inline text-xl mr-3" /> Meetup Scheduled
      </NavLink>
      
    </>
  );
  const fraudNavlinks = (
    <>
      <NavLink
        to="profile"
        className={({ isActive, isPending }) =>
          isPending
            ? "pending"
            : isActive
            ? " active bg-base-100  px-3 py-2 text-neutral rounded-full font-semibold"
            : "hover:bg-base-100 px-3 py-2 hover:text-neutral transition duration-200 rounded-full "
        }
      >
        <RiAdminFill className="inline text-xl mr-3" /> Profile
      </NavLink>
      <p>Sorry! You do not access to any dashboard facility!(Because you were marked as fraud)</p>
      <p>Please contact admin!</p>
    </>
  );
  const adminNavlinks = (
    <>
      <NavLink
        to="profile"
        className={({ isActive, isPending }) =>
          isPending
            ? "pending"
            : isActive
            ? " active bg-base-100  px-3 py-2 text-neutral rounded-full font-semibold"
            : "hover:bg-base-100 px-3 py-2 hover:text-neutral transition duration-200 rounded-full "
        }
      >
        <RiAdminFill className="inline text-xl mr-3" /> Admin Profile
      </NavLink>
      <NavLink
        to="/dashboard/manage-properties"
        className={({ isActive, isPending }) =>
          isPending
            ? "pending"
            : isActive
            ? " active bg-base-100  px-3 py-2 text-neutral rounded-full font-semibold"
            : "hover:bg-base-100 px-3 py-2 hover:text-neutral transition duration-200 rounded-full "
        }
      >
        <BsBuildingFillGear className="inline text-xl mr-3" />
        Manage Properties
      </NavLink>
      {/* <NavLink
        to="/dashboard/manage-users"
        className={({ isActive, isPending }) =>
          isPending
            ? "pending"
            : isActive
            ? " active bg-base-100  px-3 py-2 text-neutral rounded-full font-semibold"
            : "hover:bg-base-100 px-3 py-2 hover:text-neutral transition duration-200 rounded-full "
        }
      >
        <LiaUsersCogSolid className="inline text-xl mr-3" />
        Manage Users
      </NavLink> */}
      <NavLink
        to="/dashboard/manage-reviews"
        className={({ isActive, isPending }) =>
          isPending
            ? "pending"
            : isActive
            ? " active bg-base-100  px-3 py-2 text-neutral rounded-full font-semibold"
            : "hover:bg-base-100 px-3 py-2 hover:text-neutral transition duration-200 rounded-full "
        }
      >
        <MdRateReview className="inline text-xl mr-3" />
        Manage reviews
      </NavLink>
    </>
  );
  return (
    <div className="min-h-screen bg-blue-50 relative">
      {loading ? (
        <div className="flex justify-center items-center min-h-screen bg-blue-100">
          <img
            src="/assets/home/loading2.png"
            alt="loader"
            className="motion-safe:animate-spin w-32 h-32 mx-auto"
          />
        </div>
      ) : (
        <div className={`drawer ${sidebarOpen ? "md:drawer-open" : ""}`}>
          <input
            id="my-drawer-2"
            type="checkbox"
            className="drawer-toggle"
            checked={sidebarOpen}
            onChange={toggleSidebar}
          />
  
          <div className="drawer-content overflow-x-auto bg-white transition-all duration-300 ease-in-out">
            {/* Navbar Button */}
            <label
              htmlFor="my-drawer-2"
              onClick={toggleSidebar} // Toggle the sidebar on button click
              className="navbar drawer-button md:hidden font-semibold bg-indigo-600 text-white px-6 py-2 rounded-md shadow-lg hover:bg-indigo-700"
            >
              <TiThMenuOutline className="text-xl mr-2" /> DASHBOARD
            </label>
  
            <Outlet />
          </div>
  
          {/* Sidebar content */}
          <div
            className={`drawer-side bg-gradient-to-tr m-2 rounded-xl from-indigo-600 via-blue-500 to-lightblue-300 text-white w-80 h-[98vh] fixed top-0 left-0 transition-transform duration-300 ease-in-out ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <label
              htmlFor="my-drawer-2"
              aria-label="close sidebar"
              className="drawer-overlay"
              onClick={toggleSidebar} // Close sidebar when overlay is clicked
            ></label>
  
            <div
              className={`menu gap-4 p-4 min-h-[100vh] ${
                role === "admin"
                  ? "bg-gradient-to-tr from-blue-400 via-blue-400 to-blue-500"
                  : role === "agent"
                  ? "bg-gradient-to-tr from-blue-400 via-blue-400 to-blue-500 border-r-2 border-white"
                  : "bg-gradient-to-tr from-blue-400 via-blue-400 to-blue-400"
              }`}
            >
              {/* Sidebar Content */}
              <HeaderText
                headerText={headerText}
                headerText2="DASHBOARD"
                emailText={user?.email}
              />

  
              {isLoading ? (
                <div className="w-full flex justify-center py-4">
                  <span className="loading loading-ring w-32 h-32 text-center"></span>
                </div>
              ) : role === "user" ? (
                userNavlinks
              ) : role === "agent" ? (
                agentNavlinks
              ) : role === "fraud" ? (
                fraudNavlinks
              ) : (
                adminNavlinks
              )}

  
              <hr className="border-white my-4" />
  
              {/* Homepage Link */}
              <div className="flex gap-4 flex-col mt-12  ">
              <Link
                to="/"
                className="flex items-center text-lg font-semibold px-6 py-3 rounded-full text-white bg-blue-800 hover:bg-blue-900 transition ease-in-out duration-300"
              >
                <IoIosHome className="mr-3 text-xl" />
                Return Home
              </Link>
  
              {/* Log Out Button */}
              <LogOutButton />
                </div>
            </div>
          </div>
  
          {/* Vertical Arrow Button for Sidebar Toggle */}
          <div
            className={`fixed top-1/3 transform -translate-y-1/2 z-50 left-0 ${
              sidebarOpen ? "rotate-180" : "rotate-0"
            } transition-transform duration-300`}
            onClick={toggleSidebar}
            style={{ cursor: "pointer" }}
          >
            <div
              className={`bg-blue-500 text-white p-2 rounded-full transition-transform duration-300`}
            >
              {sidebarOpen ? "<" : ">"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}  

export default DashboardLayout; 
