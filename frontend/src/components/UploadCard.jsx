import { motion } from "motion/react";

function UploadCard({
    setFile,
    uploadVideo,
    job,
    processing,
    progress
}) {


    return (

        <motion.div

initial={{

    scale:0.8,
    rotate:-2,
    opacity:0

}}

animate={{

    scale:1,
    rotate:0,
    opacity:1

}}

whileHover={{

    rotate:-0.5,
    scale:1

}}

transition={{

    type:"spring",
    stiffness:150

}}


className="

bg-white

border-4
border-black

rounded-xl

p-8

shadow-[8px_8px_0_black]

"

>


            <h2 className="
                text-xl
                font-semibold
                mb-4
            ">

                Upload Video 🎥

            </h2>


            <input

                type="file"

                accept="video/*"

                onChange={
                    e => setFile(
                        e.target.files[0]
                    )
                }

                className="block border-4 border-black p-4 w-full bg-[#FFF7ED] font-bold cursor-pointer"/>
            <br />


            <button

                onClick={uploadVideo}

                className="mt-5 bg-[#FF6B35] border-4 border-black 
px-8 py-3 font-black shadow-[6px_6px_0_black] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"  >

                Process Video 🚀

            </button>
                {

processing &&

<motion.div

initial={{
opacity:0
}}

animate={{
opacity:1
}}

className="

mt-6

bg-[#3A86FF]

text-white

border-4
border-black

p-5

font-black

shadow-[6px_6px_0_black]

"

>

🧠 Addit AI is thinking


<motion.span


animate={{

opacity:[0,1,0]

}}


transition={{

repeat:Infinity,

duration:1

}}

>

...

</motion.span>


</motion.div>

}

           {
processing &&

<div
className="

mt-6

border-4
border-black

h-8

bg-white

overflow-hidden

"
>


<div

style={{

    width:`${progress}%`

}}

className="

h-full

bg-[#FFD23F]

transition-all

duration-700

"

>


</div>


</div>

}


        </motion.div>

    );

}


export default UploadCard;