import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";


function Register(){

    const navigate = useNavigate();


    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");


    const handleRegister = async(e)=>{

        e.preventDefault();


        try{

            await api.post(
                "/auth/register",
                {
                    name,
                    email,
                    password
                }
            );


            alert(
                "Account created successfully"
            );


            navigate("/login");

        }
        catch(error){

            console.log(error);

            alert(
                "Registration failed"
            );

        }

    };


    return(

        <form onSubmit={handleRegister}>


            <h1>
                Register
            </h1>


            <input
                placeholder="Name"
                value={name}
                onChange={
                    e=>setName(e.target.value)
                }
            />


            <input
                placeholder="Email"
                value={email}
                onChange={
                    e=>setEmail(e.target.value)
                }
            />


            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={
                    e=>setPassword(e.target.value)
                }
            />


            <button>
                Create Account
            </button>


        </form>

    );

}


export default Register;