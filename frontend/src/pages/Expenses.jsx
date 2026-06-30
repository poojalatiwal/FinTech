import { useEffect, useState } from "react";
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaSearch,
  FaWallet
} from "react-icons/fa";

import ExpenseHistory from "../components/ExpenseHistory";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import CategoryTrendChart from "../components/CategoryTrendChart";
import ExpenseChart from "../components/ExpenseChart";

import {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
  getExpenseSummary,
  getForecast,
getMonthlyTrend,
getCategoryTrends
} from "../api/expenseApi";

export default function Expenses() {
const [forecast, setForecast] =
  useState(null);

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [expenses, setExpenses] =
    useState([]);

  const [summary, setSummary] =
    useState(null);

  const [search, setSearch] =
    useState("");
const [selectedCategory, setSelectedCategory] =
  useState("All");
  const [trendData, setTrendData] =
  useState([]);

  const [showModal, setShowModal] =
    useState(false);

const [categoryTrends, setCategoryTrends] =
  useState([]);

  const [editingExpense, setEditingExpense] =
    useState(null);

  const [form, setForm] =
    useState({
      title: "",
      amount: "",
      category: "",
      description: "",
      date: ""
    });

const [
  showHistory,
  setShowHistory
] = useState(false);


  useEffect(() => {

    loadData();

  }, []);

const loadData = async () => {

  try {

    const [
      expenseRes,
      summaryRes,
      categoryTrendRes,
      trendRes
    ] = await Promise.all([
      getExpenses(),
      getExpenseSummary(),
      getCategoryTrends(),
      getMonthlyTrend()
    ]);

    setExpenses(expenseRes.data);
    setSummary(summaryRes.data);
    setCategoryTrends(categoryTrendRes.data);
    setTrendData(trendRes.data);

    // Load AI forecast separately
    try {
      const forecastData = await getForecast();
      console.log(forecastData);
      setForecast(forecastData);
    } catch (e) {
      console.error("Forecast Error", e);
    }

  } catch (err) {
    console.error(err);
  }

};

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };

  const openAddModal = () => {

    setEditingExpense(null);

    setForm({
      title: "",
      amount: "",
      category: "",
      description: "",
      date: ""
    });

    setShowModal(true);

  };

  const openEditModal = (expense) => {

    setEditingExpense(expense);

    setForm({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      description: expense.description,
      date: expense.date
    });

    setShowModal(true);

  };

  const saveExpense = async () => {

    try {

      if (editingExpense) {

        await updateExpense(
          editingExpense.id,
          form
        );

      } else {

        await addExpense(form);

      }

      setShowModal(false);

      loadData();

    } catch (err) {

      console.error(err);

    }

  };

  const removeExpense = async (id) => {

    if (!window.confirm(
      "Delete expense?"
    )) return;

    await deleteExpense(id);

    loadData();

  };
  const categories = [

  "All",

  ...new Set(
    expenses.map(
      expense => expense.category
    )
  )

];

  const filteredExpenses =
  expenses.filter((expense) => {

    const matchesSearch =

      expense.title
        ?.toLowerCase()
        .includes(search.toLowerCase())

      ||

      expense.category
        ?.toLowerCase()
        .includes(search.toLowerCase());

    const matchesCategory =

      selectedCategory === "All"

      ||

      expense.category === selectedCategory;

    return (
      matchesSearch &&
      matchesCategory
    );

  });

const displayedExpenses =
  [...filteredExpenses]
    .sort(
      (a, b) =>
        new Date(b.date) -
        new Date(a.date)
    )
    .slice(0, 5);

    const currentMonthExpense = expenses
  .filter((expense) => {
    const expenseDate = new Date(expense.date);
    const now = new Date();

    return (
      expenseDate.getMonth() === now.getMonth() &&
      expenseDate.getFullYear() === now.getFullYear()
    );
  })
  .reduce(
    (sum, expense) => sum + Number(expense.amount),
    0
  );

const totalExpenseCount = expenses.length;

