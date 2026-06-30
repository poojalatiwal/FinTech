import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function ExpenseChart({ data }) {
  return (
    <div
      className="
      h-full
      w-full

      bg-slate-900/70
      backdrop-blur-xl

      border
      border-slate-800

      rounded-3xl

      p-4
      sm:p-5
      lg:p-6

      hover:border-blue-500/60
      hover:shadow-[0_15px_40px_rgba(59,130,246,0.12)]

      transition-all
      duration-300
      "
    >
      {/* Header */}

      <div
        className="
        flex
        items-center
        justify-between

        mb-4
        sm:mb-6
        "
      >
        <h2
          className="
          text-xl
          sm:text-2xl

          font-bold

          bg-gradient-to-r
          from-blue-400
          via-cyan-400
          to-purple-400

          bg-clip-text
          text-transparent
          "
        >
          Expense Trend
        </h2>

        <span
          className="
          text-[10px]
          sm:text-xs

          px-2
          sm:px-3

          py-1

          rounded-full

          bg-blue-500/10
          text-blue-400
          "
        >
          Last 6 Months
        </span>
      </div>

      {/* Chart */}

      <div className="w-full h-[calc(100%-55px)]">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: -15,
              bottom: 5,
            }}
          >
            <defs>
              <linearGradient
                id="expenseGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#3B82F6"
                  stopOpacity={0.8}
                />

                <stop
                  offset="60%"
                  stopColor="#3B82F6"
                  stopOpacity={0.2}
                />

                <stop
                  offset="100%"
                  stopColor="#3B82F6"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              vertical={false}
              stroke="#334155"
              opacity={0.25}
            />

            <XAxis
              dataKey="month"
              stroke="#94a3b8"
              tick={{
                fontSize: 11,
              }}
              tickFormatter={(month) => {
                const date = new Date(month + "-01");
                return date.toLocaleString("en-US", {
                  month: "short",
                });
              }}
            />

            <YAxis
              stroke="#64748b"
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 11,
              }}
              tickFormatter={(value) =>
                `₹${value / 1000}k`
              }
            />

            <Tooltip
              cursor={{
                stroke: "#3B82F6",
                strokeWidth: 1,
              }}
              contentStyle={{
                background: "#020617",
                border: "1px solid #1e40af",
                borderRadius: "14px",
              }}
              formatter={(value) => [
                `₹${Number(value).toLocaleString("en-IN")}`,
                "Expense",
              ]}
            />

            <Area
              type="monotone"
              dataKey="amount"
              stroke="#3B82F6"
              strokeWidth={3}
              fill="url(#expenseGradient)"
              dot={{
                r: 4,
                fill: "#3B82F6",
                stroke: "#60A5FA",
                strokeWidth: 2,
              }}
              activeDot={{
                r: 6,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>

      </div>
    </div>
  );
}