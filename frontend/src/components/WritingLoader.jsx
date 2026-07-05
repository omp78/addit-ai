import { motion } from "motion/react";


function WritingLoader(){


return(

<div

className="

mt-10

bg-white

border-4
border-black

rounded-xl

p-10

shadow-[8px_8px_0_black]

text-center

"

>


<motion.div


animate={{

rotate:[-5,5,-5]

}}


transition={{

repeat:Infinity,

duration:1

}}


className="

text-7xl

"

>

✍️

</motion.div>



<motion.div


animate={{

y:[0,-10,0]

}}


transition={{

repeat:Infinity,

duration:1.5

}}


className="

text-8xl

"

>

📄

</motion.div>



<h2

className="

text-3xl

font-black

mt-5

"

>

Addit AI is writing...

</h2>


<p

className="

font-bold

mt-3

"

>

Creating your summary & content magic ✨

</p>


<motion.p


animate={{

opacity:[0,1,0]

}}


transition={{

repeat:Infinity,

duration:1

}}


className="font-black mt-4"

>

thinking...

</motion.p>


</div>

)

}


export default WritingLoader;