import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { FcGoogle } from "react-icons/fc";

import { loginUser } from "../api/authApi";
import { AuthContext } from "../contexts/AuthContext";

export default function Login() {
  const navigate = useNavigate();

  const { login } = useContext(AuthContext);

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

const handleGoogleLogin = () => {
  console.log("Google Clicked");

  window.location.href =
    "http://localhost:8080/oauth2/authorization/google";
};

  const [form, setForm] =
    useState({
      emailOrUsername: "",
      password: "",
      role: "USER",
    });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);

    const res = await loginUser(form);

    login(res.data);

    toast.success("Login Successful");

    // ROLE BASED REDIRECT

    if (res.data.role === "ADMIN") {
      navigate("/admin/dashboard");
    } else {
      navigate("/dashboard");
    }

  } catch (error) {
    toast.error("Invalid Credentials");
  } finally {
    setLoading(false);
  }
};

  return (
    <div
      className="
      min-h-screen
      flex
      items-center
      justify-center
      px-4
      py-10
      relative
      overflow-hidden
      bg-slate-950
      "
    >
      {/* Glow Background */}

      <div
        className="
        absolute
        top-[-150px]
        left-[-150px]
        w-[400px]
        h-[400px]
        bg-blue-600/20
        blur-[120px]
        rounded-full
        animate-pulse
        "
      />

      <div
        className="
        absolute
        bottom-[-150px]
        right-[-150px]
        w-[400px]
        h-[400px]
        bg-purple-600/20
        blur-[120px]
        rounded-full
        animate-pulse
        "
      />

      {/* Card */}

      <div
        className="
        relative

        w-full
        max-w-md

        bg-slate-900/70

        backdrop-blur-2xl

        border
        border-white/10

        rounded-[32px]

        p-5
        sm:p-6

        shadow-[0_20px_80px_rgba(59,130,246,0.25)]

        transition-all
        duration-500

        hover:shadow-blue-500/30
        "
      >
        {/* Logo */}

        <div className="text-center">
          <div
            className="
            w-18
            h-18

            mx-auto

            rounded-3xl

            bg-gradient-to-br
            from-blue-500
            via-indigo-500
            to-purple-500

            flex
            items-center
            justify-center

            shadow-lg
            shadow-blue-500/40
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

          <h1
            className="
            mt-3
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
            mt-3
            text-slate-400
            text-sm
            "
          >
            AI Powered Financial Intelligence
          </p>
        </div>

        {/* Form */}

        <form
          onSubmit={handleSubmit}
          className="
          mt-6
          space-y-3
          "
        >
          {/* Email */}

          <div>
            <label
              className="
              text-sm
              text-slate-400
              "
            >
              Email or Username
            </label>

            <input
              type="text"
              name="emailOrUsername"
              value={
                form.emailOrUsername
              }
              onChange={
                handleChange
              }
              required
              placeholder="Enter Email or Username"
              className="
              mt-2
              w-full

              px-4
              py-2.5

              rounded-2xl

              bg-slate-800/70

              border
              border-slate-700

              text-white

              placeholder:text-slate-500

              transition-all
              duration-300

              hover:border-blue-500

              focus:border-blue-500
              focus:ring-4
              focus:ring-blue-500/20

              focus:outline-none
              "
            />
          </div>

          {/* Password */}

          <div>
            <label
              className="
              text-sm
              text-slate-400
              "
            >
              Password
            </label>

            <div className="relative">
              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                value={
                  form.password
                }
                onChange={
                  handleChange
                }
                required
                placeholder="Enter Password"
                className="
                mt-2
                w-full

                px-4
                py-2.5

                rounded-2xl

                bg-slate-800/70

                border
                border-slate-700

                text-white

                placeholder:text-slate-500

                transition-all
                duration-300

                hover:border-blue-500

                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-500/20

                focus:outline-none
                "
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                className="
                absolute
                right-4
                top-6

                text-slate-400

                hover:text-blue-400

                transition-all
                duration-300
                "
              >
                {showPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </button>
            </div>

            <div className="text-right mt-2">
              <Link
                to="/forgot-password"
                className="
                text-sm
                text-blue-400

                hover:text-blue-300

                transition-all
                "
              >
                Forgot Password?
              </Link>
            </div>
          </div>

        
          {/* Button */}

          <button
            disabled={loading}
            className="
            w-full

            py-2.5

            rounded-2xl

            font-semibold

            text-white

            bg-gradient-to-r
            from-blue-600
            via-indigo-600
            to-purple-600

            hover:scale-[1.02]

            hover:shadow-xl
            hover:shadow-blue-500/30

            active:scale-95

            transition-all
            duration-300
            "
          >
            {loading
              ? "Signing In..."
              : "Login"}
          </button>
        </form>


          <div className="relative my-4">

  <div className="absolute inset-0 flex items-center">

    <div className="w-full border-t border-slate-700"></div>

  </div>

  <div className="relative flex justify-center">

    <span
      className="
      px-4
      bg-slate-900
      text-slate-400
      text-sm
      "
    >
      OR
    </span>

  </div>

</div><button
  type="button"
  onClick={handleGoogleLogin}
  className="
  w-full

  flex
  items-center
  justify-center
  gap-3

  py-2.5

  rounded-2xl

  border
  border-slate-700

  bg-slate-800/50

  text-white

  hover:bg-slate-700/60
  hover:border-blue-500

  transition-all
  duration-300
  "
>

  <FcGoogle size={24} />

  Continue with Google

</button>

        {/* Register */}

        <p
          className="
          text-center
          mt-6
          text-slate-400
          "
        >
          Don't have an account?

          <Link
            to="/register"
            className="
            ml-2

            font-semibold

            text-blue-400

            hover:text-blue-300

            transition-all
            duration-300
            "
          >
            Register
          </Link>
        </p>

        <p
          className="
          mt-6

          text-center

          text-xs

          text-slate-500
          "
        >
          Smart Finance • AI Insights • Fraud Detection
        </p>
      </div>
    </div>
  );
}