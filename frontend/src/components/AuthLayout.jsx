import { motion } from "motion/react";


const DOODLES = [
    {
        text:"🎬",
        top:"12%",
        left:"10%"
    },
    {
        text:"CUT",
        top:"70%",
        left:"15%"
    },
    {
        text:"✦",
        top:"20%",
        left:"80%"
    },
    {
        text:"AI",
        top:"75%",
        left:"85%"
    },
    {
        text:"✍️",
        top:"45%",
        left:"7%"
    },
    {
        text:"⚡",
        top:"40%",
        left:"90%"
    },
];


function AuthLayout({children}){


return(

<div

className="

min-h-screen

relative

overflow-hidden

flex
items-center
justify-center

px-5

bg-[#f7efd8]

"

>


{/* paper texture */}

<div

className="

absolute
inset-0

opacity-40

bg-[radial-gradient(#000_1px,transparent_1px)]

[background-size:20px_20px]

"

></div>



{/* paper creases */}

<div

className="

absolute

w-[900px]
h-[900px]

bg-white/40

rotate-45

blur-3xl

"

></div>




{/* random paper scraps */}

{

[...Array(8)].map(

(_,i)=>(


<motion.div

key={i}

animate={{

rotate:[-8,8,-8],

y:[0,-15,0]

}}

transition={{

duration:5+i,

repeat:Infinity

}}

className="

absolute

w-32
h-24

bg-[#fffaf0]

border-4
border-black

shadow-[5px_5px_0_black]

hidden
md:block

"

style={{

top:`${Math.random()*90}%`,

left:`${Math.random()*90}%`

}}


/>


)

)

}



{/* doodles */}

{

DOODLES.map(

(item,index)=>(


<motion.div

key={index}


animate={{

rotate:[-10,10,-10],

scale:[1,1.1,1]

}}


transition={{

duration:4,

repeat:Infinity

}}


className="

absolute

font-black

text-5xl

opacity-50

hidden
sm:block

"

style={{

top:item.top,

left:item.left

}}

>

{item.text}

</motion.div>


)

)

}




<div

className="

relative

z-10

w-full

flex
justify-center

"

>

{children}

</div>


</div>

)

}


export default AuthLayout;