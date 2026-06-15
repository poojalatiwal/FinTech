import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getFinancialProfile,
  updateFinancialProfile
} from "../api/userApi";
import {
  FaWallet,
  FaPiggyBank,
  FaRupeeSign,
  FaMoneyBillWave
} from "react-icons/fa";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import {getFinancialHealth} from "../api/healthApi";
import {getExpenseSummary,getRecentExpenses,getExpenses ,getForecast,getFinancialStability}from "../api/expenseApi";


import { getInsight}from "../api/insightApi";

import {getBudgets}from "../api/budgetApi";

export default function Dashboard() {

  const [dashboard, setDashboard] = useState(null);
  

  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const handleProfileChange =
(e) => {

  setProfileForm({

    ...profileForm,

    [e.target.name]:
      e.target.value

  });

};

const [forecast, setForecast] =
  useState(null);

  const [stability, setStability] = useState(null);

const saveProfile =
async () => {

  try {

   await updateFinancialProfile(
  {
    monthlyIncome:
      Number(profileForm.monthlyIncome),

    loanPayment:
      Number(profileForm.loanPayment),

    investmentAmount:
      Number(profileForm.investmentAmount),

    emergencyFund:
      Number(profileForm.emergencyFund),

    rentOrMortgage:
      Number(profileForm.rentOrMortgage),

    subscriptionServices:
      Number(profileForm.subscriptionServices),

    incomeType:
      Number(profileForm.incomeType),

    budgetGoal:
      Number(profileForm.budgetGoal)
  }
);
    toast.success(
      "Profile Updated Successfully"
    );

    setShowProfileModal(
      false
    );

    loadDashboard();

  } catch (err) {

    toast.error(
      "Unable to Update Profile"
    );

    console.error(err);

  }
};
const [userProfile, setUserProfile] =
  useState(null);

const [profileForm,
  setProfileForm] =
  useState({

    monthlyIncome: 0,

    loanPayment: 0,

    investmentAmount: 0,

    emergencyFund: 0,

    rentOrMortgage: 0,

    subscriptionServices: 0,

    incomeType: 0,

    budgetGoal: 0

  });

  const alerts = [];

if (dashboard?.budgetUsage > 80) {
  alerts.push({
    title: "Budget Warning",
    message: "You are nearing your monthly budget.",
    level: "HIGH"
  });
}

if (dashboard?.savings < dashboard?.monthlyIncome * 0.2) {
  alerts.push({
    title: "Low Savings",
    message: "Savings are below 20% of income.",
    level: "MEDIUM"
  });
}

if ((userProfile?.emergencyFund ?? 0) < dashboard?.monthlyIncome * 3) {
  alerts.push({
    title: "Emergency Fund",
    message: "Build at least 3 months of income as emergency fund.",
    level: "LOW"
  });
}

const calculateProfileCompletion =
() => {

  if (!userProfile)
    return 0;

  const checks = [

    Number(userProfile.monthlyIncome) > 0,

    Number(userProfile.loanPayment) > 0,

    Number(userProfile.investmentAmount) > 0,

    Number(userProfile.emergencyFund) > 0,

    Number(userProfile.rentOrMortgage) > 0,

    Number(userProfile.subscriptionServices) > 0,

    Number(userProfile.budgetGoal) > 0,

    userProfile.incomeType !== null &&
    userProfile.incomeType !== undefined

  ];

  const completed =
    checks.filter(Boolean).length;

  return Math.round(
    (completed / checks.length) * 100
  );
};

const profileCompletion =
  calculateProfileCompletion();

useEffect(() => {

  const token =
    localStorage.getItem("token");

  if (!token) {
    navigate("/login");
    return;
  }

  loadDashboard();

}, []);

 const loadDashboard = async () => {
  try {

const [
  summaryRes,
  recentRes,
  budgetRes,
  insightRes,
  profileRes,
  expenseRes,
  healthRes,
      forecastRes
] = await Promise.all([
  getExpenseSummary(),
  getRecentExpenses(),
  getBudgets(),
  getInsight(),
  getFinancialProfile(),
  getExpenses(),
  getFinancialHealth(),
    getForecast()
]);

    console.log("Summary:", summaryRes.data);
    console.log("Recent:", recentRes.data);
    console.log("Budget:", budgetRes.data);
    console.log("Insight:", insightRes.data);
    console.log("Profile:", profileRes.data);

    setUserProfile(profileRes.data);

    setProfileForm({
      monthlyIncome:
        profileRes.data.monthlyIncome || 0,

      loanPayment:
        profileRes.data.loanPayment || 0,

      investmentAmount:
        profileRes.data.investmentAmount || 0,

      emergencyFund:
        profileRes.data.emergencyFund || 0,

      rentOrMortgage:
        profileRes.data.rentOrMortgage || 0,

      subscriptionServices:
        profileRes.data.subscriptionServices || 0,

      incomeType:
        profileRes.data.incomeType || 0,

      budgetGoal:
        profileRes.data.budgetGoal || 0
    });

   const totalExpenses =
  summaryRes.data?.total ?? 0;

  const currentMonthExpense =
  expenseRes.data
    .filter((expense) => {

      const expenseDate =
        new Date(expense.date);

      const now =
        new Date();

      return (
        expenseDate.getMonth() ===
          now.getMonth() &&
        expenseDate.getFullYear() ===
          now.getFullYear()
      );

    })
    .reduce(
      (sum, expense) =>
        sum + Number(expense.amount),
      0
    );

const monthlyIncome =
  profileRes.data?.monthlyIncome ?? 0;

const budgetGoal =
  profileRes.data?.budgetGoal ?? 0;

const budgetUsage =
  budgetGoal > 0
    ? (currentMonthExpense / budgetGoal) * 100
    : 0;

let budgetStatus = "Safe";

if (budgetUsage >= 100) {
  budgetStatus = "Exceeded";
}
else if (budgetUsage >= 80) {
  budgetStatus = "Warning";
}

setDashboard({

  monthlyIncome:
    profileRes.data?.monthlyIncome ?? 0,

  totalExpenses,

  currentMonthExpense,

  savings:
    Math.max(
      (profileRes.data?.monthlyIncome ?? 0)
      - currentMonthExpense,
      0
    ),

  budgetGoal:
    profileRes.data?.budgetGoal ?? 0,

  recentExpenses:
    recentRes.data ?? [],

  insight:
    insightRes.data ?? null,

  financialScore:
    healthRes.data.score,

  healthStatus:
    healthRes.data.status,

  healthAdvice:
    healthRes.data.advice,

  budgetUsage,
  budgetStatus

});

  } catch (err) {

    console.error(
      "Dashboard Load Error:",
      err
    );

  } finally {

    setLoading(false);

  }
};
  if (loading) {

    return (

      <div
        className="
        min-h-screen
        bg-slate-950
        flex
        items-center
        justify-center
        text-white
        "
      >

        <div className="text-center">

          <div
            className="
            w-12
            h-12
            border-4
            border-blue-500
            border-t-transparent
            rounded-full
            animate-spin
            mx-auto
            "
          />

          <p className="mt-4 text-slate-400">
            Loading FinSight...
          </p>

        </div>

      </div>

    );
  }

const stats = [

  {
    title: "Monthly Income",
    value: `₹${dashboard?.monthlyIncome ?? 0}`,
    icon: <FaMoneyBillWave />,
    color: "text-green-400"
  },

 {
  title: "Monthly Expense",
  value: `₹${(
    dashboard?.currentMonthExpense ?? 0
  ).toLocaleString()}`,
  icon: <FaWallet />,
  color: "text-red-400"
},

  {
    title: "Savings",
    value: `₹${dashboard?.savings ?? 0}`,
    icon: <FaPiggyBank />,
    color: "text-blue-400"
  },

  {
    title: "Budget Goal",
    value: `₹${dashboard?.budgetGoal ?? 0}`,
    icon: <FaRupeeSign />,
    color: "text-yellow-400"
  }

];

  return (
  <div className="flex min-h-screen bg-slate-950 text-white">

    {/* SIDEBAR */}
    <Sidebar
      isOpen={sidebarOpen}
      setIsOpen={setSidebarOpen}
    />

    {/* CONTENT */}
    <div
      className="
      flex-1
      lg:ml-72
      w-full
      "
    >

      <Navbar
        setSidebarOpen={setSidebarOpen}
      />

      <main className="p-4 sm:p-6 lg:p-8">

        {/* HEADER */}

        <div
          className="
          flex
          flex-col
          xl:flex-row
          xl:items-center
          lg:justify-between
          gap-4
          mb-8
          "
        >

          <div>

            <h1
              className="
              text-3xl
              sm:text-4xl
              font-bold

              bg-gradient-to-r
              from-blue-400
              via-indigo-400
              to-purple-400

              bg-clip-text
              text-transparent
              "
            >
              Welcome Back 👋
            </h1>

            <p className="text-slate-400 mt-2">
              AI Powered Financial Intelligence
            </p>

          </div>

      <div
        className="
        bg-slate-900/60
        border
        border-slate-800
        rounded-2xl
        p-4
      w-full
      lg:w-[280px]
        backdrop-blur-xl
        "
      >

  <div className="flex justify-between items-center">

    <div>

      <p className="text-xs text-slate-400">
        AI Analysis Readiness
      </p>

      <h3 className="text-xl font-bold text-blue-400">
        {profileCompletion}%
      </h3>

    </div>

    <button
      onClick={() =>
        setShowProfileModal(true)
      }
      className="
      px-3
      py-1.5
      text-sm
      rounded-lg

      bg-gradient-to-r
      from-blue-600
      to-purple-600
      "
    >
      Complete
    </button>

  </div>

  <div
    className="
    mt-3
    h-2
    bg-slate-800
    rounded-full
    "
  >

    <div
      className="
      h-2
      rounded-full

      bg-gradient-to-r
      from-blue-500
      to-purple-500
      "
      style={{
        width: `${profileCompletion}%`
      }}
    />

  </div>

</div>

        </div>

        {/* CARDS */}

        <div
          className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-4
          gap-6
          "
        >

          {stats.map((item, index) => (

            <div
              key={index}
              className="
              group

              bg-slate-900/60

              backdrop-blur-xl

              border
              border-slate-800

              rounded-3xl

              p-6

              hover:border-blue-500

              hover:scale-[1.02]

              hover:-translate-y-1

              hover:shadow-[0_20px_50px_rgba(59,130,246,0.15)]

              transition-all
              duration-300
              "
            >

              <div
                className={`
                text-4xl
                mb-4
                ${item.color}

                group-hover:scale-110

                transition-all
                `}
              >
                {item.icon}
              </div>

              <p className="text-slate-400">
                {item.title}
              </p>

              <h2
                className="
                text-3xl
                font-bold
                mt-2
                "
              >
                {item.value}
              </h2>

            </div>

          ))}

        </div>

{/* CHART + RIGHT SIDEBAR */}

{/* ROW 2 */}

<div
 className="
 grid
 grid-cols-1
 lg:grid-cols-2
 xl:grid-cols-3
 gap-6
 mt-6
 "
>

  {/* EXPENSE TREND */}

  {/* RIGHT COLUMN */}

  <div className="space-y-6">

    {/* AI INSIGHT */}

    <div
  className="
  bg-slate-900/60
  backdrop-blur-xl
  border border-slate-800
  rounded-3xl

  p-4
  min-h-[220px]

  hover:border-blue-500/50
  transition-all
  "
>

      {/* HEADER */}

<div className="flex items-center justify-between">

  <h3
    className="
    text-lg
    font-bold
    text-white
    "
  >
    AI Financial Insight
  </h3>

  <span
    className={`
      px-3
      py-1

      rounded-full

      text-xs
      font-semibold

      ${
        (dashboard?.financialScore ?? 0) >= 80
          ? "bg-green-500/20 text-green-400"
          : (dashboard?.financialScore ?? 0) >= 60
          ? "bg-yellow-500/20 text-yellow-400"
          : "bg-red-500/20 text-red-400"
      }
    `}
  >
    {(dashboard?.financialScore ?? 0) >= 80
      ? "Excellent"
      : (dashboard?.financialScore ?? 0) >= 60
      ? "Good"
      : (dashboard?.financialScore ?? 0) >= 40
      ? "Warning"
      : "Critical"}
  </span>

</div>

{/* SCORE */}

<div className="mt-4 text-center">

  <div
    className="
    text-6xl
    font-black

    bg-gradient-to-r
    from-blue-400
    via-cyan-400
    to-purple-400

    bg-clip-text
    text-transparent
    "
  >
    {dashboard?.financialScore ?? 0}
  </div>

  <p
    className="
    text-slate-400
    text-sm
    mt-2
    "
  >
    Financial Health Score
  </p>

</div>
      {/* RECOMMENDATION */}

    <div
  className="
  mt-5
  bg-slate-800/40
  border
  border-slate-700
  rounded-xl
  p-3
  "
>

  <p
    className="
    text-xs
    uppercase
    text-blue-400
    mb-2
    "
  >
    AI Recommendation
  </p>

  <p
    className="
    text-sm
    text-slate-300
    "
  >
    {dashboard?.financialScore >= 90
      ? "Excellent financial discipline. Continue investing and maintaining your savings habit."
      : dashboard?.financialScore >= 75
      ? "Your finances are healthy. Focus on increasing emergency savings and long-term investments."
      : dashboard?.financialScore >= 60
      ? "You're doing well, but reducing discretionary spending could improve your financial stability."
      : dashboard?.financialScore >= 40
      ? "Your financial health needs attention. Review monthly expenses and create stricter budgets."
      : "High financial risk detected. Reduce unnecessary spending, pay down debt, and increase savings immediately."}
  </p>

</div>
</div>

    {/* BUDGET STATUS */}
<div
  className={`
    backdrop-blur-xl

    rounded-3xl
    p-4

    min-h-[180px]

    border

    transition-all
    duration-300

    ${
      dashboard?.budgetStatus === "Exceeded"
        ? `
          bg-red-950/10
          border-red-500/40
          hover:border-red-500
          hover:shadow-[0_0_30px_rgba(239,68,68,0.25)]
        `
        : dashboard?.budgetStatus === "Warning"
        ? `
          bg-yellow-950/10
          border-yellow-500/40
          hover:border-yellow-500
          hover:shadow-[0_0_30px_rgba(234,179,8,0.25)]
        `
        : `
          bg-green-950/10
          border-green-500/40
          hover:border-green-500
          hover:shadow-[0_0_30px_rgba(34,197,94,0.25)]
        `
    }

    hover:-translate-y-1
  `}
>

      <div className="flex items-center justify-between">

        <h3
          className="
          text-base
          font-bold
          "
        >
          Budget Status
        </h3>

        <span
          className={`
          px-3
          py-1

          rounded-full

          text-xs
          font-semibold

          ${
            dashboard?.budgetStatus === "Exceeded"
              ? "bg-red-500/20 text-red-400"
              : dashboard?.budgetStatus === "Warning"
              ? "bg-yellow-500/20 text-yellow-400"
              : "bg-green-500/20 text-green-400"
          }
          `}
        >
          {dashboard?.budgetStatus}
        </span>

      </div>

      <p
        className="
        text-slate-400
        text-sm
        mt-4
        "
      >
        Monthly Budget Usage
      </p>

      <div
        className="
        flex
        justify-between

        mt-2
        mb-3
        "
      >

        <span className="font-semibold">
          ₹{(dashboard?.currentMonthExpense ?? 0).toLocaleString()}
        </span>

        <span className="text-slate-400">
          ₹{(dashboard?.budgetGoal ?? 0).toLocaleString()}
        </span>

      </div>

      <div
        className="
        h-3
        bg-slate-800
        rounded-full
        overflow-hidden
        "
      >

        <div
          className={`
          h-full

          ${
            dashboard?.budgetStatus === "Exceeded"
              ? "bg-red-500"
              : dashboard?.budgetStatus === "Warning"
              ? "bg-yellow-500"
              : "bg-green-500"
          }
          `}
          style={{
            width: `${Math.min(
              dashboard?.budgetUsage || 0,
              100
            )}%`
          }}
        />

      </div>

      <p
        className="
        mt-4
        text-sm
        text-slate-300
        "
      >
        {
          dashboard?.budgetStatus === "Exceeded"
            ? "You have exceeded your monthly budget."
            : dashboard?.budgetStatus === "Warning"
            ? "You're close to reaching your budget limit."
            : "Your spending is within budget."
        }
      </p>

    </div>

  </div>
{/* FINANCIAL PROFILE */}

<div
  className="
  bg-slate-900/60
  backdrop-blur-xl
  border border-slate-800
  rounded-3xl
  p-5

  hover:border-blue-500/40
  transition-all
  "
>

  {/* HEADER */}

  <div className="flex justify-between items-start mb-6">

    <div>

      <h3 className="text-xl font-bold text-white">
        Financial Profile
      </h3>

      <p className="text-slate-400 text-sm mt-1">
        Complete your profile for smarter AI insights
      </p>

    </div>

    <button
      onClick={() => setShowProfileModal(true)}
      className="
      px-4 py-2
      rounded-xl

      bg-gradient-to-r
      from-blue-600
      to-purple-600

      text-white
      font-medium

      hover:scale-105
      transition-all
      "
    >
      Edit
    </button>

  </div>

  {/* VALUES */}

  <div className="space-y-3">

    <div
      onClick={() => setShowProfileModal(true)}
      className="
      flex
      items-center
      justify-between

      p-4

      rounded-2xl

      bg-cyan-500/10
      border border-cyan-500/20

      hover:border-cyan-400
      transition-all

      cursor-pointer
      "
    >
      <span className="text-cyan-300">
        Emergency Fund
      </span>

      <span className="text-xl font-bold text-cyan-400">
        ₹{(userProfile?.emergencyFund ?? 0).toLocaleString()}
      </span>
    </div>

    <div
      onClick={() => setShowProfileModal(true)}
      className="
      flex
      items-center
      justify-between

      p-4

      rounded-2xl

      bg-green-500/10
      border border-green-500/20

      hover:border-green-400
      transition-all

      cursor-pointer
      "
    >
      <span className="text-green-300">
        Investments
      </span>

      <span className="text-xl font-bold text-green-400">
        ₹{(userProfile?.investmentAmount ?? 0).toLocaleString()}
      </span>
    </div>

    <div
      onClick={() => setShowProfileModal(true)}
      className="
      flex
      items-center
      justify-between

      p-4

      rounded-2xl

      bg-red-500/10
      border border-red-500/20

      hover:border-red-400
      transition-all

      cursor-pointer
      "
    >
      <span className="text-red-300">
        Loan Payment
      </span>

      <span className="text-xl font-bold text-red-400">
        ₹{(userProfile?.loanPayment ?? 0).toLocaleString()}
      </span>
    </div>

  <div
      onClick={() => setShowProfileModal(true)}
      className="
      flex
      items-center
      justify-between

      p-4

      rounded-2xl

      bg-yellow-500/10
      border border-yellow-500/20

      hover:border-yellow-400
      transition-all

      cursor-pointer
      "
    >
      <span className="text-red-300">
        Rent
      </span>

      <span className="text-xl font-bold text-yellow-400">
        ₹{(userProfile?.rentOrMortgage ?? 0).toLocaleString()}
      </span>
    </div>
    <div
      onClick={() => setShowProfileModal(true)}
      className="
      flex
      items-center
      justify-between

      p-4

      rounded-2xl

      bg-purple-500/10
      border border-purple-500/20

      hover:border-purple-400
      transition-all

      cursor-pointer
      "
    >
      <span className="text-purple-300">
        Subscriptions
      </span>

      <span className="text-xl font-bold text-purple-400">
        {userProfile?.subscriptionServices ?? 0}
      </span>
    </div>

  </div>

</div>
{/* ROW */}
{/* FORECAST + STABILITY */}

<div
  className="
  flex
  flex-col
  gap-6
  "
>

  {/* FORECAST */}

  <div
    className="
    bg-slate-900/60
    backdrop-blur-xl
    border border-purple-500/20
    rounded-3xl
    p-5

    hover:border-purple-400
    hover:-translate-y-1
    hover:shadow-[0_10px_30px_rgba(168,85,247,0.15)]

    transition-all
    duration-300
    "
  >

    <div className="flex items-center justify-between">

      <h3 className="text-lg font-bold text-white">
        Forecast
      </h3>

      <span
        className="
        bg-purple-500/20
        text-purple-400
        px-3
        py-1
        rounded-full
        text-xs
        font-medium
        "
      >
        Next Month
      </span>

    </div>

    <div className="mt-6">

      <h2
        className="
        text-4xl
        font-black
        text-purple-400
        "
      >
        ₹{(forecast?.predictedExpense ?? 0).toLocaleString()}
      </h2>

      <p className="text-slate-400 mt-2">
        Predicted Expense
      </p>

    </div>

    <div
      className="
      mt-5
      rounded-xl
      bg-purple-500/10
      border border-purple-500/20
      p-3
      "
    >

      <p
        className="
        text-sm
        text-slate-300
        leading-relaxed
        "
      >
        {forecast?.message ||
          "Forecast unavailable. Add more expense history to generate predictions."}
      </p>

    </div>

  </div>

  {/* FINANCIAL STABILITY */}

  <div
    className="
    bg-slate-900/60
    backdrop-blur-xl
    border border-cyan-500/20
    rounded-3xl
    p-5

    hover:border-cyan-400
    hover:-translate-y-1
    hover:shadow-[0_10px_30px_rgba(34,211,238,0.15)]

    transition-all
    duration-300
    "
  >

    <div className="flex items-center justify-between">

      <h3 className="text-lg font-bold text-white">
        Financial Stability
      </h3>

      <span
        className="
        bg-cyan-500/20
        text-cyan-400
        px-3
        py-1
        rounded-full
        text-xs
        font-medium
        "
      >
        Score
      </span>

    </div>

    <div className="mt-6 text-center">

      <h2
        className="
        text-5xl
        font-black
        text-cyan-400
        "
      >
        {stability?.score ?? 0}
      </h2>

      <p className="text-slate-400 mt-2">
        Stability Index
      </p>

    </div>

    <div className="mt-6">

      <div
        className="
        h-3
        bg-slate-800
        rounded-full
        overflow-hidden
        "
      >

        <div
          className="
          h-full
          bg-cyan-400
          "
          style={{
            width: `${stability?.score ?? 0}%`
          }}
        />

      </div>

      <p
        className="
        mt-4
        text-sm
        text-slate-300
        "
      >
        {stability?.message ||
          "Financial stability analysis unavailable."}
      </p>

    </div>

  </div>

</div>
<div
className="
mt-6

bg-slate-900/60
border border-red-500/20

rounded-3xl
p-6
"
>

<h3
className="
text-xl
font-bold
mb-5
"
>
Smart Alerts
</h3>

<div className="space-y-4">

{alerts.map((alert,index)=>(

<div
key={index}
className="
flex
items-center
justify-between

bg-slate-800/50

rounded-xl
p-4

hover:bg-slate-800
transition-all
"
>

<div>

<p className="font-medium">
{alert.title}
</p>

<p
className="
text-sm
text-slate-400
"
>
{alert.message}
</p>

</div>

<span
className={`
px-3
py-1

rounded-full
text-xs

${
alert.level === "HIGH"
? "bg-red-500/20 text-red-400"
: alert.level === "MEDIUM"
? "bg-yellow-500/20 text-yellow-400"
: "bg-green-500/20 text-green-400"
}
`}
>
{alert.level}
</span>

</div>

))}

</div>

</div>
</div>


      </main>

      {showProfileModal && (

        <div
          className="
          fixed
          inset-0

          bg-black/70

          flex
          items-center
          justify-center

          z-50

          p-4
          "
        >

          <div
            className="
            w-full
            max-w-3xl

            bg-slate-900

            border
            border-slate-800

            rounded-3xl

            p-8
            "
          >

            <h2
              className="
              text-3xl
              font-bold

              mb-6

              bg-gradient-to-r
              from-blue-400
              to-purple-400

              bg-clip-text
              text-transparent
              "
            >
              Complete Financial Profile
            </h2>

           <div
          className="
          grid
          grid-cols-1
          xl:grid-cols-[2fr_0.9fr]
          gap-6
          mt-3
          "
          >

                        <div className="space-y-2">
            <label className="text-sm text-slate-400">
                Monthly Income
            </label>

            <input
                type="number"
                name="monthlyIncome"
                value={profileForm.monthlyIncome}
                onChange={handleProfileChange}
                className="
                w-full
                bg-slate-800
                border border-slate-700
                p-3
                rounded-xl
                text-white
                "
            />
            </div>

            <div className="space-y-2">
            <label className="text-sm text-slate-400">
                Loan Payment
            </label>

            <input
                type="number"
                name="loanPayment"
                value={profileForm.loanPayment}
                onChange={handleProfileChange}
                className="
                w-full
                bg-slate-800
                border border-slate-700
                p-3
                rounded-xl
                text-white
                "
            />
            </div>

            <div className="space-y-2">
            <label className="text-sm text-slate-400">
                Investment Amount
            </label>

            <input
                type="number"
                name="investmentAmount"
                value={profileForm.investmentAmount}
                onChange={handleProfileChange}
                className="
                w-full
                bg-slate-800
                border border-slate-700
                p-3
                rounded-xl
                text-white
                "
            />
            </div>

            <div className="space-y-2">
            <label className="text-sm text-slate-400">
                Emergency Fund
            </label>

            <input
                type="number"
                name="emergencyFund"
                value={profileForm.emergencyFund}
                onChange={handleProfileChange}
                className="
                w-full
                bg-slate-800
                border border-slate-700
                p-3
                rounded-xl
                text-white
                "
            />
            </div>

            <div className="space-y-2">
            <label className="text-sm text-slate-400">
                Rent / Mortgage
            </label>

            <input
                type="number"
                name="rentOrMortgage"
                value={profileForm.rentOrMortgage}
                onChange={handleProfileChange}
                className="
                w-full
                bg-slate-800
                border border-slate-700
                p-3
                rounded-xl
                text-white
                "
            />
            </div>

            <div className="space-y-2">
            <label className="text-sm text-slate-400">
                Subscription Services
            </label>

            <input
                type="number"
                name="subscriptionServices"
                value={profileForm.subscriptionServices}
                onChange={handleProfileChange}
                className="
                w-full
                bg-slate-800
                border border-slate-700
                p-3
                rounded-xl
                text-white
                "
            />
            </div>

            <div className="space-y-2">
            <label className="text-sm text-slate-400">
                Budget Goal
            </label>

            <input
                type="number"
                name="budgetGoal"
                value={profileForm.budgetGoal}
                onChange={handleProfileChange}
                className="
                w-full
                bg-slate-800
                border border-slate-700
                p-3
                rounded-xl
                text-white
                "
            />
            </div>

            <div className="space-y-2">
            <label className="text-sm text-slate-400">
                Income Type
            </label>

            <select
                name="incomeType"
                value={profileForm.incomeType}
                onChange={handleProfileChange}
                className="
                w-full
                bg-slate-800
                border border-slate-700
                p-3
                rounded-xl
                text-white
                "
            >
                <option value={0}>Salaried</option>
                <option value={1}>Business</option>
                <option value={2}>Freelance</option>
            </select>
            </div>
            </div>

            <div
              className="
              flex
              justify-end

              gap-3

              mt-8
              "
            >

              <button
                onClick={() =>
                  setShowProfileModal(false)
                }
                className="
                px-5
                py-2

                rounded-xl

                bg-slate-700
                "
              >
                Cancel
              </button>

              <button
                onClick={saveProfile}
                className="
                px-5
                py-2
                rounded-xl

                bg-gradient-to-r
                from-blue-600
                to-purple-600
                "
                >
                Save Profile
                </button>

            </div>

          </div>

        </div>

      )}

    </div>

  </div>
);
}