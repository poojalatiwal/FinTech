import {
  FaBell,
  FaUserCircle,
  FaBars
} from "react-icons/fa";

import {
  useState,
  useEffect,
  useRef
} from "react";

import {
  getNotifications
} from "../api/notificationApi";

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

const [notifications,setNotifications] = useState([]);
const [showNotifications,setShowNotifications] = useState(false);
const [unreadCount, setUnreadCount] = useState(0);
const notificationRef = useRef(null);
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

    useEffect(() => {

  const loadNotifications = async () => {

    try {

      const data =
        await getNotifications();

      setNotifications(data);
      setUnreadCount(data.length);

    } catch (error) {

      console.error(error);

    }

  };

  if (token) {

    loadNotifications();

  }

}, [token]);

useEffect(() => {

  const handleClickOutside = (event) => {

    if (
      notificationRef.current &&
      !notificationRef.current.contains(event.target)
    ) {

      setShowNotifications(false);

    }

  };

  document.addEventListener(
    "click",
    handleClickOutside
  );

  return () => {

    document.removeEventListener(
      "click",
      handleClickOutside
    );

  };

}, []);
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

  px-3
  sm:px-6

  py-3
  sm:py-4

  bg-slate-900/80
  backdrop-blur-xl

  border-b
  border-slate-800
  "
>
        {/* LEFT */}

       <div className="flex items-center gap-2 min-w-0">


  {/* Desktop AI Card */}

  <div
    onClick={() => setShowAIChat(true)}
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
      <p className="text-sm text-white">
        AI Assistant Active
      </p>

      <p className="text-xs text-slate-400">
        Tap to chat
      </p>
    </div>

        </div>

{/* Mobile AI Assistant */}

<div
  onClick={() => setShowAIChat(true)}
  className="
md:hidden

translate-x-12

flex
items-center
gap-2

px-3
py-2

rounded-full

bg-slate-800/80
backdrop-blur-md

border
border-slate-700

cursor-pointer

hover:border-blue-500
hover:bg-slate-800

transition-all
duration-300
"
>

  <span
    className="
    w-2
    h-2

    rounded-full

    bg-green-500

    animate-pulse
    "
  />

  <div className="leading-tight">

    <p className="text-[11px] font-semibold text-white">
      AI Assistant
    </p>

    <p className="text-[10px] text-slate-400">
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

<div className="relative" ref={notificationRef}>

  <button
    onClick={(e) => {
      e.stopPropagation();
      setShowNotifications(prev => !prev);
      setUnreadCount(0);
    }}
    className="
      relative

      w-11
      h-11

      flex
      items-center
      justify-center

      rounded-full

      bg-slate-800/70

      border
      border-slate-700

      text-blue-400
      text-xl

      hover:bg-slate-800
      hover:border-blue-500
      hover:text-white

      transition-all
    "
  >

    <FaBell className="text-xl" />

    {unreadCount > 0 && (
      <span
        className="
          absolute
          -top-1
          -right-1

          w-5
          h-5

          flex
          items-center
          justify-center

          rounded-full

          bg-red-500
          text-white

          text-[10px]
          font-bold
        "
      >
        {unreadCount}
      </span>
    )}

  </button>

  {showNotifications && (

  <div
    className="
    absolute
    right-0
    top-12

    w-[380px]

    bg-slate-900/95
    backdrop-blur-xl

    border
    border-slate-700

    rounded-3xl

    shadow-[0_20px_50px_rgba(0,0,0,0.5)]

    overflow-hidden

    animate-in
    fade-in
    zoom-in-95

    z-50
    "
  >

    {/* Header */}

    <div
      className="
      px-6
      py-5

      border-b
      border-slate-800

      flex
      items-center
      justify-between
      "
    >

      <h3
        className="
        text-lg
        font-bold
        text-white
        "
      >
        Notifications
      </h3>

      <span
        className="
        text-xs
        px-2
        py-1

        rounded-full

        bg-blue-500/20
        text-blue-400
        "
      >
        {notifications.length}
      </span>

    </div>

    {/* Body */}

    <div
      className="
      max-h-[420px]
      overflow-y-auto
      "
    >

      {notifications.length === 0 ? (

        <div
          className="
          p-10
          text-center
          text-slate-500
          "
        >
          No notifications
        </div>

      ) : (

        notifications.map((notification) => (

          <div
            key={notification.id}
            className="
            px-6
            py-4

            border-b
            border-slate-800

            hover:bg-slate-800/70

            transition-all

            cursor-pointer
            "
          >

            <div
              className="
              flex
              items-start
              gap-3
              "
            >

              <div
                className="
                w-10
                h-10

                rounded-full

                bg-gradient-to-r
                from-cyan-500
                to-purple-500

                flex
                items-center
                justify-center

                text-white
                "
              >
                <FaBell />
              </div>

              <div className="flex-1">

                <p
                  className="
                  text-white
                  text-sm
                  leading-6
                  "
                >
                  {notification.message}
                </p>

                <p
                  className="
                  text-xs
                  text-slate-500
                  mt-1
                  "
                >
                  Just now
                </p>

              </div>

            </div>

          </div>

        ))

      )}

    </div>

  </div>

)}
</div>

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