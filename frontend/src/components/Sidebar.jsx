import {
  FaHome,
  FaWallet,
  FaPiggyBank,
  FaBullseye,
  FaChartLine,
  FaShieldAlt,
  FaBell,
  FaUser,
  FaSignOutAlt,
  FaCoins,
  FaBars,
  FaTimes
} from "react-icons/fa";

import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Sidebar() {

  const navigate = useNavigate();

  const [isOpen, setIsOpen] =
    useState(false);

  const handleLogout = () => {

    const confirmLogout =
      window.confirm(
        "Are you sure you want to logout?"
      );

    if (!confirmLogout) return;

    localStorage.clear();
    sessionStorage.clear();

    navigate("/login");
  };

  const menuItems = [

    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <FaHome />
    },

    {
      name: "Expenses",
      path: "/expenses",
      icon: <FaWallet />
    },

    {
      name: "Budget",
      path: "/budget",
      icon: <FaPiggyBank />
    },

    {
      name: "Goals",
      path: "/goals",
      icon: <FaBullseye />
    },

    {
      name: "Investments",
      path: "/investments",
      icon: <FaCoins />
    },

    {
      name: "Forecast",
      path: "/forecast",
      icon: <FaChartLine />
    },

    {
      name: "Fraud Detection",
      path: "/fraud",
      icon: <FaShieldAlt />
    },

    {
      name: "Notifications",
      path: "/notifications",
      icon: <FaBell />
    },

    {
      name: "Profile",
      path: "/profile",
      icon: <FaUser />
    }
  ];

  return (
    <>
      {/* MOBILE MENU BUTTON */}

      <button
        onClick={() =>
          setIsOpen(!isOpen)
        }
        className="
        lg:hidden

        fixed
        top-4
        left-4

        z-[200]

        p-3

        rounded-xl

        bg-slate-900
        text-white

        shadow-lg
        "
      >
        {isOpen
          ? <FaTimes />
          : <FaBars />}
      </button>

      {/* MOBILE OVERLAY */}

      {isOpen && (
        <div
          onClick={() =>
            setIsOpen(false)
          }
          className="
          fixed
          inset-0

          bg-black/60

          z-[150]

          lg:hidden
          "
        />
      )}

      {/* SIDEBAR */}

      <aside
        className={`
        fixed
        top-0
        left-0

        h-screen
        w-72

        bg-slate-900/95
        backdrop-blur-xl

        border-r
        border-slate-800

        flex
        flex-col

        p-6

        z-[160]

        transform
        transition-transform
        duration-300

        ${
          isOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }

        lg:translate-x-0
        `}
      >

        {/* LOGO */}

        <div
          className="
          flex
          items-center
          gap-4

          pb-8

          border-b
          border-slate-800
          "
        >

          <div
            className="
            w-14
            h-14

            rounded-2xl

            bg-gradient-to-br
            from-blue-500
            via-indigo-500
            to-purple-500

            flex
            items-center
            justify-center

            shadow-lg
            shadow-blue-500/30
            "
          >
            <span
              className="
              text-white
              text-2xl
              font-black
              "
            >
              ₹
            </span>
          </div>

          <div>

            <h1
              className="
              text-3xl
              font-extrabold

              bg-gradient-to-r
              from-blue-400
              via-indigo-400
              to-purple-400

              bg-clip-text
              text-transparent
              "
            >
              FinSight
            </h1>

            <p
              className="
              text-slate-400
              text-sm
              "
            >
              AI Financial Intelligence
            </p>

          </div>

        </div>

        {/* MENU */}

        <div
          className="
          flex-1
          mt-10
          space-y-3
          overflow-y-auto
          "
        >

          {menuItems.map((item) => (

            <NavLink
              key={item.path}
              to={item.path}
              onClick={() =>
                setIsOpen(false)
              }
              className={({ isActive }) =>
                `
                flex
                items-center
                gap-4

                px-4
                py-3

                rounded-2xl

                transition-all
                duration-300

                ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }
                `
              }
            >

              <span className="text-lg">
                {item.icon}
              </span>

              <span>
                {item.name}
              </span>

            </NavLink>

          ))}

        </div>

        {/* LOGOUT */}

        <button
          onClick={handleLogout}
          className="
          flex
          items-center
          gap-3

          px-4
          py-3

          rounded-2xl

          text-red-400

          hover:bg-red-500/10
          hover:text-red-300

          transition-all

          w-full
          "
        >

          <FaSignOutAlt />

          Logout

        </button>

      </aside>
    </>
  );
}