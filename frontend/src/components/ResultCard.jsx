import {
    motion
} from "motion/react";
function PaperCard({
    children,
    delay=0
}){


return(

<motion.div

initial={{

    opacity:0,

    y:-60,

    rotate:-5

}}

animate={{

    opacity:1,

    y:0,

    rotate:0

}}

transition={{

    delay:delay,

    type:"spring",

    stiffness:130

}}


whileHover={{

    rotate:-1,

    scale:1.02

}}


className="

bg-white

border-4
border-black

rounded-xl

p-6

shadow-[8px_8px_0_black]

"

>


{children}


</motion.div>

)

}
function ResultCard({result}){


    if(!result){

        return null;

    }


    return(

        <div className="
            mt-8
            space-y-5
        ">
            <motion.h1

initial={{
scale:0
}}

animate={{
scale:1
}}

className="

text-4xl

font-black

my-8

"

>

✨ AI Magic Created

</motion.h1>

            <PaperCard delay={0}>


                <h2 className="
                    text-xl
                    font-bold
                    mb-3
                ">

                    ✨ Summary

                </h2>


                <p className="
                    text-black/70
                ">

                    {result.summary}

                </p>


            </PaperCard>

            <PaperCard delay={0.1}>
                <h2
                    className="
                    text-xl
                    font-bold
                    mb-4
                    "
                >
                    ⏱️ Important Moments
                </h2>
                <div
                    className="
                    space-y-3
                    "
                >
                    {
                        result.chapters?.map(
                            (chapter,index)=>(
                                <motion.div
                                    key={index}
                                    initial={{
                                        opacity:0,
                                        x:-40
                                    }}
                                    animate={{
                                        opacity:1,
                                        x:0
                                    }}
                                    transition={{
                                        delay:index * 0.15
                                    }}
                                    whileHover={{
                                        scale:1.03,
                                        rotate:-0.5
                                    }}
                                    className="
                                    bg-[#FFD23F]
                                    border-4
                                    border-black
                                    p-4
                                    flex
                                    items-center
                                    gap-5
                                    shadow-[5px_5px_0_black]
                                    font-black
                                    "
                                >
                                    <span
                                        className="
                                        bg-black
                                        text-white
                                        px-3
                                        py-1
                                        "
                                    >
                                        {chapter.time}
                                    </span>
                                    <p>
                                        {chapter.title}
                                    </p>
                                </motion.div>
                            )
                        )
                    }
                </div>
            </PaperCard>

            <PaperCard delay={0.15}>


                <h2 className="
                    text-xl
                    font-bold
                    mb-3
                ">

                    📌 Key Points

                </h2>


                <ul className="
                    list-disc
                    ml-5
                    text-black/70
                ">

                    {
                        result.key_points?.map((point, index) => (
                            <motion.li
                                key={index}
                                initial={{
                                    opacity: 0,
                                    x: -20
                                }}
                                animate={{
                                    opacity: 1,
                                    x: 0
                                }}
                                transition={{
                                    delay: index * 0.1
                                }}
                            >
                                {point}
                            </motion.li>
                        ))
                    }

                </ul>


            </PaperCard>




            <PaperCard delay={0.3}>


                <h2 className="
                    text-xl
                    font-bold
                    mb-3
                ">

                    🎬 YouTube Package

                </h2>


                <h3 className="font-semibold">
                    Title
                </h3>


                <p className="text-black/70">

                    {result.youtube_title}

                </p>


                <h3 className="
                    font-semibold
                    mt-4
                ">

                    Description

                </h3>


                <p className="text-black/70">

                    {result.youtube_description}

                </p>



                <h3 className="
                    font-semibold
                    mt-4
                ">

                    SEO Keywords

                </h3>


                <p className="text-black/70">

                    {
                        result.seo_keywords?.join(", ")
                    }

                </p>


            </PaperCard>


        </div>

    );

}


export default ResultCard;