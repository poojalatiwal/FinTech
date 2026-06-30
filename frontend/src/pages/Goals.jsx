import {

    useState,

    useEffect,

    useMemo

} from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import GoalCard from "../components/GoalCard";
import GoalModal from "../components/GoalModal";
import GoalTimeline from "../components/GoalTimeline";
import GoalProgressChart from "../components/GoalProgressChart";

import {

    FaPlus,

    FaBullseye,

    FaPiggyBank,

    FaChartLine,

    FaWallet

} from "react-icons/fa";

import {

    getGoals,

    deleteGoal

} from "../api/goalApi";

export default function Goals() {

    const [

        sidebarOpen,

        setSidebarOpen

    ] = useState(false);

    const [

        showModal,

        setShowModal

    ] = useState(false);

    const [

        loading,

        setLoading

    ] = useState(true);

    const [

        goals,

        setGoals

    ] = useState([]);

    const [

        selectedGoal,

        setSelectedGoal

    ] = useState(null);

    useEffect(() => {

        loadGoals();

    }, []);

    const loadGoals = async () => {

        try {

            setLoading(true);

            const res = await getGoals();

            setGoals(res.data || []);

        }

        catch (err) {

            console.error(err);

        }

        finally {

            setLoading(false);

        }

    };

    const removeGoal = async (id) => {

        try {

            await deleteGoal(id);

            loadGoals();

        }

        catch (err) {

            console.error(err);

        }

    };

    /*
    ----------------------------------
    Summary
    ----------------------------------
    */

    const summary = useMemo(() => {

        let target = 0;

        let current = 0;

        let monthly = 0;

        goals.forEach(goal => {

            target += goal.targetAmount;

            current += goal.currentAmount || 0;

            monthly += goal.monthlySaving || 0;

        });

        return {

            totalTarget: target,

            currentSavings: current,

            remaining: target - current,

            monthlySaving: monthly

        };

    }, [goals]);

    /*
    ----------------------------------
    Chart Data
    ----------------------------------
    */

    const progressData = useMemo(() => {

        if (!selectedGoal)

            return [];

        const monthly =

            selectedGoal.targetAmount /

            selectedGoal.months;

        return Array.from(

            {

                length:

                    selectedGoal.months

            },

            (_, i) => ({

                month:

                    `M${i + 1}`,

                amount:

                    Math.min(

                        monthly * (i + 1),

                        selectedGoal.targetAmount

                    )

            })

        );

    }, [selectedGoal]);

    return (

<div
className="
min-h-screen

bg-gradient-to-br

from-slate-950

via-slate-900

to-slate-950

text-white
"
>

<Sidebar

sidebarOpen={sidebarOpen}

setSidebarOpen={setSidebarOpen}

/>

<div
className="
lg:ml-72

transition-all
duration-300
"
>

<Navbar

setSidebarOpen={setSidebarOpen}

/>

<main
className="
p-4
sm:p-6
lg:p-8

space-y-8
"
> {/* ================= HERO ================= */}

<div
className="
flex

flex-col
lg:flex-row

lg:items-center
lg:justify-between

gap-6
"
>

    <div>

        <h1
        className="
        text-3xl
        sm:text-4xl
        lg:text-5xl

        font-extrabold

        bg-gradient-to-r

        from-blue-400

        via-cyan-400

        to-purple-400

        bg-clip-text

        text-transparent
        "
        >

            Financial Goals

        </h1>

        <p
        className="
        mt-3

        text-slate-400

        max-w-2xl

        leading-7
        "
        >

            Create savings goals, monitor your progress,
            and let FinSight AI guide you toward achieving
            every milestone.

        </p>

    </div>

    <button

    onClick={()=>setShowModal(true)}

    className="
    flex

    items-center

    justify-center

    gap-3

    px-7
    py-4

    rounded-2xl

    font-semibold

    bg-gradient-to-r

    from-blue-600

    via-cyan-500

    to-purple-600

    hover:scale-105

    hover:shadow-[0_20px_45px_rgba(59,130,246,.35)]

    transition-all
    duration-300
    "

    >

        <FaPlus/>

        New Goal

    </button>

</div>

{/* ================= SUMMARY ================= */}

<div
className="
grid

grid-cols-1

sm:grid-cols-2

xl:grid-cols-4

gap-6
"
>

{/* Card */}

<div
className="
group

rounded-3xl

bg-slate-900/70

backdrop-blur-xl

border

border-slate-800

p-6

hover:border-blue-500

hover:-translate-y-2

hover:shadow-[0_20px_45px_rgba(59,130,246,.15)]

transition-all
duration-500
"
>

<div
className="
w-14

h-14

rounded-2xl

bg-blue-500/20

flex

items-center

justify-center

mb-5
"
>

<FaBullseye
className="
text-blue-400

text-2xl
"
/>

</div>

<p
className="
text-slate-400
"
>

Total Target

</p>

<h2
className="
mt-3

text-3xl

font-bold

break-words
"
>

₹{summary.totalTarget.toLocaleString("en-IN")}

</h2>

</div>

{/* Card */}

<div
className="
group

rounded-3xl

bg-slate-900/70

backdrop-blur-xl

border

border-slate-800

p-6

hover:border-emerald-500

hover:-translate-y-2

hover:shadow-[0_20px_45px_rgba(16,185,129,.15)]

transition-all
duration-500
"
>

<div
className="
w-14

h-14

rounded-2xl

bg-emerald-500/20

flex

items-center

justify-center

mb-5
"
>

<FaPiggyBank
className="
text-emerald-400

text-2xl
"
/>

</div>

<p
className="
text-slate-400
"
>

Current Savings

</p>

<h2
className="
mt-3

text-3xl

font-bold

break-words

text-emerald-400
"
>

₹{summary.currentSavings.toLocaleString("en-IN")}

</h2>

</div>

{/* Card */}

<div
className="
group

rounded-3xl

bg-slate-900/70

backdrop-blur-xl

border

border-slate-800

p-6

hover:border-purple-500

hover:-translate-y-2

hover:shadow-[0_20px_45px_rgba(168,85,247,.15)]

transition-all
duration-500
"
>

<div
className="
w-14

h-14

rounded-2xl

bg-purple-500/20

flex

items-center

justify-center

mb-5
"
>

<FaWallet
className="
text-purple-400

text-2xl
"
/>

</div>

<p
className="
text-slate-400
"
>

Remaining

</p>

<h2
className="
mt-3

text-3xl

font-bold

break-words

text-purple-400
"
>

₹{summary.remaining.toLocaleString("en-IN")}

</h2>

</div>

{/* Card */}

<div
className="
group

rounded-3xl

bg-slate-900/70

backdrop-blur-xl

border

border-slate-800

p-6

hover:border-cyan-500

hover:-translate-y-2

hover:shadow-[0_20px_45px_rgba(34,211,238,.15)]

transition-all
duration-500
"
>

<div
className="
w-14

h-14

rounded-2xl

bg-cyan-500/20

flex

items-center

justify-center

mb-5
"
>

<FaChartLine
className="
text-cyan-400

text-2xl
"
/>

</div>

<p
className="
text-slate-400
"
>

Monthly Saving

</p>

<h2
className="
mt-3

text-3xl

font-bold

break-words

text-cyan-400
"
>

₹{summary.monthlySaving.toLocaleString("en-IN")}

</h2>

</div>

</div>
{/* ============================
        MAIN CONTENT
============================ */}

{loading ? (

<div
className="
grid

grid-cols-1
md:grid-cols-2
xl:grid-cols-3

gap-6
"
>

{Array.from({ length: 6 }).map((_, i) => (

<div

key={i}

className="
h-[360px]

rounded-3xl

bg-slate-900/60

animate-pulse

border
border-slate-800
"
/>

))}

</div>

) : goals.length === 0 ? (

<div
className="
rounded-3xl

border
border-dashed
border-slate-700

bg-slate-900/50

py-24

text-center
"
>

<div
className="
mx-auto

w-24
h-24

rounded-full

bg-blue-500/10

flex
items-center
justify-center

mb-6
"
>

<FaBullseye
className="
text-5xl
text-blue-400
"
/>

</div>

<h2
className="
text-3xl

font-bold

mb-4
"
>

No Goals Yet

</h2>

<p
className="
text-slate-400

max-w-xl

mx-auto

leading-7
"
>

Start planning your financial future by creating
your first savings goal.

</p>

<button

onClick={()=>setShowModal(true)}

className="
mt-8

px-8
py-4

rounded-2xl

bg-gradient-to-r

from-blue-600
to-purple-600

font-semibold

hover:scale-105

transition-all
"
>

Create First Goal

</button>

</div>

) : (

<>

{/* Goal Cards */}

<div
className="
grid

grid-cols-1

lg:grid-cols-2

2xl:grid-cols-3

gap-6
"
>

{

goals.map(goal=>(

<GoalCard

key={goal.id}

goal={goal}

onView={()=>setSelectedGoal(goal)}

onEdit={()=>{

setSelectedGoal(goal);

setShowModal(true);

}}

onDelete={removeGoal}

/>

))

}

</div>

{/* Charts */}

{

selectedGoal && (

<div
className="
grid

grid-cols-1

2xl:grid-cols-2

gap-8

mt-10
"
>

<div
className="
min-h-[450px]
"
>

<GoalProgressChart

data={progressData}

targetAmount={selectedGoal.targetAmount}

/>

</div>

<div
className="
min-h-[450px]
"
>

<GoalTimeline

targetAmount={selectedGoal.targetAmount}

currentAmount={selectedGoal.currentAmount}

months={selectedGoal.months}

/>

</div>

</div>

)

}

</>

)}

{/* Floating Action Button */}

<button

onClick={()=>setShowModal(true)}

className="
fixed

bottom-8
right-8

w-16
h-16

rounded-full

bg-gradient-to-r

from-blue-600
to-purple-600

shadow-[0_20px_40px_rgba(59,130,246,.35)]

hover:scale-110

transition-all

z-40

lg:hidden
"
>

<FaPlus
className="
mx-auto
text-xl
"
/>

</button>

{/* Modal */}

<GoalModal

isOpen={showModal}

goal={selectedGoal}

onClose={()=>{

setShowModal(false);

setSelectedGoal(null);

}}

onSuccess={()=>{

loadGoals();

setShowModal(false);

setSelectedGoal(null);

}}

/>

</main>

</div>

</div>

);

}
