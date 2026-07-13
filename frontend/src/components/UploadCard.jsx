import { motion } from "motion/react";

function UploadCard({
    file,
    setFile,
    uploadVideo,
    job,
    processing,
    progress
}) {


    return (

        <motion.div

initial={{

    scale:0.95,
    opacity:0

}}

animate={{

    scale:1,
    opacity:1

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
                font-black
                mb-6
            ">

                Upload Video 🎥

            </h2>


            <div className="relative border-4 border-dashed border-black rounded-xl p-8 bg-[#FFF7ED] text-center cursor-pointer hover:bg-[#FFD23F]/10 transition-colors my-4">
                <input
                    type="file"
                    accept="video/*"
                    onChange={
                        e => setFile(
                            e.target.files[0]
                        )
                    }
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center space-y-3">
                    <span className="text-4xl">📁</span>
                    {file ? (
                        <div>
                            <p className="font-black text-[#FF6B35]">Selected Video:</p>
                            <p className="font-bold text-lg break-all text-black mt-1">{file.name}</p>
                            <p className="text-xs text-black/50 mt-1">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                        </div>
                    ) : (
                        <div>
                            <p className="font-black text-lg text-black">Drag & drop your video here</p>
                            <p className="font-bold text-sm text-black/60">or click to browse files</p>
                            <p className="text-xs text-black/40 mt-2">Supports MP4, MOV, AVI, etc. (max 100MB)</p>
                        </div>
                    )}
                </div>
            </div>


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