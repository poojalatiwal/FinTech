import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";

import { registerUser } from "../api/authApi";

export default function Register() {

  const navigate = useNavigate();

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] =
    useState({

      name: "",

      username: "",

      email: "",

      password: ""
    });

  const handleChange = (e) => {

    setForm({

      ...form,

      [e.target.name]:
      e.target.value
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      await registerUser(form);

      toast.success(
        "Account Created Successfully"
      );

      navigate("/login");

    } catch (error) {

      toast.error(
        "Registration Failed"
      );

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

      {/* Background Glow */}

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

        p-6
        sm:p-8

        shadow-[0_20px_80px_rgba(59,130,246,0.25)]

        hover:shadow-blue-500/30

        transition-all
        duration-500
        "
      >

        {/* Logo */}

        <div className="text-center">

          <div
            className="
            w-20
            h-20

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
              text-3xl
              font-black
              "
            >
              ₹
            </span>
          </div>

          <h1
            className="
            mt-5

            text-4xl

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
            Create Your Financial Profile
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="
          mt-8
          space-y-4
          "
        >

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            className="
            w-full
            px-4
            py-3

            rounded-2xl

            bg-slate-800/70

            border
            border-slate-700

            text-white

            placeholder:text-slate-500

            hover:border-blue-500

            focus:border-blue-500
            focus:ring-4
            focus:ring-blue-500/20

            focus:outline-none
            transition-all
            "
          />

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
            className="
            w-full
            px-4
            py-3

            rounded-2xl

            bg-slate-800/70

            border
            border-slate-700

            text-white

            placeholder:text-slate-500

            hover:border-blue-500

            focus:border-blue-500
            focus:ring-4
            focus:ring-blue-500/20

            focus:outline-none
            transition-all
            "
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
            className="
            w-full
            px-4
            py-3

            rounded-2xl

            bg-slate-800/70

            border
            border-slate-700

            text-white

            placeholder:text-slate-500

            hover:border-blue-500

            focus:border-blue-500
            focus:ring-4
            focus:ring-blue-500/20

            focus:outline-none
            transition-all
            "
          />

          <div className="relative">

            <input
              type={
                showPassword
                ? "text"
                : "password"
              }
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="
              w-full

              px-4
              py-3

              rounded-2xl

              bg-slate-800/70

              border
              border-slate-700

              text-white

              placeholder:text-slate-500

              hover:border-blue-500

              focus:border-blue-500
              focus:ring-4
              focus:ring-blue-500/20

              focus:outline-none
              transition-all
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
              top-4

              text-slate-400

              hover:text-blue-400

              transition-all
              "
            >
              {
                showPassword
                ?
                <FaEyeSlash />
                :
                <FaEye />
              }
            </button>

          </div>

          <button
            disabled={loading}
            className="
            w-full

            py-3

            rounded-2xl

            text-white
            font-semibold

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
            {
              loading
              ?
              "Creating Account..."
              :
              "Create Account"
            }
          </button>

        </form>

        <p
          className="
          text-center
          mt-6
          text-slate-400
          "
        >
          Already have an account?

          <Link
            to="/login"
            className="
            ml-2

            text-blue-400

            hover:text-blue-300

            font-semibold

            transition-all
            "
          >
            Login
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
          AI Insights • Budget Planning • Fraud Detection
        </p>

      </div>

    </div>
  );
}