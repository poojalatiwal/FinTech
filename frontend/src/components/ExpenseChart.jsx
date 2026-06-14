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

  const formatCurrency = (value) =>
    `₹${value.toLocaleString("en-IN")}`;

  return (
   <div
  className="
  bg-slate-900/70
  border border-slate-800
  rounded-3xl

  p-5

  backdrop-blur-xl

  hover:border-blue-500/60
  hover:shadow-[0_15px_40px_rgba(59,130,246,0.12)]

  transition-all
  duration-300
  "
>
    <div className="flex justify-between items-center mb-6">
    <div>
        <h2    className="
          text-2xl
          font-bold

          bg-gradient-to-r
          from-blue-400
          via-cyan-400
          to-purple-400

          bg-clip-text
          text-transparent
          ">
        Expense Trend
        </h2>
     
    </div>

    <span
  className="
  px-3 py-1

  rounded-full

  bg-blue-500/10
  text-blue-400

  text-xs
  "
>
  Last 6 Months
</span>
    </div>

      <ResponsiveContainer
        width="100%"
        height={400}
      >
        <AreaChart
          data={data}
          margin={{
            top: 20,
            right: 20,
            left: 10,
            bottom: 10,
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
        tickFormatter={(month) => {
            const date = new Date(month + "-01");
            return date.toLocaleString("en-US", {
            month: "short",
            });
        }}
        />

        <YAxis
        axisLine={false}
        tickLine={false}
        stroke="#64748b"
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
                boxShadow:
                "0 10px 30px rgba(59,130,246,.25)",
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
            strokeWidth={4}
            fill="url(#expenseGradient)"
            dot={{
            r: 5,
            fill: "#3B82F6",
            stroke: "#60A5FA",
            strokeWidth: 3,
            }}
            activeDot={{
              r: 8,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}