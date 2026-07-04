import { useEffect, useState } from "react";

import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function Dashboard(){

    const [user,setUser] = useState(null);
    const [file,setFile] = useState(null);
    const [jobs,setJobs] = useState([]);
    const [job,setJob] = useState(null);
    const [result,setResult] = useState(null);

    const navigate = useNavigate();


    const logout = ()=>{
        localStorage.removeItem(
            "token"
        );
        navigate(
            "/login"
        );
    };

    useEffect(()=>{
        fetchUser();
        fetchJobs();
    },[]);


    const fetchJobs = async()=>{
        try{
        const response = await api.get(
                "/jobs"
            );
            setJobs(
                response.data
            );
        }
        catch(error){
            console.log(error);
        }
    };


    const checkStatus = async(jobId)=>{
        const response = await api.get(
            `/jobs/${jobId}/status`
        );
        setJob(
            response.data
        );
        if(response.data.status !== "COMPLETED" && response.data.status !== "FAILED"){
            setTimeout(
                ()=>checkStatus(jobId),
                3000
            );
        }
        else if(response.data.status === "COMPLETED"){
            fetchResult(jobId);
        }
    };

    const fetchResult = async(jobId)=>{
        try{
            const response = await api.get(
                `/jobs/${jobId}/result`
            );
            setResult(
                response.data
            );
        }
        catch(error){
            console.log(error);
        }
    };

    const fetchUser = async()=>{
        try{
            const response = await api.get(
                "/auth/me"
            );
            setUser(response.data);
        }
        catch(error){

            console.log(error);
        }
    };


    const uploadVideo = async()=>{
        console.log("UPLOAD CLICKED 🔥");
        if(!file){
            alert("Select a video first");
            return;
        }

        const formData = new FormData();
        formData.append(
            "file",
            file
        );
        try{
            const response = await api.post(
                "/upload",
                formData
            );
            console.log(response.data);
            setJob(
                response.data.data
            );
            fetchJobs();
            checkStatus(
                response.data.data.job_id
            );
        }
        catch(error){
            console.log(error);
            alert("Upload failed");
        }
    };

    return(
        <div>
            <h1>
                Addit AI Dashboard 🚀
            </h1>
            <button onClick={logout}>
                Logout
            </button>
            {
                user &&
                <h2>
                    Welcome {user.name} 👋
                </h2>
            }
            <hr />
            <h2>
                Upload Video
            </h2>
            <input
                type="file"
                accept="video/*"
                onChange={
                    e=>setFile(
                        e.target.files[0]
                    )
                }
            />
            <button onClick={uploadVideo}>
                Upload
            </button>
            {
                job &&
                <div>
                    <h3>
                        Job Created
                    </h3>
                    <p>
                        ID: {job.job_id}
                    </p>
                    <p>
                        Status: {job.status}
                    </p>
                </div>
            }
            {
                result &&
                <div>
                    <h2>
                        ✨ AI Result
                    </h2>
                    <h3>
                        Summary
                    </h3>
                    <p>
                        {result.summary}
                    </p>
                    <h3>
                        Key Points
                    </h3>
                    <ul>
                        {
                            result.key_points?.map(
                                (point,index)=>(

                                    <li key={index}>
                                        {point}
                                    </li>
                                )
                            )
                        }
                    </ul>
                    <h3>
                        YouTube Title
                    </h3>
                    <p>
                        {result.youtube_title}
                    </p>
                    <h3>
                        Description
                    </h3>
                    <p>
                        {result.youtube_description}
                    </p>
                    <h3>
                        SEO Keywords
                    </h3>
                    <p>
                        {
                            result.seo_keywords?.join(", ")
                        }
                    </p>
                </div>
            }
            <hr/>
            <h2>
                Previous Jobs
            </h2>
            {
                jobs.map(
                    (item)=>(
                        <div key={item.job_id}>
                            <h3>
                                {item.original_filename}
                            </h3>
                            <p>
                                Status: {item.status}
                            </p>
                            <button onClick={()=>fetchResult(item.job_id)}>
                                View Result
                            </button>
                            <hr />
                        </div>
                    )
                )
            }
        </div>
    );
}


export default Dashboard;