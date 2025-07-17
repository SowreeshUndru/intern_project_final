import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import gsap from 'gsap';
import axiosinstance from '../config/axios.js';

const Signup = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phoneNumber, setPhonenumber] = useState("");
    const [error, setError] = useState("");

    const submission = (e) => {
        e.preventDefault();

        axiosinstance.post("/user/signup", { email, password, phoneNumber })
            .then((res) => {
                if (res.data.message !== "Invalid details") {
                    console.log("Signup successful");
                    console.log(res.data.token);
                    localStorage.setItem("token", res.data.token);
                    console.log("Token saved");
                    navigate("/");
                } else {
                    setError("Invalid details");
                }
            })
            .catch((err) => {
                console.error("Signup failed:", err);
                setError("User already exists or invalid data");
            });
    };

    useEffect(() => {
        gsap.to('.box', {
            duration: 1,
            stagger: 0.09,
            y: 50,
            opacity: 1,
            scale: 1,
            ease: "bounce.out"
        });
    }, []);

    return (
        <div className='h-[100vh] w-[100vw] bg-[#1E1E1E] flex justify-center items-center flex-col'>
            <div className='text-[600%] text-white mb-6'>
                <h1 className='box inline-block'>L</h1>
                <h1 className='box inline-block'>&</h1>
                <h1 className='box inline-block'>F</h1>
            </div>

            <div className='flex flex-col justify-center items-center border-2 border-white rounded-lg p-6 w-80 bg-[#2b2b2b]'>
                <h1 className='text-4xl text-white mb-4'>Signup</h1>

                <form className='flex flex-col w-full' onSubmit={submission}>
                    <input
                        type="email"
                        placeholder="Email"
                        className='mb-3 p-2 rounded bg-white text-black'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className='mb-3 p-2 rounded bg-white text-black'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <input
                        type="tel"
                        placeholder="Phone Number"
                        className='mb-3 p-2 rounded bg-white text-black'
                        value={phoneNumber}
                        onChange={(e) => setPhonenumber(e.target.value)}
                        required
                    />
                    <button type="submit" className='bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition'>
                        Submit
                    </button>
                </form>

                {error && <p className="text-red-400 mt-2">{error}</p>}

                <p className="text-white text-sm mt-4">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-400 hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
