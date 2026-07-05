import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";


function Login(){

    const navigate = useNavigate();


    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");


    const handleLogin = async(e)=>{

        e.preventDefault();


        try{

            const response = await api.post(
                "/auth/login",
                {
                    email,
                    password
                }
            );


            localStorage.setItem(
                "token",
                response.data.access_token
            );


            navigate("/dashboard");


        }
        catch(error){

            alert("Login failed");

            console.log(error);

        }

    };


    return(

        <form onSubmit={handleLogin}>


            <h1>Login</h1>


            <input
                placeholder="Email"
                value={email}
                onChange={
                    e=>setEmail(e.target.value)
                }
            />


            <input
                placeholder="Password"
                type="password"
                value={password}
                onChange={
                    e=>setPassword(e.target.value)
                }
            />


            <button>
                Login
            </button>


        </form>

    );

}


export default Login;