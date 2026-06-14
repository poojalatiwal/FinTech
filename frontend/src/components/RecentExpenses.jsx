import { useState } from "react";

export default function RecentExpenses({
  expenses = []
}) {

  const [showAll, setShowAll] =
    useState(false);

  const now = new Date();

  const currentMonthExpenses =
    expenses
      .filter((expense) => {

        const expenseDate =
          new Date(expense.date);

        return (
          expenseDate.getMonth() ===
            now.getMonth() &&
          expenseDate.getFullYear() ===
            now.getFullYear()
        );

      })

      .sort(
        (a, b) =>
          new Date(b.date) -
          new Date(a.date)
      );

  const displayedExpenses =
    showAll
      ? currentMonthExpenses
      : currentMonthExpenses.slice(0, 3);

  return (

    <div
      className="
      bg-slate-900/60
      backdrop-blur-xl

      border
      border-slate-800

      rounded-3xl

      p-6

      hover:border-blue-500/40
      hover:shadow-[0_15px_40px_rgba(59,130,246,0.12)]

      transition-all
      duration-300
      "
    >

      {/* HEADER */}

      <div
        className="
        flex
        justify-between
        items-center

        mb-5
        "
      >

        <div>

          <h2
            className="
            text-2xl
            font-bold
            text-white
            "
          >
            Recent Expenses
          </h2>

          <p
            className="
            text-slate-400
            text-sm
            mt-1
            "
          >
            Current month activity
          </p>

        </div>

        {currentMonthExpenses.length > 3 && (

          <button
            onClick={() =>
              setShowAll(!showAll)
            }
            className="
            text-blue-400
            text-sm
            font-medium

            hover:text-blue-300

            transition-all
            duration-300
            "
          >
            {
              showAll
                ? "Show Less ↑"
                : "View All →"
            }
          </button>

        )}

      </div>

      {/* LIST */}

      <div className="space-y-3">

        {displayedExpenses.length > 0 ? (

          displayedExpenses.map(
            (expense) => (

              <div
                key={expense.id}
                className="
                flex
                justify-between
                items-center

                p-4

                rounded-2xl

                bg-slate-800/40

                border
                border-slate-700/50

                hover:border-blue-500/30
                hover:bg-slate-800/70
                hover:translate-x-1

                transition-all
                duration-300
                "
              >

                <div>

                  <p
                    className="
                    font-medium
                    text-white
                    "
                  >
                    {expense.title}
                  </p>

                  <p
                    className="
                    text-xs
                    text-slate-400
                    mt-1
                    "
                  >
                    {expense.category}
                  </p>

                </div>

                <div className="text-right">

                  <p
                    className="
                    text-red-400
                    font-semibold
                    "
                  >
                    ₹
                    {Number(
                      expense.amount
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </p>

                  <p
                    className="
                    text-xs
                    text-slate-500
                    mt-1
                    "
                  >
                    {new Date(
                      expense.date
                    ).toLocaleDateString(
                      "en-IN"
                    )}
                  </p>

                </div>

              </div>

            )
          )

        ) : (

          <div
            className="
            text-center

            py-10

            text-slate-500
            "
          >
            No expenses recorded this month
          </div>

        )}

      </div>

      {/* SHOW MORE BUTTON */}

      {
        !showAll &&
        currentMonthExpenses.length > 3 && (

          <div className="mt-5 text-center">

            <button
              onClick={() =>
                setShowAll(true)
              }
              className="
              px-4
              py-2

              rounded-xl

              bg-slate-800

              text-sm

              hover:bg-slate-700
              hover:border-blue-500/40

              transition-all
              "
            >
              Show
              {" "}
              {
                currentMonthExpenses.length - 3
              }
              {" "}
              More Expenses
            </button>

          </div>

        )
      }

    </div>

  );

}