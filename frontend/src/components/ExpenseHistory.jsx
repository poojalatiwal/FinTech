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
  items-start

  mb-8
  "
>

  <div>

    <h2
      className="
      text-3xl
      sm:text-4xl
      font-bold
      text-white
      "
    >
      Expense History
    </h2>

    <p className="mt-2 text-slate-400 text-lg">
      Yearly & Monthly Records
    </p>

  </div>

  <button
    onClick={onClose}
    className="
    w-11
    h-11

    flex
    items-center
    justify-center

    rounded-xl

    text-white
    text-2xl

    hover:bg-slate-800
    hover:text-red-400

    transition-all
    duration-300
    "
  >
    ✕
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
  key={expense.id}
  className="
  p-4
  sm:px-5
  sm:py-4

  hover:bg-slate-800/40

  transition-all
  duration-300
  "
>

  {/* Desktop */}

  <div className="hidden md:flex justify-between items-center">

    <div>

      <p className="font-semibold text-lg text-white">
        {expense.title}
      </p>

      <div className="flex items-center gap-3 mt-2">

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
          {expense.category}
        </span>

        <span className="text-xs text-slate-500">
          {new Date(expense.date).toLocaleDateString("en-IN")}
        </span>

      </div>

    </div>

    <div className="flex items-center gap-5">

      <p className="text-xl font-bold text-red-400">
        ₹{Number(expense.amount).toLocaleString("en-IN")}
      </p>

      {isLocked ? (

        <div className="flex items-center gap-2 text-yellow-400">

          <FaLock />

          Locked

        </div>

      ) : (

        <div className="flex gap-2">

          <button
            onClick={() => onEdit?.(expense)}
            className="
            w-10
            h-10

            rounded-xl

            flex
            items-center
            justify-center

            bg-blue-500/10
            text-blue-400

            hover:bg-blue-500/20
            "
          >
            <FaEdit />
          </button>

          <button
            onClick={() => onDelete?.(expense.id)}
            className="
            w-10
            h-10

            rounded-xl

            flex
            items-center
            justify-center

            bg-red-500/10
            text-red-400

            hover:bg-red-500/20
            "
          >
            <FaTrash />
          </button>

        </div>

      )}

    </div>

  </div>

  {/* Mobile */}

  <div className="md:hidden space-y-4">

    <div>

      <p className="text-lg font-semibold text-white break-words">
        {expense.title}
      </p>

    </div>

    <div className="flex flex-wrap gap-2">

      <span
        className="
        px-3
        py-1

        rounded-full

        text-xs

        bg-blue-500/10
        text-blue-400
        "
      >
        {expense.category}
      </span>

      <span className="text-xs text-slate-500 flex items-center">
        {new Date(expense.date).toLocaleDateString("en-IN")}
      </span>

    </div>

    <div className="flex justify-between items-center">

      <p className="text-2xl font-bold text-red-400">
        ₹{Number(expense.amount).toLocaleString("en-IN")}
      </p>

      {isLocked ? (

        <div className="flex items-center gap-2 text-yellow-400 text-sm">

          <FaLock />

          Locked

        </div>

      ) : (

        <div className="flex gap-3">

          <button
            onClick={() => onEdit?.(expense)}
            className="
            w-11
            h-11

            rounded-xl

            flex
            items-center
            justify-center

            bg-blue-500/10
            text-blue-400
            "
          >
            <FaEdit />
          </button>

          <button
            onClick={() => onDelete?.(expense.id)}
            className="
            w-11
            h-11

            rounded-xl

            flex
            items-center
            justify-center

            bg-red-500/10
            text-red-400
            "
          >
            <FaTrash />
          </button>

        </div>

      )}

    </div>

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