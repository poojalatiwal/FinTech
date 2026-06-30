import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  AreaChart,
  ReferenceLine
} from "recharts";

const CustomTooltip = ({
  active,
  payload
}) => {

  if (
    active &&
    payload &&
    payload.length
  ) {

    return (

      <div
        className="
        bg-slate-900
        border
        border-blue-500/30
        rounded-2xl
        px-4
        py-3
        shadow-2xl
        "
      >

        <p className="text-blue-400 font-semibold mb-1">
          {payload[0].payload.month}
        </p>

        <p className="text-white">
          Saved :
          <span className="ml-2 text-emerald-400 font-semibold">
            ₹{Number(payload[0].value).toLocaleString("en-IN")}
          </span>
        </p>

      </div>

    );

  }

  return null;

};

export default function GoalProgressChart({

  data = [],

  targetAmount = 0

}) {

  return (

<div
className="
h-full

bg-slate-900/70
backdrop-blur-xl

border
border-slate-800

rounded-3xl

p-4
sm:p-6

hover:border-blue-500/50
hover:shadow-[0_15px_40px_rgba(59,130,246,0.18)]

transition-all
duration-300
"
>

{/* HEADER */}

<div
className="
flex
flex-col
sm:flex-row

justify-between
items-start
sm:items-center

gap-3

mb-6
"
>

<div>

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
Goal Progress
</h2>

<p
className="
text-slate-400
text-sm
mt-1
"
>
Savings growth over time
</p>

</div>

<div
className="
px-3
py-1.5

rounded-full

bg-blue-500/10

text-blue-400

text-xs
font-semibold
"
>

Target :
₹{targetAmount.toLocaleString("en-IN")}

</div>

</div>

{/* CHART */}

<div className="h-[260px] sm:h-[360px] lg:h-[420px]">

<ResponsiveContainer
width="100%"
height="100%"
>

<AreaChart

data={data}

margin={{

top:20,

right:15,

left:0,

bottom:0

}}

>

<defs>

<linearGradient

id="goalGradient"

x1="0"

y1="0"

x2="0"

y2="1"

>

<stop

offset="0%"

stopColor="#3B82F6"

stopOpacity={0.55}

/>

<stop

offset="100%"

stopColor="#3B82F6"

stopOpacity={0}

/>

</linearGradient>

</defs>

<CartesianGrid

stroke="#334155"

strokeDasharray="4 4"

vertical={false}

opacity={0.25}

/>

<XAxis

dataKey="month"

stroke="#94A3B8"

tickLine={false}

axisLine={false}

/>

<YAxis

stroke="#94A3B8"

tickLine={false}

axisLine={false}

tickFormatter={(value)=>

`₹${Math.round(value/1000)}k`

}

/>

<Tooltip

content={<CustomTooltip/>}

/>

<ReferenceLine

y={targetAmount}

stroke="#22C55E"

strokeDasharray="8 5"

label={{

value:"Target",

fill:"#22C55E",

fontSize:12

}}

/>

<Area

type="monotone"

dataKey="amount"

stroke="none"

fill="url(#goalGradient)"

/>

<Line

type="monotone"

dataKey="amount"

stroke="#3B82F6"

strokeWidth={4}

dot={{

r:5,

fill:"#3B82F6",

stroke:"#fff",

strokeWidth:2

}}

activeDot={{

r:8,

fill:"#60A5FA",

stroke:"#fff",

strokeWidth:3

}}

animationDuration={1500}

/>

</AreaChart>

</ResponsiveContainer>

</div>

{/* FOOTER */}

<div
className="
mt-6

grid
grid-cols-2

gap-4
"
>

<div
className="
rounded-2xl

bg-slate-800/60

p-4
"
>

<p
className="
text-xs
text-slate-400
"
>
Current Progress
</p>

<h3
className="
text-xl
font-bold

text-blue-400

mt-2
"
>

₹{

data.length

?

data[data.length-1].amount.toLocaleString("en-IN")

:

0

}

</h3>

</div>

<div
className="
rounded-2xl

bg-slate-800/60

p-4
"
>

<p
className="
text-xs
text-slate-400
"
>
Remaining
</p>

<h3
className="
text-xl
font-bold

text-emerald-400

mt-2
"
>

₹{

Math.max(

0,

targetAmount-

(

data.length

?

data[data.length-1].amount

:

0

)

).toLocaleString("en-IN")

}

</h3>

</div>

</div>

</div>

  );

}