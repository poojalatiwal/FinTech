import {
  FaBell,
  FaUserCircle,
  FaBars
} from "react-icons/fa";

import {
  useState
} from "react";

import {
  Link,
  useNavigate
} from "react-router-dom";

import AIChatModal
  from "./AIChatModal";

export default function Navbar({
  setSidebarOpen
}) {

  const navigate =
    useNavigate();

  const [showAIChat,
    setShowAIChat] =
    useState(false);

  const token =
    localStorage.getItem(
      "token"
    );

  const user =
    JSON.parse(
      localStorage.getItem(
        "user"
      ) || "{}"
    );

  const displayName =
    user.name ||
    user.username ||
    "User";

  const handleLogout =
    () => {

      localStorage.clear();

      navigate("/login");
    };

  return (
    <>

      <nav
        className="
        sticky
        top-0
        z-40

        flex
        items-center
        justify-between

        px-4
        sm:px-6

        py-4

        bg-slate-900/80
        backdrop-blur-xl

        border-b
        border-slate-800
        "
      >

        {/* LEFT */}

        <div
          className="
          flex
          items-center
          gap-4
          "
        >

          <button
            onClick={() =>
              setSidebarOpen?.(
                true
              )
            }
            className="
            lg:hidden

            text-xl
            text-slate-300

            hover:text-blue-400
            "
          >
            <FaBars />
          </button>

          {/* AI CARD */}

          <div
            onClick={() =>
              setShowAIChat(
                true
              )
            }
            className="
            hidden
            md:flex

            cursor-pointer

            items-center
            gap-3

            px-5
            py-3

            rounded-2xl

            bg-slate-800/50

            border
            border-slate-700

            hover:border-blue-500
            hover:bg-slate-800

            transition-all
            "
          >

            <div
              className="
              w-3
              h-3

              rounded-full

              bg-green-500

              animate-pulse
              "
            />

            <div>

              <p
                className="
                text-sm
                text-white
                "
              >
                AI Assistant Active
              </p>

              <p
                className="
                text-xs
                text-slate-400
                "
              >
                Tap to chat
              </p>

            </div>

          </div>

        </div>

        {/* RIGHT */}

        {token ? (

          <div
            className="
            flex
            items-center
            gap-4
            "
          >

            <button
              className="
              relative

              text-xl

              text-slate-300
              "
            >

              <FaBell />

              <span
                className="
                absolute
                -top-1
                -right-1

                w-3
                h-3

                rounded-full

                bg-red-500
                "
              />

            </button>

            <div
              className="
              flex
              items-center
              gap-3
              "
            >

              <FaUserCircle
                className="
                text-4xl
                text-blue-400
                "
              />

              <div
                className="
                hidden
                sm:block
                "
              >

                <p
                  className="
                  text-white
                  font-semibold
                  "
                >
                  {displayName}
                </p>


              </div>

            </div>

          </div>

        ) : (

          <div
            className="
            flex
            gap-2
            "
          >

            <Link
              to="/login"
              className="
              px-4
              py-2

              rounded-xl

              bg-slate-800
              "
            >
              Login
            </Link>

            <Link
              to="/register"
              className="
              px-4
              py-2

              rounded-xl

              bg-gradient-to-r
              from-blue-600
              to-purple-600
              "
            >
              Sign Up
            </Link>

          </div>

        )}

      </nav>

      <AIChatModal
        isOpen={showAIChat}
        onClose={() =>
          setShowAIChat(
            false
          )
        }
      />

    </>
  );
}