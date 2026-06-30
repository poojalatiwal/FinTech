import { useEffect, useState } from "react";
import API from "../api/axios";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import {
  Wallet,
  TrendingUp,
  Layers,
  PiggyBank
} from "lucide-react";

import {
  ResponsiveContainer,
   AreaChart,
  Area,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

function SummaryCard({
  title,
  value,
  color,
  icon,
}) {
const colors = {
  cyan: "border-slate-800",
  red: "border-slate-800",
  green: "border-slate-800",
  purple: "border-slate-800",
};

  return (
    <div
      className={`
      bg-slate-900/70
  border border-slate-800
  rounded-3xl
  p-6
  h-[170px]
  flex flex-col
     
    hover:border-blue-500
    hover:scale-[1.02]
    hover:-translate-y-1
    hover:shadow-[0_20px_50px_rgba(59,130,246,0.15)]
      transition-all
      duration-300
      `}
    >
      <div>
 <div className="mb-3">
  {icon}
</div>

        <p className="text-slate-400 text-lg font-medium">
          {title}
        </p>
      </div>

      <h2
        className="
        text-4xl
        font-black
        text-white
        mt-4
        "
      >
        {value}
      </h2>
    </div>
  );
}
export default function Budget() {
const [sidebarOpen,setSidebarOpen] =useState(false);

const [showModal, setShowModal] =useState(false);

const [editingId, setEditingId] =
  useState(null);

const [form, setForm] = useState({
    category: "",
    limitAmount: "",
    month: "",
  });

  const [expenses, setExpenses] = useState([]);
const handleCreate = async () => {
  try {

    if (editingId) {

      await API.put(
        `/budget/${editingId}`,
        form
      );

    } else {

      await API.post(
        "/budget",
        form
      );
    }

    setShowModal(false);

    setEditingId(null);

    setForm({
      category: "",
      limitAmount: "",
      month: "",
    });

    loadData();

  } catch (error) {
    console.error(error);
  }
};

  const [budgets, setBudgets] =
    useState([]);

  const [summary, setSummary] =
    useState(null);

    const currentMonth = new Date().toLocaleString(
  "default",
  { month: "long" }
);

const currentMonthBudgets = budgets.filter(
  (budget) =>
    budget.month?.toLowerCase() ===
    currentMonth.toLowerCase()
);

const monthlyBudget = currentMonthBudgets.reduce(
  (sum, budget) =>
    sum + Number(budget.limitAmount),
  0
);
const monthlyTrendData = Object.values(
  budgets.reduce((acc, budget) => {

    if (!acc[budget.month]) {
      acc[budget.month] = {
        month: budget.month,
        budget: 0,
      };
    }

    acc[budget.month].budget +=
      Number(budget.limitAmount);

    return acc;

  }, {})
);

const remaining =
  monthlyBudget -
  (summary?.totalSpent ?? 0);

const loadData = async () => {
  try {

    const [
      budgetsRes,
      summaryRes,
      expensesRes,
    ] = await Promise.all([
      API.get("/budget"),
      API.get("/budget/summary"),
      API.get("/expenses"),
    ]);

    setBudgets(budgetsRes.data);
    setSummary(summaryRes.data);
    setExpenses(expensesRes.data);

  } catch (error) {
    console.error(
      "Budget Load Error",
      error
    );
  }
};

  const pieData = currentMonthBudgets.map(
  (budget) => ({
    name: budget.category,
    value: budget.limitAmount,
  })
);
const budgetVsExpense =
  currentMonthBudgets.map((budget) => {

    const spent =
      expenses
        .filter(
          (e) =>
            e.category === budget.category
        )
        .reduce(
          (sum, e) =>
            sum + e.amount,
          0
        );

    return {
      category: budget.category,
      budget: budget.limitAmount,
      spent,
    };
});
    const analyticsData =
  currentMonthBudgets.map((budget) => ({
    name: budget.category,
    value: Number(budget.limitAmount),
  }));

const COLORS = [
  "#06b6d4",
  "#8b5cf6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
];

  useEffect(() => {

    loadData();

  }, []);

  const deleteBudget =
    async (id) => {

      try {

        await API.delete(
          `/budget/${id}`
        );

        loadData();

      } catch (error) {

        console.error(error);
      }
    };

    const recommendations = [];

if (remaining < 0) {
  recommendations.push({
    type: "warning",
    text: `You have exceeded your monthly budget by ₹${Math.abs(remaining).toLocaleString()}. Consider reducing discretionary expenses.`,
  });
}

if (summary?.totalSpent > monthlyBudget * 0.8) {
  recommendations.push({
    type: "alert",
    text: "You've already used more than 80% of your monthly budget.",
  });
}

const highestBudgetCategory =
  currentMonthBudgets.length > 0
    ? [...currentMonthBudgets].sort(
        (a, b) => b.limitAmount - a.limitAmount
      )[0]
    : null;

if (highestBudgetCategory) {
  recommendations.push({
    type: "info",
    text: `${highestBudgetCategory.category} has the highest allocation (₹${highestBudgetCategory.limitAmount}).`,
  });
}

if (remaining > monthlyBudget * 0.3) {
  recommendations.push({
    type: "success",
    text: "Great job! You still have more than 30% of your budget remaining.",
  });
}
    
return (
  <div className="flex min-h-screen bg-slate-950 text-white">

    <Sidebar
      isOpen={sidebarOpen}
      setIsOpen={setSidebarOpen}
    />

    <div className="flex-1 lg:ml-72">

    <Navbar
    setSidebarOpen={setSidebarOpen}
    />

    <main className="p-4 sm:p-6 lg:p-8">

    <div className="space-y-8">

      {/* HEADER */}

      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-4xl font-black">
            Budget Management
          </h1>

          <p className="text-slate-400">
            Track and control your spending
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="
          px-5
          py-3
          rounded-xl
          bg-gradient-to-r
        from-blue-600
        to-purple-600

        hover:scale-105
        hover:shadow-[0_0_25px_rgba(139,92,246,0.5)]
          font-semibold
          transition-all
          "
        >
          + Add Budget
        </button>

      </div>

      {/* SUMMARY */}

     <div
  className="
  grid
  grid-cols-2
  xl:grid-cols-4
  gap-6
  "
>
            <SummaryCard
            title={`${currentMonth} Budget`}
            value={`₹${monthlyBudget}`}
            color="cyan"
              icon={<Wallet size={28} className="text-cyan-400" />}
            />
        <SummaryCard
          title="Spent"
          value={`₹${summary?.totalSpent ?? 0}`}
         color="red"
  icon={<TrendingUp size={28} className="text-red-400" />}
        />

       <SummaryCard
  title="Remaining"
  value={`₹${remaining}`}
  color="green"
icon={<PiggyBank size={28} className="text-green-400" />}
/>

        <SummaryCard
          title="Categories"
         value={currentMonthBudgets.length}
          color="purple"
           icon={<Layers size={28} className="text-purple-400" />}
        />

      </div>

      {/* BUDGET CARDS */}
        <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">
            Category Wise Budget
        </h2>

        <div className="h-px flex-1 bg-slate-800 ml-4" />
        </div>
      <div
        className="
       grid
        sm:grid-cols-2
        xl:grid-cols-4
        gap-4
        "
      >

        {currentMonthBudgets.map((budget) => (

          <div
            key={budget.id}
            className="
            bg-slate-900/60
            border border-cyan-500/20
            rounded-3xl
            p-4
            hover:border-cyan-400
            hover:-translate-y-1
            transition-all
            duration-300
            "
          >

            <div className="flex justify-between items-start">

              <div>

                <h3 className="text-xl font-bold">
                  {budget.category}
                </h3>

                <p className="text-slate-400">
                  {budget.month}
                </p>

              </div>
<div className="flex flex-col gap-2 items-end">
  <button
    onClick={() => {
      setForm({
        category: budget.category,
        limitAmount: budget.limitAmount,
        month: budget.month,
      });

      setEditingId(budget.id);
      setShowModal(true);
    }}
    className="
    text-cyan-400
    hover:text-cyan-400
    text-m
    font-medium
    "
  >
    Edit
  </button>

</div>

            </div>

            <div className="mt-5">

              <h2
                className="
                text-4xl
                font-black
                text-cyan-400
                "
              >
                ₹{budget.limitAmount}
              </h2>

            </div>

          </div>

        ))}

      </div>

      {/* ANALYTICS */}
<div className="grid lg:grid-cols-2 gap-6">

  {/* Budget Distribution */}
 <div
  className="
  bg-slate-900/70
  border border-blue-500/30
  rounded-3xl
  p-6
    hover:border-blue-500
    hover:shadow-[0_20px_50px_rgba(59,130,246,0.15)]
  transition-all
  duration-300
  "
>
  <h3 className="text-xl font-bold mb-5">
    Monthly Budget Trend
  </h3>

  <ResponsiveContainer
    width="100%"
    height={300}
  >
    <AreaChart
      data={monthlyTrendData}
    >
      <defs>
        <linearGradient
          id="budgetGradient"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop
            offset="5%"
            stopColor="#06b6d4"
            stopOpacity={0.8}
          />

          <stop
            offset="95%"
            stopColor="#06b6d4"
            stopOpacity={0}
          />
        </linearGradient>
      </defs>

      <CartesianGrid
        stroke="#334155"
        strokeDasharray="4 4"
      />

      <XAxis
        dataKey="month"
        stroke="#94a3b8"
      />

      <YAxis
        stroke="#94a3b8"
      />

      <Tooltip
        contentStyle={{
          backgroundColor:
            "#0f172a",
          border:
            "1px solid #06b6d4",
          borderRadius: "12px",
        }}
      />

      <Area
        type="monotone"
        dataKey="budget"
        stroke="#06b6d4"
        fill="url(#budgetGradient)"
        strokeWidth={3}
        animationDuration={1200}
      />
    </AreaChart>
  </ResponsiveContainer>
</div>

  {/* Budget vs Expense */}
   <div
  className="
  bg-slate-900/70
  border border-blue-500/30
  rounded-3xl
  p-6
    hover:border-blue-500
    hover:shadow-[0_20px_50px_rgba(59,130,246,0.15)]
  transition-all
  duration-300
  "
>
<h3 className="text-lg font-semibold mb-4">
  Budget vs Spending • {new Date().toLocaleString("default", {
    month: "long",
  })}
</h3>
<ResponsiveContainer width="100%" height={300}>
  <BarChart data={budgetVsExpense}>
    <CartesianGrid
  stroke="#334155"
  strokeDasharray="4 4"
/>
<XAxis
  dataKey="category"
  stroke="#94a3b8"
/>

<YAxis
  stroke="#94a3b8"
/>
<Tooltip
  contentStyle={{
    backgroundColor: "#0f172a",
    border: "1px solid #06b6d4",
    borderRadius: "12px",
  }}
/>
    <Legend />

   <Bar
  dataKey="budget"
  fill="#06b6d4"
  radius={[8, 8, 0, 0]}
  animationDuration={1200}
/>

<Bar
  dataKey="spent"
  fill="#8b5cf6"
  radius={[8, 8, 0, 0]}
  animationDuration={1200}
/>
  </BarChart>
</ResponsiveContainer>
  </div>

</div>

      {/* RECOMMENDATIONS */}
<div
  className="
  bg-slate-900/70
  border border-slate-800
  rounded-3xl
  p-6
  hover:border-blue-500/40
  transition-all
  duration-300
  "
>
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-2xl font-bold">
      AI Budget Insights
    </h2>

    <span
      className="
      px-3 py-1
      rounded-full
      text-xs
      bg-cyan-500/10
      text-cyan-400
      border border-cyan-500/20
      "
    >
      Live Analysis
    </span>
  </div>

  <div className="space-y-4">
    {recommendations.length > 0 ? (
      recommendations.map((rec, index) => (
        <div
          key={index}
          className="
          bg-slate-800/60
          border border-slate-700
          rounded-2xl
          p-4
          hover:border-cyan-500/40
          hover:translate-x-1
          transition-all
          duration-300
          "
        >
          <p className="text-slate-200">
            {rec.text}
          </p>
        </div>
      ))
    ) : (
      <div
        className="
        bg-green-500/10
        border border-green-500/20
        rounded-2xl
        p-4
        "
      >
        <p className="text-green-400">
          Your budget is well balanced this month.
        </p>
      </div>
    )}
  </div>
</div>

    </div>

    {/* ADD BUDGET MODAL */}

{showModal && (
  <div
    className="
    fixed inset-0 z-50
    bg-black/80 backdrop-blur-sm
    flex items-center justify-center
    px-4
    "
  >
    <div
      className="
      w-full max-w-lg
      bg-slate-900
      border border-slate-700
      rounded-3xl
      p-8
      shadow-[0_0_60px_rgba(59,130,246,0.15)]
      animate-in fade-in zoom-in
      "
    >
      <h2 className="text-3xl font-black mb-8">
        {editingId ? "Edit Budget" : "Add Budget"}
      </h2>

      {/* CATEGORY */}
      <label className="text-slate-400 text-sm mb-2 block">
        Category
      </label>

      <select
        value={form.category}
        onChange={(e) =>
          setForm({
            ...form,
            category: e.target.value,
          })
        }
        className="
        w-full
        p-4
        rounded-2xl
        bg-slate-800
        border border-slate-700
        focus:border-cyan-500
        focus:outline-none
        transition-all
        mb-5
        "
      >
        <option value="">Select Category</option>
        <option value="Food">Food</option>
        <option value="Transport">Transport</option>
        <option value="Medicine">Medicine</option>
        <option value="Shopping">Shopping</option>
        <option value="Bills">Bills</option>
        <option value="Entertainment">Entertainment</option>
        <option value="Education">Education</option>
        <option value="Travel">Travel</option>
        <option value="Others">Others</option>
      </select>

      {/* AMOUNT */}
      <label className="text-slate-400 text-sm mb-2 block">
        Budget Amount
      </label>

      <input
        type="number"
        value={form.limitAmount}
        onChange={(e) =>
          setForm({
            ...form,
            limitAmount: e.target.value,
          })
        }
        className="
        w-full
        p-4
        rounded-2xl
        bg-slate-800
        border border-slate-700
        focus:border-cyan-500
        focus:outline-none
        transition-all
        mb-5
        "
      />

      {/* MONTH */}
      <label className="text-slate-400 text-sm mb-2 block">
        Month
      </label>

      <input
        value={form.month}
        readOnly
        className="
        w-full
        p-4
        rounded-2xl
        bg-slate-800
        border border-slate-700
        text-slate-400
        cursor-not-allowed
        mb-8
        "
      />

      {/* BUTTONS */}
      <div className="grid grid-cols-3 gap-3">

        <button
          onClick={() => {
  setShowModal(false);

  setEditingId(null);

  setForm({
    category: "",
    limitAmount: "",
    month: currentMonth,
  });
}}
          className="
          py-4
          rounded-2xl
          bg-slate-700
          hover:bg-slate-600
          transition-all
          font-semibold
          "
        >
          Cancel
        </button>

        {editingId && (
          <button
         onClick={() => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this budget? This action cannot be undone."
  );

  if (confirmed) {
    deleteBudget(editingId);
    setShowModal(false);
  }
}}
            className="
            py-4
            rounded-2xl
            bg-red-500/20
            text-red-400
            border border-red-500/30
            hover:bg-red-500/30
            hover:scale-105
            transition-all
            font-semibold
            "
          >
            Delete
          </button>
        )}

        <button
          onClick={handleCreate}
          className="
          py-4
          rounded-2xl
          bg-gradient-to-r
          from-cyan-500
          to-purple-500
          hover:scale-105
          hover:shadow-[0_0_25px_rgba(139,92,246,0.5)]
          transition-all
          font-semibold
          "
        >
          {editingId
            ? "Update Budget"
            : "Add Budget"}
        </button>

      </div>
    </div>
  </div>
)}

    </main>

  </div>

</div>
);
}