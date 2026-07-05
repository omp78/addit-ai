function StatusBadge({status}){


    let style = "bg-gray-700";


    if(status === "COMPLETED"){
        style = "bg-green-600";
    }


    if(status === "FAILED"){
        style = "bg-red-600";
    }


    if(
        status !== "COMPLETED"
        &&
        status !== "FAILED"
    ){
        style = "bg-yellow-600";
    }


    return(

        <span
            className={`
                ${style}
                px-3
                py-1
                rounded-full
                text-sm
                font-semibold
            `}
        >

            {status}

        </span>

    );

}


export default StatusBadge;