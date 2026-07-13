import { useEffect, useState } from "react";
import JobHistory from "../components/JobHistory";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import UploadCard from "../components/UploadCard";
import ResultCard from "../components/ResultCard";
import WritingLoader from "../components/WritingLoader";
function Dashboard() {

    const [user, setUser] = useState(null);
    const [file, setFile] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [job, setJob] = useState(null);
    const [result, setResult] = useState(null);
    const [sidebarOpen,setSidebarOpen] =useState(true);
    const navigate = useNavigate();
    const [selectedJob,setSelectedJob] = useState(null);
    const [processing,setProcessing] =useState(false);  
    const [progress,setProgress] = useState(0); 
    const [resultLoading,setResultLoading] =useState(false); 

    const logout = () => {
        localStorage.removeItem(
            "token"
        );
        navigate(
            "/login"
        );
    };

    useEffect(() => {
        fetchUser();
        fetchJobs();
    }, []);


    const fetchJobs = async () => {
        try {
            const response = await api.get(
                "/jobs"
            );
            setJobs(
                response.data
            );
        }
        catch (error) {
            console.log(error);
        }
    };


    const checkStatus = async (jobId) => {
        const response = await api.get(
            `/jobs/${jobId}/status`
        );
        setJob(
            response.data
        );
        
        if (response.data.status !== "COMPLETED" && response.data.status !== "FAILED") {
            setTimeout(
                () => checkStatus(jobId),
                3000
            );
                setProcessing(false);
        }
        if(response.data.status === "QUEUED"){
            setProgress(20);
        }
        if(response.data.status === "AUDIO_EXTRACTED"){
            setProgress(50);
        }
        if(response.data.status === "TRANSCRIBED"){
            setProgress(75);
        }
        
        else if (response.data.status === "COMPLETED") {
            setProgress(100);
            setResultLoading(true);
            await fetchResult(jobId);
            setResultLoading(false);
            setProcessing(false);
        }
        
    };

    const fetchResult = async (jobId) => {
        setSelectedJob(jobId);
        try {
            const response = await api.get(
                `/jobs/${jobId}/result`
            );
            setResult(
                response.data
            );
        }
        catch (error) {
            console.log(error);
        }
    };

    const fetchUser = async () => {
        try {
            const response = await api.get(
                "/auth/me"
            );
            setUser(response.data);
        }
        catch (error) {

            console.log(error);
        }
    };


    const uploadVideo = async () => {
        console.log("UPLOAD CLICKED 🔥");
        if (!file) {
            alert("Select a video first");
            return;
        }
        const formData = new FormData();
        formData.append(
            "file",
            file
        );
        try {
            setProgress(5);
            setResult(null);
            setProcessing(true);
            setResultLoading(true);
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
        catch (error) {
            console.log(error);
            alert("Upload failed");
        }
    };

    const handleNewSummary = () => {
        console.log("New Summary Button Clicked: Resetting dashboard state! 🚀");
        setSelectedJob(null);
        setResult(null);
        setJob(null);
        setFile(null);
        setProgress(0);
        setProcessing(false);
        setResultLoading(false);
    };

    return (
       <div className="h-screen bg-[#F8F4E3] text-black flex overflow-hidden">
            <Sidebar
                user={user}
                jobs={jobs}
                fetchResult={fetchResult}
                logout={logout}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                selectedJob={selectedJob}
                onNewSummary={handleNewSummary}
            />
            <main className="flex-1 p-10 overflow-y-auto">
                <UploadCard
                    file={file}
                    setFile={setFile}
                    uploadVideo={uploadVideo}
                    job={job}
                    processing={processing}
                    progress={progress}
                />
                {resultLoading
                ?
                    <WritingLoader />
                    :
                        <ResultCard result={result}/>  
                }
            </main>
        </div>
    );
}


export default Dashboard;