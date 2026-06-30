import {

    useEffect,

    useState

} from "react";

import {

    FaBullseye,

    FaCar,

    FaHome,

    FaPlane,

    FaLaptop,

    FaGraduationCap,

    FaPiggyBank,

    FaTimes,

    FaCalendarAlt,

    FaCoins

} from "react-icons/fa";

import {

    planGoal

} from "../api/goalApi";

const GOAL_ICONS = [

    {
        name: "Savings",
        icon: <FaPiggyBank />
    },

    {
        name: "Car",
        icon: <FaCar />
    },

    {
        name: "House",
        icon: <FaHome />
    },

    {
        name: "Vacation",
        icon: <FaPlane />
    },

    {
        name: "Laptop",
        icon: <FaLaptop />
    },

    {
        name: "Education",
        icon: <FaGraduationCap />
    }

];

export default function GoalModal({

    isOpen,

    onClose,

    onSuccess

}) {

    const [

        loading,

        setLoading

    ] = useState(false);

    const [

        goalName,

        setGoalName

    ] = useState("");

    const [

        targetAmount,

        setTargetAmount

    ] = useState("");

    const [

        currentAmount,

        setCurrentAmount

    ] = useState("");

    const [

        months,

        setMonths

    ] = useState(12);

    const [

        selectedIcon,

        setSelectedIcon

    ] = useState("Savings");

    const [

        startDate,

        setStartDate

    ] = useState("");

    const [

        response,

        setResponse

    ] = useState(null);

    useEffect(() => {

        if (!isOpen) {

            setGoalName("");

            setTargetAmount("");

            setCurrentAmount("");

            setMonths(12);

            setSelectedIcon("Savings");

            setResponse(null);

        }

    }, [isOpen]);

    if (!isOpen) return null;

    const remaining =

        Math.max(

            Number(targetAmount || 0)

            -

            Number(currentAmount || 0),

            0

        );

    const monthlySaving =

        months > 0

            ? Math.ceil(

                remaining /

                months

            )

            : 0;
            return (

<div
className="
fixed
inset-0

z-[999]

bg-black/70

backdrop-blur-md

flex
items-center
justify-center

p-4
"
>

<div
className="
relative

w-full
max-w-3xl

max-h-[92vh]

overflow-y-auto

rounded-[32px]

bg-slate-900/95

backdrop-blur-3xl

border
border-slate-800

shadow-[0_30px_80px_rgba(0,0,0,.45)]
"
>

{/* Glow */}

<div
className="
absolute

-right-28
-top-28

w-72
h-72

rounded-full

bg-blue-500/10

blur-3xl

pointer-events-none
"
/>

{/* Header */}

<div
className="
sticky
top-0

z-20

bg-slate-900/90

backdrop-blur-xl

border-b
border-slate-800

px-8
py-6

flex
justify-between
items-center
"
>

<div>

<h2
className="
text-3xl

font-bold

bg-gradient-to-r

from-blue-400
via-cyan-400
to-purple-400

bg-clip-text
text-transparent
"
>

Create Goal

</h2>

<p
className="
text-slate-400

mt-2
"
>

Plan your financial future

</p>

</div>

<button

onClick={onClose}

className="
w-11
h-11

rounded-xl

bg-slate-800

hover:bg-red-500

transition-all

flex
items-center
justify-center
"
>

<FaTimes className="text-white"/>

</button>

</div>

<div className="p-8 space-y-8"></div>
{/* Goal Type */}

<div>

<h3
className="
text-lg

font-semibold

mb-4
"
>

Goal Category

</h3>

<div
className="
grid

grid-cols-2
sm:grid-cols-3

gap-4
"
>

{

GOAL_ICONS.map(item=>(

<button

key={item.name}

type="button"

onClick={()=>setSelectedIcon(item.name)}

className={`

rounded-2xl

p-5

transition-all
duration-300

flex

flex-col

items-center

gap-3

border

hover:-translate-y-1

${

selectedIcon===item.name

?

"border-blue-500 bg-blue-500/10 shadow-[0_10px_25px_rgba(59,130,246,.25)]"

:

"border-slate-700 bg-slate-800/60 hover:border-blue-400"

}

`}

>

<div className="text-3xl">

{item.icon}

</div>

<p
className="
text-sm
font-medium
"
>

{item.name}

</p>

</button>

))

}

</div>

</div>
{/* Goal Name */}

<div>

  <label
    className="
    block
    text-sm
    font-medium
    text-slate-300
    mb-2
    "
  >
    Goal Name
  </label>

  <input
    type="text"
    value={goalName}
    onChange={(e)=>setGoalName(e.target.value)}
    placeholder="Ex : Buy MacBook Pro"

    className="
    w-full

    rounded-2xl

    bg-slate-800/70

    border
    border-slate-700

    px-5
    py-4

    outline-none

    text-white

    placeholder:text-slate-500

    focus:border-blue-500

    transition-all
    "
  />

</div>

{/* Amounts */}

<div
className="
grid

grid-cols-1
md:grid-cols-2

gap-6
"
>

<div>

<label
className="
block

mb-2

text-sm
text-slate-300
"
>

Target Amount

</label>

<div
className="
relative
"
>

<FaCoins
className="
absolute

left-5
top-1/2

-translate-y-1/2

text-blue-400
"
/>

<input

type="number"

value={targetAmount}

onChange={(e)=>

setTargetAmount(e.target.value)

}

placeholder="100000"

className="
w-full

pl-14

pr-4

py-4

rounded-2xl

bg-slate-800/70

border
border-slate-700

focus:border-blue-500

outline-none

transition-all
"
/>

</div>

</div>

<div>

<label
className="
block

mb-2

text-sm
text-slate-300
"
>

Current Savings

</label>

<div
className="
relative
"
>

<FaPiggyBank
className="
absolute

left-5
top-1/2

-translate-y-1/2

text-emerald-400
"
/>

<input

type="number"

value={currentAmount}

onChange={(e)=>

setCurrentAmount(e.target.value)

}

placeholder="15000"

className="
w-full

pl-14

pr-4

py-4

rounded-2xl

bg-slate-800/70

border
border-slate-700

focus:border-blue-500

outline-none

transition-all
"
/>

</div>

</div>

</div>

{/* Timeline */}

<div
className="
grid

grid-cols-1
md:grid-cols-2

gap-6
"
>

<div>

<label
className="
block

mb-2

text-sm
text-slate-300
"
>

Months

</label>

<input

type="number"

min={1}

value={months}

onChange={(e)=>

setMonths(Number(e.target.value))

}

className="
w-full

rounded-2xl

bg-slate-800/70

border
border-slate-700

px-5
py-4

outline-none

focus:border-blue-500
"
/>

</div>

<div>

<label
className="
block

mb-2

text-sm
text-slate-300
"
>

Start Date

</label>

<div
className="
relative
"
>

<FaCalendarAlt
className="
absolute

left-5
top-1/2

-translate-y-1/2

text-purple-400
"
/>

<input

type="date"

value={startDate}

onChange={(e)=>

setStartDate(e.target.value)

}

className="
w-full

pl-14

pr-4

py-4

rounded-2xl

bg-slate-800/70

border
border-slate-700

outline-none

focus:border-blue-500
"
/>

</div>

</div>

</div>

{/* Live Preview */}

<div
className="
rounded-3xl

border
border-blue-500/20

bg-gradient-to-r

from-blue-500/10
to-purple-500/10

p-6
"
>

<h3
className="
text-lg

font-semibold

mb-5

text-blue-300
"
>

Live Goal Preview

</h3>

<div
className="
grid

grid-cols-2
md:grid-cols-4

gap-5
"
>

<div>

<p
className="
text-xs
text-slate-400
"
>

Remaining

</p>

<h2
className="
text-xl

font-bold

mt-2

text-white
"
>

₹{remaining.toLocaleString("en-IN")}

</h2>

</div>

<div>

<p
className="
text-xs
text-slate-400
"
>

Monthly Saving

</p>

<h2
className="
text-xl

font-bold

mt-2

text-blue-400
"
>

₹{monthlySaving.toLocaleString("en-IN")}

</h2>

</div>

<div>

<p
className="
text-xs
text-slate-400
"
>

Duration

</p>

<h2
className="
text-xl

font-bold

mt-2

text-purple-400
"
>

{months} Months

</h2>

</div>

<div>

<p
className="
text-xs
text-slate-400
"
>

Completion

</p>

<h2
className="
text-xl

font-bold

mt-2

text-emerald-400
"
>

{startDate
? new Date(

new Date(startDate)

.setMonth(

new Date(startDate).getMonth()+months

)

).toLocaleDateString()

: "--"}

</h2>

</div>

</div>

</div>

{/* AI Response */}

{

response && (

<div
className="
rounded-3xl

bg-slate-800/70

border
border-slate-700

p-6

space-y-3
"
>

<h3
className="
text-xl

font-bold

text-blue-400
"
>

🤖 AI Recommendation

</h3>

<p>

Goal :

<strong>

 {response.goalName}

</strong>

</p>

<p>

Monthly Saving :

<strong>

₹{Number(

response.monthlySaving

).toLocaleString("en-IN")}

</strong>

</p>

<p>

Advice :

<span
className="
text-emerald-400
"
>

{response.advice}

</span>

</p>

</div>

)

}

{/* Footer */}

<div
className="
flex

flex-col-reverse
sm:flex-row

justify-end

gap-4

pt-4
"
>

<button

type="button"

onClick={onClose}

className="
px-6

py-3

rounded-2xl

bg-slate-800

hover:bg-slate-700

transition-all
"
>

Cancel

</button>

<button

onClick={async()=>{

try{

setLoading(true);

const res=await planGoal({

goalName,

targetAmount:Number(targetAmount),

months

});

setResponse(res.data);

onSuccess?.(res.data);

}

finally{

setLoading(false);

}

}}

disabled={loading}

className="
px-8

py-3

rounded-2xl

bg-gradient-to-r

from-blue-600
to-purple-600

hover:scale-105

transition-all

font-semibold

shadow-lg
shadow-blue-500/30
"
>

{

loading

?

"Planning..."

:

"Generate AI Plan"

}

</button>

</div>

</div>

</div>

);

}