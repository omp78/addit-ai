import StatusBadge from "./StatusBadge";


function JobHistory({
    jobs,
    fetchResult
}){


    return(

        <div className="
            bg-gray-900
            rounded-xl
            p-6
            mt-8
            border
            border-gray-800
        ">


            <h2 className="
                text-xl
                font-bold
                mb-5
            ">

                📂 Previous Jobs

            </h2>


            {
                jobs.length === 0 &&

                <p className="text-gray-400">

                    No videos uploaded yet.

                </p>
            }



            {
                jobs.map(
                    (job)=>(


                        <div
                            key={job.job_id}

                            className="
                                flex
                                justify-between
                                items-center
                                border-b
                                border-gray-800
                                py-4
                            "
                        >


                            <div>


                                <h3 className="
                                    font-semibold
                                ">

                                    🎥 {job.original_filename}

                                </h3>


                                <StatusBadge
                                    status={job.status}
                                />


                            </div>



                            <button

                                onClick={
                                    ()=>fetchResult(
                                        job.job_id
                                    )
                                }

                                className="
                                    bg-blue-600
                                    px-4
                                    py-2
                                    rounded-lg
                                    hover:bg-blue-700
                                "
                            >

                                View

                            </button>


                        </div>


                    )
                )
            }


        </div>

    );


}


export default JobHistory;