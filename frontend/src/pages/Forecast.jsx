import {
  FaChartLine,
  FaLightbulb,
  FaShieldAlt,
  FaExclamationTriangle,
  FaBullseye,
  FaArrowDown,
  FaArrowUp
} from "react-icons/fa";

import { FaArrowTrendUp } from "react-icons/fa6";

import {
  useEffect,
  useState
} from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import forecastGraph from "./images/forecast-graph.png";
import {
  getForecast
} from "../api/expenseApi";

import {
  getFraudAlerts
} from "../api/fraudApi";

import {
  getAnomalies
} from "../api/anomalyApi";

export default function Forecast() {

  const [forecast, setForecast] =
    useState(null);

  const [fraudCount,
    setFraudCount] =
    useState(0);

  const [anomalyCount,
    setAnomalyCount] =
    useState(0);

  const [loading,
    setLoading] =
    useState(true);

  useEffect(() => {

    loadData();

  }, []);

const loadData = async () => {
  try {
    setLoading(true);

    const [
      forecastData,
      fraudData,
      anomalyData
    ] = await Promise.all([
      getForecast(),
      getFraudAlerts(),
      getAnomalies()
    ]);

    setForecast(forecastData);

    setFraudCount(
      Array.isArray(fraudData) ? fraudData.length : 0
    );

    setAnomalyCount(
      Array.isArray(anomalyData) ? anomalyData.length : 0
    );

  } catch (err) {
    console.log(err);

    setFraudCount(0);
    setAnomalyCount(0);

  } finally {
    setLoading(false);
  }
};

  return (

    <div className="flex min-h-screen bg-[#020617]">

      <Sidebar />

      <div className="flex-1 lg:ml-72">

        <Navbar />

        <main className="p-6 md:p-8">

          {/* HEADER */}

          <div className="mb-8">

            <h1
              className="
              text-4xl
              font-black
              text-white
              "
            >
              Expense Forecast
            </h1>

            <p className="text-slate-400 mt-2">
              AI-powered future spending prediction
            </p>

          </div>

          

          {/* TOP CARDS */}

          <div
            className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-5
            gap-6
            "
          >

            {/* Predicted Expense */}

            <div
              className="
              bg-slate-900/60
              border
              border-purple-500/20
              rounded-3xl
             p-6
              flex
              flex-col
              justify-between
              "
            >

              <FaChartLine
                className="
                text-purple-400
                text-3xl
                "
              />

              <p className="text-slate-400 mt-4">
                Predicted Expense
              </p>

<h2 className="text-3xl font-black text-purple-400 mt-2">

₹{
    forecast
      ? forecast.predictedExpense.toLocaleString("en-IN", {
          maximumFractionDigits: 0,
        })
      : "0"
}

</h2>

<p className="text-slate-400 mt-3">
Next 30 Days
</p>

            </div>

            {/* Trend */}

            <div
              className="
              bg-slate-900/60
              border
              border-cyan-500/20
              rounded-3xl
              p-6
              "
            >

              <FaArrowTrendUp
                className="
                text-cyan-400
                text-3xl
                "
              />

              <p className="text-slate-400 mt-4">
                Spending Trend
              </p>

                            <h2
              className={`text-3xl font-black mt-2 ${
              (forecast?.spendingTrend ?? 0) < 0
              ? "text-green-400"
              : "text-red-400"
              }`}
              >
              {forecast?.spendingTrend ?? 0}%
              </h2>
              <p className="text-slate-400 mt-3">
              vs This Month
              </p>
            </div>

            {/* Accuracy */}

       <div
        className="
        bg-slate-900/60
        border
        border-green-500/20
        rounded-3xl
        p-6
        "
        >

        <FaBullseye
        className="
        text-green-400
        text-3xl
        "
        />

        <p className="text-slate-400 mt-4">
        Forecast Accuracy
        </p>

      <h2
      className="
      text-3xl
      font-black
      text-green-400
      mt-2
      "
      >
      {forecast?.forecastAccuracy ?? 0}%
      </h2>

      <p className="text-slate-400 mt-3">
      Model Confidence
      </p>

        </div>

            {/* Fraud */}
        <div
          className="
          bg-slate-900/60
          border
          border-red-500/20
          rounded-3xl
          p-6
          "
        >
          <FaShieldAlt
            className="
            text-red-400
            text-3xl
            "
          />

          <p className="text-slate-400 mt-4">
            Fraud Alerts
          </p>

          <h2 className="text-3xl font-black text-red-400 mt-2">
            {fraudCount ?? 0}
          </h2>

          <p className="text-slate-400 mt-3">
            {fraudCount > 0 ? `${fraudCount} Alert(s)` : "No Alerts"}
          </p>
        </div>

            {/* Anomalies */}

        <div
          className="
          bg-slate-900/60
          border
          border-yellow-500/20
          rounded-3xl
          p-6
          "
        >
          <FaExclamationTriangle
            className="
            text-yellow-400
            text-3xl
            "
          />

          <p className="text-slate-400 mt-4">
            Anomalies
          </p>

          <h2 className="text-3xl font-black text-yellow-400 mt-2">
            {anomalyCount ?? 0}
          </h2>

          <p className="text-slate-400 mt-3">
            {anomalyCount > 0 ? `${anomalyCount} Found` : "No Anomalies"}
          </p>
        </div>

          </div>

{/* AI ANALYSIS */}
<div className="mt-8 bg-slate-900/60 border border-slate-700/50 rounded-3xl p-8 flex items-center justify-between gap-8">
  
  <div className="flex-1">
    <div className="flex items-center gap-4 mb-5">
      <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
        <FaLightbulb className="text-yellow-400 text-xl" />
      </div>
      <h2 className="text-2xl font-bold text-white">AI Forecast Analysis</h2>
    </div>

    <p className="text-white text-xl font-semibold leading-8">
      {forecast?.message}
    </p>

    <p className="mt-4 text-slate-400 leading-7 text-base">
      {forecast?.forecastExplanation}
    </p>
  </div>

<img
  src={forecastGraph}
  alt="Forecast"
  className="w-64 hidden md:block flex-shrink-0"
/>
</div>


{/* SPENDING TREND ANALYSIS */}
<div className="mt-8 bg-slate-900/60 border border-slate-700/50 rounded-3xl p-8 grid lg:grid-cols-2 gap-0">

  {/* Left */}
  <div className="lg:pr-10">
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
        <FaArrowTrendUp className="text-cyan-400 text-lg" />
      </div>
      <h2 className="text-2xl font-bold text-white">Spending Trend Analysis</h2>
    </div>

    <div className="bg-slate-800/60 border border-slate-700/40 rounded-2xl p-6 flex gap-4 items-start">
      <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 mt-1">
        <FaArrowDown className="text-cyan-400 text-sm" />
      </div>
      <div>
        <p className="text-white text-lg font-semibold leading-7">
          {forecast?.trendReason}
        </p>
        <p className="text-slate-400 mt-3 text-sm leading-6">
          {forecast?.trendExplanation}
        </p>
      </div>
    </div>
  </div>

  {/* Right */}
  <div className="lg:pl-10 lg:border-l border-slate-700 mt-8 lg:mt-0">
    <h3 className="text-cyan-400 text-xl font-bold mb-6">What This Means</h3>

    <div className="space-y-6">

      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-slate-300 text-base">
          <span className="text-white font-semibold">Positive Outlook:</span>{" "}
          You are likely to spend less next month.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center flex-shrink-0">
          <FaArrowTrendUp className="text-cyan-400 text-lg" />
        </div>
        <p className="text-slate-300 text-base">
          <span className="text-white font-semibold">Keep It Up:</span>{" "}
          Continue your good spending habits.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center flex-shrink-0">
          <FaShieldAlt className="text-purple-400 text-lg" />
        </div>
        <p className="text-slate-300 text-base">
          <span className="text-white font-semibold">Stay Aware:</span>{" "}
          Monitor major expenses to stay on track.
        </p>
      </div>

    </div>
  </div>

</div>

          {/* Forecast Graph Placeholder */}

          <div
            className="
            mt-8

            bg-slate-900/60
            border
            border-cyan-500/20

            rounded-3xl
            p-8
            "
          >

            <h2
              className="
              text-2xl
              font-bold
              text-white
              mb-6
              "
            >
              Expense Trend Forecast
            </h2>

            <div
              className="
              h-80

              rounded-2xl

              bg-slate-800/40

              flex
              items-center
              justify-center

              text-slate-500
              "
            >
              Forecast Chart Here
            </div>

          </div>

        </main>

      </div>

    </div>

  );

}