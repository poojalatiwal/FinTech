import {
  FaBullseye,
  FaPiggyBank,
  FaCalendarDays,
  FaArrowTrendUp
} from "react-icons/fa6";
export default function GoalCard({

  goal,

  onView,

  onEdit,

  onDelete

}) {

  const progress = Math.min(

    (goal.currentAmount / goal.targetAmount) * 100,

    100

  );

  const remaining =
    goal.targetAmount - goal.currentAmount;

  return (

    <div
      className="
      group

      relative

      overflow-hidden

      rounded-3xl

      bg-slate-900/70
      backdrop-blur-xl

      border
      border-slate-800

      p-6

      transition-all
      duration-500

      hover:border-blue-500/50
      hover:-translate-y-2
      hover:shadow-[0_20px_50px_rgba(59,130,246,0.18)]
      "
    >

      {/* Glow */}

      <div
        className="
        absolute

        -right-20
        -top-20

        w-52
        h-52

        rounded-full

        bg-blue-500/10

        blur-3xl

        group-hover:bg-blue-500/20

        transition-all
        duration-700
        "
      />

      {/* Header */}

      <div
        className="
        relative

        flex
        justify-between
        items-start
        "
      >

        <div>

          <div
            className="
            w-14
            h-14

            rounded-2xl

            bg-gradient-to-br
            from-blue-500
            to-purple-600

            flex
            items-center
            justify-center

            shadow-lg
            shadow-blue-500/30
            "
          >

            <FaBullseye
              className="
              text-white
              text-2xl
              "
            />

          </div>

        </div>

        <span
          className="
          px-3
          py-1

          rounded-full

          bg-emerald-500/15

          text-emerald-400

          text-xs
          font-semibold
          "
        >
          {progress.toFixed(0)}%
        </span>

      </div>

      {/* Goal Name */}

      <h2
        className="
        mt-5

        text-2xl
        font-bold

        text-white

        break-words
        "
      >
        {goal.goalName}
      </h2>

      {/* Amount */}

      <div
        className="
        mt-6

        space-y-3
        "
      >

        <div
          className="
          flex
          justify-between
          text-sm
          "
        >

          <span
            className="
            text-slate-400
            "
          >
            Saved
          </span>

          <span
            className="
            text-emerald-400
            font-semibold
            "
          >
            ₹
            {goal.currentAmount.toLocaleString("en-IN")}
          </span>

        </div>

        <div
          className="
          flex
          justify-between
          text-sm
          "
        >

          <span
            className="
            text-slate-400
            "
          >
            Target
          </span>

          <span
            className="
            text-white
            font-semibold
            "
          >
            ₹
            {goal.targetAmount.toLocaleString("en-IN")}
          </span>

        </div>

      </div>

      {/* Progress */}

      <div
        className="
        mt-6
        "
      >

        <div
          className="
          h-3

          rounded-full

          bg-slate-800

          overflow-hidden
          "
        >

          <div

            style={{
              width: `${progress}%`
            }}

            className="
            h-full

            rounded-full

            bg-gradient-to-r
            from-blue-500
            via-cyan-400
            to-purple-500

            transition-all
            duration-700
            "
          />

        </div>

      </div>

      {/* Details */}

      <div
        className="
        mt-7

        grid
        grid-cols-2

        gap-4
        "
      >

        <div
          className="
          rounded-2xl

          bg-slate-800/60

          p-4
          "
        >

          <FaPiggyBank
            className="
            text-blue-400
            mb-2
            "
          />

          <p
            className="
            text-xs
            text-slate-400
            "
          >
            Monthly Saving
          </p>

          <h3
            className="
            text-lg
            font-bold
            "
          >
            ₹
            {goal.monthlySaving.toLocaleString("en-IN")}
          </h3>

        </div>

        <div
          className="
          rounded-2xl

          bg-slate-800/60

          p-4
          "
        >

          <FaCalendarDays
            className="
            text-purple-400
            mb-2
            "
          />

          <p
            className="
            text-xs
            text-slate-400
            "
          >
            Remaining
          </p>

          <h3
            className="
            text-lg
            font-bold
            "
          >
            ₹
            {remaining.toLocaleString("en-IN")}
          </h3>

        </div>

      </div>

      {/* AI Suggestion */}

      <div
        className="
        mt-6

        rounded-2xl

        border
        border-blue-500/20

        bg-blue-500/10

        p-4
        "
      >

        <div
          className="
          flex
          items-center
          gap-2

          mb-2
          "
        >

          <FaArrowTrendUp
            className="
            text-blue-400
            "
          />

          <span
            className="
            text-blue-300
            font-semibold
            "
          >
            AI Advice
          </span>

        </div>

        <p
          className="
          text-sm
          text-slate-300
          leading-6
          "
        >
          {goal.advice}
        </p>

      </div>

      {/* Buttons */}

      <div
        className="
        mt-8

        flex

        flex-wrap

        gap-3
        "
      >

        <button

          onClick={() => onView(goal)}

          className="
          flex-1

          rounded-xl

          py-3

          bg-blue-600

          hover:bg-blue-500

          transition-all
          "
        >
          View
        </button>

        <button

          onClick={() => onEdit(goal)}

          className="
          flex-1

          rounded-xl

          py-3

          bg-purple-600

          hover:bg-purple-500

          transition-all
          "
        >
          Edit
        </button>

        <button

          onClick={() => onDelete(goal.id)}

          className="
          flex-1

          rounded-xl

          py-3

          bg-red-600

          hover:bg-red-500

          transition-all
          "
        >
          Delete
        </button>

      </div>

    </div>

  );

}