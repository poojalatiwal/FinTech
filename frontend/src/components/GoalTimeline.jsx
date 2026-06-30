import {
  FaCheckCircle,
  FaCircle,
  FaFlag,
  FaBullseye
} from "react-icons/fa";

import { useMemo } from "react";

export default function GoalTimeline({

  targetAmount = 0,

  currentAmount = 0,

  months = 12

}) {

  /*
  ------------------------------------
  Progress %
  ------------------------------------
  */

  const progress = Math.min(
    (currentAmount / targetAmount) * 100,
    100
  );

  /*
  ------------------------------------
  Build Timeline
  ------------------------------------
  */

  const milestones = useMemo(() => {

    if (!targetAmount || !months)
      return [];

    const monthlyTarget =
      targetAmount / months;

    return Array.from(
      { length: months },
      (_, index) => {

        const target =
          Math.round(
            monthlyTarget * (index + 1)
          );

        const completed =
          currentAmount >= target;

        const active =
          currentAmount < target &&
          currentAmount >=
            target - monthlyTarget;

        return {

          month: index + 1,

          target,

          completed,

          active

        };

      }

    );

  }, [
    targetAmount,
    currentAmount,
    months
  ]);

  return (

<div
className="
relative

rounded-3xl

bg-slate-900/70
backdrop-blur-xl

border
border-slate-800

p-5
sm:p-6

hover:border-blue-500/40
hover:shadow-[0_20px_45px_rgba(59,130,246,0.15)]

transition-all
duration-500
"
>

{/* Glow */}

<div
className="
absolute

-right-24
-top-24

w-56
h-56

rounded-full

bg-blue-500/10

blur-3xl

pointer-events-none
"
/>

{/* Header */}

<div
className="
relative

flex

flex-col
sm:flex-row

justify-between

items-start
sm:items-center

gap-4

mb-8
"
>

<div>

<h2
className="
text-2xl

font-bold

bg-gradient-to-r
from-blue-400
via-cyan-400
to-purple-400

bg-clip-text
text-transparent
"
>

Goal Timeline

</h2>

<p
className="
text-slate-400
mt-2
"
>

Track your monthly milestones

</p>

</div>

<div
className="
px-4
py-2

rounded-full

bg-blue-500/10

text-blue-400

text-sm
font-semibold
"
>

{progress.toFixed(0)}%

Completed

</div>

</div>

{/* Overall Progress */}

<div
className="
mb-10
"
>

<div
className="
flex

justify-between

text-sm

mb-2
"
>

<span className="text-slate-400">

Progress

</span>

<span className="text-white">

₹{currentAmount.toLocaleString("en-IN")} / ₹{targetAmount.toLocaleString("en-IN")}

</span>

</div>

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

{/* Timeline Starts */}

<div
className="
relative

space-y-6
"
>

{/* Vertical Line */}

<div
className="
absolute

left-5

top-0
bottom-0

w-[2px]

bg-slate-700
"
/>

{milestones.map((item, index) => (

  <div
    key={item.month}
    className="
    relative

    flex
    items-start

    gap-5

    group
    "
  >

    {/* Timeline Icon */}

    <div
      className={`
      relative

      z-10

      w-10
      h-10

      rounded-full

      flex
      items-center
      justify-center

      transition-all
      duration-500

      ${
        item.completed
          ? "bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,.6)]"
          : item.active
          ? "bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,.6)] animate-pulse"
          : "bg-slate-700"
      }
      `}
    >

      {

        item.completed

        ?

        <FaCheckCircle
          className="
          text-white
          text-lg
          "
        />

        :

        item.active

        ?

        <FaBullseye
          className="
          text-white
          text-sm
          "
        />

        :

        <FaCircle
          className="
          text-slate-400
          text-xs
          "
        />

      }

    </div>

    {/* Card */}

    <div
      className={`
      flex-1

      rounded-2xl

      border

      p-5

      transition-all
      duration-300

      hover:-translate-y-1

      ${
        item.completed

        ?

        "border-emerald-500/30 bg-emerald-500/10"

        :

        item.active

        ?

        "border-blue-500/40 bg-blue-500/10"

        :

        "border-slate-700 bg-slate-800/40"
      }
      `}
    >

      <div
        className="
        flex

        flex-col
        sm:flex-row

        justify-between

        gap-3
        "
      >

        <div>

          <h3
            className="
            text-lg
            font-semibold
            text-white
            "
          >

            Month {item.month}

          </h3>

          <p
            className="
            text-sm
            text-slate-400
            mt-1
            "
          >

            Save

            <span
              className="
              ml-2
              font-semibold
              text-blue-400
              "
            >

              ₹{item.target.toLocaleString("en-IN")}

            </span>

          </p>

        </div>

        <div>

          {

            item.completed

            ?

            <span
              className="
              px-3
              py-1

              rounded-full

              bg-emerald-500/20

              text-emerald-400

              text-xs
              font-semibold
              "
            >
              Completed
            </span>

            :

            item.active

            ?

            <span
              className="
              px-3
              py-1

              rounded-full

              bg-blue-500/20

              text-blue-400

              text-xs
              font-semibold
              "
            >
              Current
            </span>

            :

            <span
              className="
              px-3
              py-1

              rounded-full

              bg-slate-700

              text-slate-300

              text-xs
              "
            >
              Upcoming
            </span>

          }

        </div>

      </div>

      {/* Progress */}

      <div
        className="
        mt-5
        "
      >

        <div
          className="
          h-2

          rounded-full

          bg-slate-700

          overflow-hidden
          "
        >

          <div

            style={{

              width:

                item.completed

                ?

                "100%"

                :

                item.active

                ?

                `${Math.min(

                  ((currentAmount -

                  (item.target -

                  targetAmount / months))

                  /

                  (targetAmount / months))

                  *

                  100,

                  100

                )}%`

                :

                "0%"

            }}

            className={`
            h-full

            rounded-full

            transition-all
            duration-700

            ${
              item.completed

              ?

              "bg-emerald-500"

              :

              "bg-gradient-to-r from-blue-500 to-cyan-400"
            }
            `}
          />

        </div>

      </div>

    </div>

  </div>

))}

{/* Goal Completed */}

{

progress >= 100 && (

<div
className="
mt-10

rounded-3xl

bg-gradient-to-r

from-emerald-500/20
to-blue-500/20

border
border-emerald-500/30

p-8

text-center

animate-pulse
"
>

<FaFlag
className="
mx-auto

text-5xl

text-emerald-400

mb-4
"
/>

<h2
className="
text-3xl

font-bold

text-emerald-400
"
>

Goal Achieved 🎉

</h2>

<p
className="
text-slate-300

mt-3

leading-7
"
>

Congratulations!

You have successfully achieved your savings goal.

</p>

</div>

)

}

</div>

</div>
);

}