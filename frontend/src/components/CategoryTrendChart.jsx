import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#3B82F6",
  "#8B5CF6",
  "#06B6D4",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#EC4899",
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="
        bg-slate-900
        border
        border-slate-700
        rounded-xl
        px-4
        py-3
        shadow-2xl
        "
      >
        <p className="text-white font-semibold mb-1">
          {payload[0].name}
        </p>

        <p className="text-cyan-400 font-bold">
          ₹{payload[0].value.toLocaleString("en-IN")}
        </p>
      </div>
    );
  }

  return null;
};

export default function CategoryTrendChart({
  data = [],
}) {
  const mergedData = Object.values(
    data.reduce((acc, item) => {
      const category = item.category
        ?.trim()
        ?.toLowerCase();

      if (!category) return acc;

      if (!acc[category]) {
        acc[category] = {
          category:
            category.charAt(0).toUpperCase() +
            category.slice(1),
          amount: 0,
        };
      }

      acc[category].amount += Number(
        item.amount || 0
      );

      return acc;
    }, {})
  );

  const total = mergedData.reduce(
    (sum, item) => sum + item.amount,
    0
  );

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
          Category Spending
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
          Distribution
        </span>
      </div>

      {mergedData.length === 0 ? (
        <div
          className="
          h-full

          flex
          items-center
          justify-center

          text-slate-500
          "
        >
          No category expenses found
        </div>
      ) : (
        <div className="w-full h-[calc(100%-55px)]">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <PieChart>
              <Pie
                data={mergedData}
                dataKey="amount"
                nameKey="category"

                innerRadius="45%"
                outerRadius="72%"

                paddingAngle={3}

                label={({ percent }) =>
                  `${(percent * 100).toFixed(0)}%`
                }

                labelLine={false}

                animationDuration={1200}
              >
                {mergedData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={
                      COLORS[
                        index %
                          COLORS.length
                      ]
                    }
                  />
                ))}
              </Pie>

              <Tooltip
                content={<CustomTooltip />}
              />

              <text
                x="50%"
                y="48%"
                textAnchor="middle"
                fill="#ffffff"
                fontSize="18"
                fontWeight="700"
              >
                ₹{total.toLocaleString("en-IN")}
              </text>

              <text
                x="50%"
                y="56%"
                textAnchor="middle"
                fill="#94A3B8"
                fontSize="11"
              >
                Total Spend
              </text>
            </PieChart>
          </ResponsiveContainer>

        </div>
      )}
    </div>
  );
}