const inputClass = `
w-full

px-4
py-2.5

bg-slate-800/80

border
border-slate-700

rounded-lg

text-white
text-sm

placeholder:text-slate-500

focus:outline-none
focus:border-blue-500
focus:ring-2
focus:ring-blue-500/20

transition-all
duration-300
`;
  return (

    <div className="flex min-h-screen bg-slate-950 text-white">

      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      <div
  className="
    flex-1
    w-full
    min-w-0

    lg:ml-72

    overflow-x-hidden
  "
>

        <Navbar
          setSidebarOpen={setSidebarOpen}
        />
<main
  className="
    w-full
    min-w-0

    px-4
    py-5

    sm:px-6
    lg:px-8

    overflow-x-hidden
  "
>

          {/* HEADER */}

          <div
            className="
              flex
              flex-col
              sm:flex-row

              items-start
              sm:items-center

              justify-between

              gap-5

              mb-8
            "
          >

            <div>

              <h1 className="text-3xl sm:text-4xl font-bold">
                Expenses
              </h1>

              <p className="text-slate-400 mt-2">
                Track and manage all expenses
              </p>

            </div>

            <button
              onClick={openAddModal}
              className="
                flex
                items-center
                gap-2

                px-6
                py-3

                rounded-2xl

                font-semibold

                bg-gradient-to-r
                from-blue-600
                to-purple-600

                hover:scale-105
                hover:shadow-[0_0_25px_rgba(139,92,246,0.5)]

                transition-all
                duration-300
                "
            >
              <FaPlus />
              Add Expense
            </button>

          </div>

          {/* SUMMARY */}

<div
  className="
    grid
    grid-cols-1
    lg:grid-cols-3

    gap-5

    mb-8

    w-full
  "
>

  {/* TOTAL */}

  <div
    className="
      w-full

      rounded-3xl

      bg-slate-900/70
      backdrop-blur-xl

      border
      border-slate-800

      p-5
      sm:p-6

      transition-all

      hover:border-blue-500
      hover:shadow-[0_20px_40px_rgba(59,130,246,0.15)]
    "
  >

    <FaWallet className="text-red-400 text-3xl mb-4"/>

    <p className="text-slate-400 text-sm">
      Total Expenses
    </p>

    <h2
      className="
        mt-3

        text-3xl
        sm:text-4xl

        font-bold

        break-all
      "
    >
      ₹{summary?.total || 0}
    </h2>

  </div>

  {/* CURRENT MONTH */}

  <div
    className="
      w-full

      rounded-3xl

      bg-slate-900/70
      backdrop-blur-xl

      border
      border-slate-800

      p-5
      sm:p-6

      transition-all

      hover:border-blue-500
      hover:shadow-[0_20px_40px_rgba(59,130,246,0.15)]
    "
  >

    <FaWallet className="text-blue-400 text-3xl mb-4"/>

    <p className="text-slate-400 text-sm">
      Current Month Expense
    </p>

    <h2
      className="
        mt-3

        text-3xl
        sm:text-4xl

        font-bold

        break-all
      "
    >
      ₹{currentMonthExpense}
    </h2>

  </div>

  {/* FORECAST */}

  <div
    className="
      w-full

      rounded-3xl

      bg-slate-900/70
      backdrop-blur-xl

      border
      border-slate-800

      p-5
      sm:p-6

      transition-all

      hover:border-blue-500
      hover:shadow-[0_20px_40px_rgba(59,130,246,0.15)]
    "
  >

    <FaWallet className="text-purple-400 text-3xl mb-4"/>

    <p className="text-slate-400 text-sm">
      Forecast Next Month
    </p>

    <h2
      className="
        mt-3

        text-3xl
        sm:text-4xl

        font-bold

        break-all
      "
    >
      ₹{Math.round(
        forecast?.predictedExpense || 0
      ).toLocaleString("en-IN")}
    </h2>

    <p
      className={`
        mt-4
        text-sm

        ${
          forecast?.predictedExpense > 50000
            ? "text-red-400"
            : forecast?.predictedExpense > 25000
            ? "text-yellow-400"
            : "text-emerald-400"
        }
      `}
    >
      {forecast?.message}
    </p>

  </div>

</div>

{/* ANALYTICS */}
{/* ===================== CHARTS ===================== */}

<div
  className="
    grid
    grid-cols-1
    xl:grid-cols-2

    gap-5
    lg:gap-6

    mb-6

    w-full
  "
>

  {/* Expense Trend */}

<div
  className="
  h-[300px]
  sm:h-[380px]
  md:h-[430px]
  lg:h-[470px]
  xl:h-[500px]
  w-full
  "
>
  <ExpenseChart data={trendData} />
</div>

  {/* Category Trend */}

  <div
    className="
    h-[300px]
    sm:h-[380px]
    md:h-[430px]
    lg:h-[470px]
    xl:h-[500px]
    "
  >
    <CategoryTrendChart
      data={categoryTrends}
    />
  </div>

</div>

{/*SEARCH */}

<div
  className="
    flex
    flex-col
    lg:flex-row

    gap-4

    mb-6

    w-full
  "
>

  <div
    className="
      group

      flex
      items-center

      w-full
      flex-1

      gap-3

      bg-slate-900/70
      backdrop-blur-xl

      border
      border-slate-800

      rounded-2xl

      px-4
      sm:px-5

      py-3
      sm:py-4

      hover:border-blue-500
      hover:shadow-[0_0_25px_rgba(59,130,246,0.15)]

      focus-within:border-blue-500
      focus-within:shadow-[0_0_30px_rgba(59,130,246,0.25)]

      transition-all
      duration-300
    "
  >

    <FaSearch
      className="
        text-lg
        text-slate-500

        shrink-0

        group-hover:text-blue-400
        group-focus-within:text-blue-400

        transition-all
      "
    />

    <div
      className="
        h-5
        w-px

        bg-slate-700

        group-hover:bg-blue-500

        transition-all
      "
    />

    <input
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search by title or category..."
      className="
        flex-1
        min-w-0

        bg-transparent

        text-sm
        sm:text-base

        text-white

        placeholder:text-slate-500

        outline-none
      "
    />

  </div>


    {/* Category Filter */}

 <div
  className="
  relative

  min-w-[220px]

  bg-slate-900/70
  backdrop-blur-xl

  border
  border-slate-800

  rounded-2xl

  hover:border-blue-500

  hover:shadow-[0_0_25px_rgba(59,130,246,0.15)]

  focus-within:border-blue-500

  focus-within:shadow-[0_0_30px_rgba(59,130,246,0.25)]

  transition-all
  duration-300
  "
>

  <select
    value={selectedCategory}
    onChange={(e) =>
      setSelectedCategory(
        e.target.value
      )
    }
    className="
    w-full

    bg-transparent

    px-5
    py-4

    text-white

    outline-none

    appearance-none

    cursor-pointer
    "
  >

    {categories.map((category) => (

      <option
        key={category}
        value={category}
        className="
        bg-slate-900
        text-white
        "
      >
        {category}
      </option>

    ))}

  </select>

  {/* Custom Arrow */}

  <div
    className="
    absolute
    right-4
    top-1/2
    -translate-y-1/2

    text-slate-400

    pointer-events-none
    "
  >
    ▼
  </div>

</div>
</div>
{/* ===================== EXPENSE TABLE ===================== */}

<div
  className="
  bg-slate-900/60
  backdrop-blur-xl

  border
  border-slate-800

  rounded-3xl

  overflow-hidden

  hover:border-blue-500/40
  hover:shadow-[0_0_35px_rgba(59,130,246,0.12)]

  transition-all
  duration-300
  "
>

  {/* Header */}

  <div
    className="
    flex
    flex-col
    sm:flex-row

    items-start
    sm:items-center

    justify-between

    gap-4

    px-4
    sm:px-6

    py-5

    border-b
    border-slate-800
    "
  >

    <div>

      <h2 className="text-lg sm:text-xl font-bold text-white">
        Expense Records
      </h2>

      <p className="text-xs sm:text-sm text-slate-400 mt-1">
        Manage and track all expenses
      </p>

    </div>

    <button
      onClick={() => setShowHistory(true)}
      className="
      w-full
      sm:w-auto

      flex
      justify-center
      items-center

      gap-2

      px-5
      py-3

      rounded-xl

      bg-gradient-to-r
      from-blue-600
      to-purple-600

      font-medium

      hover:scale-105
      hover:shadow-[0_0_20px_rgba(59,130,246,0.35)]

      transition-all
      "
    >
      View History
    </button>

  </div>

  {/* Scrollable Table */}

  <div className="overflow-x-auto">

    <table className="min-w-[750px] w-full">

      <thead
        className="
        sticky
        top-0

        bg-slate-800
        z-10
        "
      >

        <tr>

          <th className="px-5 py-4 text-left text-sm font-semibold">
            Title
          </th>

          <th className="px-5 py-4 text-left text-sm font-semibold">
            Category
          </th>

          <th className="px-5 py-4 text-left text-sm font-semibold">
            Amount
          </th>

          <th className="px-5 py-4 text-left text-sm font-semibold">
            Date
          </th>

          <th className="px-5 py-4 text-center text-sm font-semibold">
            Actions
          </th>

        </tr>

      </thead>

      <tbody>

        {displayedExpenses.map((expense) => (

          <tr
            key={expense.id}
            className="
            border-t
            border-slate-800

            hover:bg-slate-800/40

            transition-all
            duration-200
            "
          >

            <td className="px-5 py-4 whitespace-nowrap">
              {expense.title}
            </td>

            <td className="px-5 py-4 whitespace-nowrap">
              {expense.category}
            </td>

            <td className="px-5 py-4 font-semibold text-green-400 whitespace-nowrap">
              ₹{Number(expense.amount).toLocaleString("en-IN")}
            </td>

            <td className="px-5 py-4 whitespace-nowrap">
              {expense.date}
            </td>

            <td className="px-5 py-4">

              <div className="flex justify-center gap-3">

                <button
                  onClick={() => openEditModal(expense)}
                  className="
                  w-10
                  h-10

                  flex
                  items-center
                  justify-center

                  rounded-xl

                  text-blue-400

                  hover:bg-blue-500/20

                  transition-all
                  "
                >
                  <FaEdit />
                </button>

                <button
                  onClick={() => removeExpense(expense.id)}
                  className="
                  w-10
                  h-10

                  flex
                  items-center
                  justify-center

                  rounded-xl

                  text-red-400

                  hover:bg-red-500/20

                  transition-all
                  "
                >
                  <FaTrash />
                </button>

              </div>

            </td>

          </tr>

        ))}

      </tbody>

    </table>

  </div>

</div>

{
  showHistory && (
    <div
      className="
      fixed
      inset-0
      z-[999]

      bg-black/80
      backdrop-blur-md

      flex
      items-center
      justify-center

      p-4
      "
    >
      <div
        className="
        w-full
        max-w-6xl
        max-h-[90vh]

        overflow-y-auto

        bg-slate-950

        border
        border-slate-800

        rounded-3xl
        "
      >
        <ExpenseHistory
          expenses={expenses}
          onClose={() =>
            setShowHistory(false)
          }
        />
      </div>
    </div>
  )
}
        </main>

      </div>

      {/* MODAL */}

      {showModal && (

          <div
        className="
        w-full
        max-w-xl

        bg-slate-900/95
        backdrop-blur-2xl

        border
        border-slate-700

        rounded-[32px]

        p-8

        shadow-[0_20px_80px_rgba(0,0,0,0.6)]

        animate-in
        fade-in
        zoom-in-95
        "
        >

            <div className="mb-8">
            <h2
                className="
                text-3xl
                font-bold

                bg-gradient-to-r
                from-blue-400
                to-purple-400

                bg-clip-text
                text-transparent
                "
            >
                {editingExpense ? "Edit Expense" : "Add Expense"}
            </h2>

            <p className="text-slate-400 mt-2">
                Manage your financial records
            </p>

            </div>

         <div className="space-y-1">

  <div>
    <label className="block text-sm text-slate-400 mb-1">
      Expense Title
    </label>

    <input
      name="title"
      placeholder="Enter expense title"
      value={form.title}
      onChange={handleChange}
      className={inputClass}
    />
  </div>

  <div>
    <label className="block text-sm text-slate-400 mb-2">
      Amount (₹)
    </label>

    <input
      name="amount"
      type="number"
      placeholder="Enter amount"
      value={form.amount}
      onChange={handleChange}
      className={inputClass}
    />
  </div>

  <div>
    <label className="block text-sm text-slate-400 mb-2">
      Category
    </label>

    <select
      name="category"
      value={form.category}
      onChange={handleChange}
      className={inputClass}
    >
      <option value="">Select Category</option>
      <option value="Food">Food</option>
      <option value="Travel">Travel</option>
      <option value="Shopping">Shopping</option>
      <option value="Bills">Bills</option>
      <option value="Vehicle">Vehicle</option>
      <option value="Health">Health</option>
      <option value="Entertainment">Entertainment</option>
      <option value="Education">Education</option>
      <option value="Other">Other</option>
    </select>
  </div>

  <div>
    <label className="block text-sm text-slate-400 mb-2">
      Expense Date
    </label>

    <input
      type="date"
      name="date"
      value={form.date}
      onChange={handleChange}
      className={`${inputClass} [color-scheme:dark]`}
    />
  </div>

  <div>
    <label className="block text-sm text-slate-400 mb-2">
      Description
    </label>

    <textarea
      rows={2}
      name="description"
      placeholder="Add details..."
      value={form.description}
      onChange={handleChange}
      className={inputClass}
    />
  </div>

</div>

            <div className="flex justify-end gap-3 mt-6">

              <button
                onClick={() =>
                  setShowModal(false)
                }
                className="
                px-4
                py-2
                bg-slate-700
                rounded-xl
                "
              >
                Cancel
              </button>

              <button
                onClick={saveExpense}
                className="
                px-4
                py-2

                rounded-xl

                bg-gradient-to-r
                from-blue-600
                to-purple-600
                "
              >
                Save
              </button>

            </div>

          </div>

      )}

    </div>
  );
}