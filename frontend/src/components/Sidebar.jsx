import {
    motion,
    AnimatePresence
} from "motion/react";
import logo from "../assets/logo.png";

function Sidebar({
    user,
    jobs,
    fetchResult,
    logout,
    sidebarOpen,
    setSidebarOpen,
    selectedJob,
    onNewSummary
}){

return (

<>

<motion.button

onClick={
    ()=>setSidebarOpen(!sidebarOpen)
}

animate={{
    left: sidebarOpen ? "18rem" : "1.25rem"
}}

transition={{
    type: "spring",
    stiffness: 220,
    damping: 26
}}

className="
fixed
top-5
z-50
bg-[#FF6B35]
border-4
border-black
px-4
py-2
font-black
shadow-[5px_5px_0_black]
"

>

💥

</motion.button>


<motion.aside
animate={{
    width: sidebarOpen ? "20rem" : "0rem",
    borderRightWidth: sidebarOpen ? "4px" : "0px",
    padding: sidebarOpen ? "1.5rem" : "0rem",
    boxShadow: sidebarOpen ? "8px 0px 0px 0px #000" : "0px 0px 0px 0px #000"
}}
transition={{
    type: "spring",
    stiffness: 220,
    damping: 26
}}
className="
h-screen
bg-[#FFF7ED]
border-black
flex
flex-col
overflow-hidden
"
>

<div className="w-[17rem] flex flex-col flex-1 min-h-0" style={{ minWidth: "17rem" }}>


{/* LOGO */}

<div className="flex items-center gap-3">
    <img
        src={logo}
        alt="Addit AI"
        className="w-12 h-12"
    />

    <h1 className="text-3xl font-black">
        Addit AI
    </h1>
</div>



{/* NEW BUTTON */}

<button

onClick={onNewSummary}

className="

bg-[#FFD23F]

border-4
border-black

py-3

font-black

shadow-[5px_5px_0_black]

hover:translate-x-1
hover:translate-y-1
hover:shadow-none

transition

"

>

+ New Summary

</button>




<h2
className="

mt-10
mb-4

font-black

"

>

History 📂

</h2>



<div className="flex-1 overflow-y-auto pr-2">


{

jobs.map(

(job,index)=>(


<motion.div


key={job.job_id}


initial={{

opacity:0,
x:-30

}}


animate={{

opacity:1,
x:0

}}


transition={{

delay:index * 0.08

}}


onClick={
()=>fetchResult(job.job_id)
}


className={`
cursor-pointer

border-2
border-black

p-3
mb-3

font-bold

transition-all


${
selectedJob === job.job_id

?

`
bg-[#FFD23F]
shadow-[6px_6px_0_black]
scale-105
`

:

`
bg-white
hover:bg-[#FFD23F]/30
`

}

`}
>


🎥 {job.original_filename}


</motion.div>


)

)

}


</div>




{/* USER */}


<div

className="

border-t-4
border-black

pt-5

"

>


<p className="font-black">

👤 {user?.name}

</p>



<button

onClick={logout}


className="

mt-4

bg-red-400

border-4
border-black

px-5
py-2

font-black

shadow-[4px_4px_0_black]

"

>


Logout


</button>


</div>



</div>
</motion.aside>

</>

)

}


export default Sidebar;