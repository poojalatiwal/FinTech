import { FaEdit, FaTrash, FaLock } from "react-icons/fa";

export default function ExpenseHistory({
  onClose,
  expenses = [],
  onEdit,
  onDelete,
}) {
  const groupedExpenses = expenses.reduce(
    (acc, expense) => {
      const date = new Date(expense.date);

      const year = date.getFullYear();

      const month = date.toLocaleString(
        "en-IN",
        {
          month: "long",
        }
      );

      if (!acc[year]) {
        acc[year] = {};
      }

      if (!acc[year][month]) {
        acc[year][month] = [];
      }

      acc[year][month].push(expense);

      return acc;
    },
    {}
  );

  return (
    <div
      className="
      fixed inset-0
      bg-black/70
      backdrop-blur-sm
      z-[100]
      flex
      justify-center
      items-center
      p-4
      "
    >
      <div
        className="
        w-full
        max-w-5xl
        max-h-[90vh]
        overflow-y-auto

        bg-slate-950

        border
        border-slate-800

        rounded-3xl

        p-6
        "
      >
        {/* HEADER */}

        <div
          className="
          flex
          justify-between
          items-center
          mb-6
          "
        >
          <div>
            <h2
              className="
              text-3xl
              font-bold
              text-white
              "
            >
              Expense History
            </h2>

            <p className="text-slate-400">
              Yearly & Monthly Records
            </p>
          </div>

          <button
            onClick={onClose}
            className="
            px-4
            py-2

            rounded-xl

            bg-slate-800

            hover:bg-slate-700

            transition-all
            "
          >
            Close
          </button>
        </div>

        {/* YEARS */}

        {Object.entries(groupedExpenses)
          .sort(
            ([a], [b]) =>
              Number(b) - Number(a)
          )
          .map(([year, months]) => (
            <div
              key={year}
              className="mb-8"
            >
              <h3
                className="
                text-2xl
                font-bold
                text-blue-400
                mb-4
                "
              >
                {year}
              </h3>

              {Object.entries(months)
                .sort(
                  ([monthA], [monthB]) =>
                    new Date(
                      `${monthB} 1, ${year}`
                    ) -
                    new Date(
                      `${monthA} 1, ${year}`
                    )
                )
                .map(([month, list]) => {
                  const total =
                    list.reduce(
                      (sum, item) =>
                        sum +
                        Number(item.amount),
                      0
                    );

                  return (
                    <div
                      key={month}
                      className="
                      bg-slate-900/60

                      border
                      border-slate-800

                      rounded-2xl

                      mb-4

                      overflow-hidden
                      "
                    >
                      {/* MONTH HEADER */}

                      <div
                        className="
                        flex
                        justify-between

                        px-5
                        py-4

                        border-b
                        border-slate-800
                        "
                      >
                        <div>
                          <h4
                            className="
                            text-lg
                            font-semibold
                            "
                          >
                            {month}
                          </h4>

                          <p className="text-slate-400 text-sm">
                            {list.length} expenses
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-slate-400 text-sm">
                            Monthly Total
                          </p>

                          <p
                            className="
                            text-red-400
                            font-bold
                            "
                          >
                            ₹
                            {total.toLocaleString(
                              "en-IN"
                            )}
                          </p>
                        </div>
                      </div>

                      {/* EXPENSES */}

                      <div className="divide-y divide-slate-800">
                        {[...list]
                          .sort(
                            (a, b) =>
                              new Date(
                                b.date
                              ) -
                              new Date(
                                a.date
                              )
                          )
                          .map((expense) => {
                            const expenseDate =
                              new Date(
                                expense.date
                              );

                            const today =
                              new Date();

                            const monthDifference =
                              (
                                today.getFullYear() -
                                expenseDate.getFullYear()
                              ) *
                                12 +
                              (
                                today.getMonth() -
                                expenseDate.getMonth()
                              );

                            const isLocked =
                              monthDifference >
                              2;

                            return (
                              <div
                                key={
                                  expense.id
                                }
                                className="
                                flex
                                justify-between
                                items-center

                                px-5
                                py-4

                                hover:bg-slate-800/40

                                transition-all
                                duration-300
                                "
                              >
                                <div>
                                  <p
                                    className="
                                    font-semibold
                                    text-white
                                    "
                                  >
                                    {
                                      expense.title
                                    }
                                  </p>

                                  <div
                                    className="
                                    flex
                                    items-center
                                    gap-3
                                    mt-1
                                    "
                                  >
                                    <span
                                      className="
                                      px-2
                                      py-1

                                      rounded-full

                                      text-xs

                                      bg-blue-500/10
                                      text-blue-400
                                      "
                                    >
                                      {
                                        expense.category
                                      }
                                    </span>

                                    <span
                                      className="
                                      text-xs
                                      text-slate-500
                                      "
                                    >
                                      {new Date(
                                        expense.date
                                      ).toLocaleDateString(
                                        "en-IN"
                                      )}
                                    </span>
                                  </div>
                                </div>

                                <div
                                  className="
                                  flex
                                  items-center
                                  gap-5
                                  "
                                >
                                  <p
                                    className="
                                    text-red-400
                                    font-bold
                                    text-lg
                                    "
                                  >
                                    ₹
                                    {Number(
                                      expense.amount
                                    ).toLocaleString(
                                      "en-IN"
                                    )}
                                  </p>

                                  {isLocked ? (
                                    <div
                                      className="
                                      flex
                                      items-center
                                      gap-2

                                      text-xs
                                      text-yellow-400
                                      "
                                    >
                                      <FaLock />
                                      Locked
                                    </div>
                                  ) : (
                                    <div
                                      className="
                                      flex
                                      items-center
                                      gap-2
                                      "
                                    >
                                      <button
                                        onClick={() =>
                                          onEdit?.(
                                            expense
                                          )
                                        }
                                        className="
                                        w-9
                                        h-9

                                        rounded-xl

                                        flex
                                        items-center
                                        justify-center

                                        bg-blue-500/10
                                        text-blue-400

                                        hover:bg-blue-500/20
                                        hover:scale-110

                                        transition-all
                                        "
                                      >
                                        <FaEdit />
                                      </button>

                                      <button
                                        onClick={() =>
                                          onDelete?.(
                                            expense.id
                                          )
                                        }
                                        className="
                                        w-9
                                        h-9

                                        rounded-xl

                                        flex
                                        items-center
                                        justify-center

                                        bg-red-500/10
                                        text-red-400

                                        hover:bg-red-500/20
                                        hover:scale-110

                                        transition-all
                                        "
                                      >
                                        <FaTrash />
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  );
                })}
            </div>
          ))}
      </div>
    </div>
  );
}