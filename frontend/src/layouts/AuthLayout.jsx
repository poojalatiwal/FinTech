import { motion } from "framer-motion";

export default function AuthLayout({

  title,

  subtitle,

  children
}) {

  return (

    <div
      className="
      min-h-screen
      flex
      items-center
      justify-center
      px-4
      "
    >

      <motion.div

        initial={{
          opacity:0,
          y:30
        }}

        animate={{
          opacity:1,
          y:0
        }}

        transition={{
          duration:.5
        }}

        className="
        glass
        rounded-3xl
        p-8
        w-full
        max-w-md
        shadow-2xl
        "
      >

        <h1
          className="
          text-4xl
          font-bold
          mb-2
          "
        >
          {title}
        </h1>

        <p
          className="
          text-slate-400
          mb-8
          "
        >
          {subtitle}
        </p>

        {children}

      </motion.div>

    </div>
  );
}