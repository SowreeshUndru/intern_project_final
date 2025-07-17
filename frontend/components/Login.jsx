import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import gsap from 'gsap';
import axiosinstance from '../config/axios.js';
import { usercontext } from '../src/Userprovider.jsx';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const Navigate = useNavigate();

    function submission(e) {
        e.preventDefault();

        axiosinstance.post("/user/login", { email, password })
            .then((res) => {
                localStorage.setItem("token", res.data.token);
                const roomid = res.data.roomid;
                Navigate("/", { state: { roomid } });
            })
            .catch((err) => {
                console.error("Login failed", err);
                setError("Invalid email or password");
            });
    }

    useEffect(() => {
        gsap.to('.box', { duration: 1, stagger: 0.09, y: 50, opacity: 1, scale: 1, ease: "bounce.out" });
    }, []);

    return (
        <div className='h-[100vh] w-[100vw] bg-[#1E1E1E] flex justify-center items-center flex-col'>
            <div className='text-[600%] text-white mb-6'>
                <h1 className='box inline-block'>L</h1>
                <h1 className='box inline-block'>&</h1>
                <h1 className='box inline-block'>F</h1>
            </div>

            <div className='flex flex-col justify-center items-center border-2 border-white rounded-lg p-6 w-80 bg-[#2b2b2b]'>
                <h1 className='text-4xl text-white mb-4'>Login</h1>
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
                    <button type="submit" className='bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition'>
                        Login
                    </button>
                </form>

                {error && <p className="text-red-400 mt-2">{error}</p>}

                <p className="text-white text-sm mt-4">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-blue-400 hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
