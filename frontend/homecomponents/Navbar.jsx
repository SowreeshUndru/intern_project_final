import React, { useContext, useState } from 'react';
import PostItem from './PostItem';
import { usercontext } from '../src/Userprovider';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosinstance from '../config/axios.js';
import { FaBell } from 'react-icons/fa';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const roomid = location?.state?.roomid || "";
    const { item2, setItem2, array, setArray } = useContext(usercontext);
    const [notify, setNotify] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    async function signout() {
        try {
            const res = await axiosinstance.get("/user/logout");
            if (res.status === 200) navigate("/login");
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className='relative z-[999] bg-[#E8E1B5]/30 text-white font-sans'>

            {/* Top Navbar */}
            <div className='flex items-center justify-between p-4'>

                {/* Logo + dropdown toggle (for mobile) */}
                <div className='flex items-center gap-2 cursor-pointer' >
                    <h1 className='text-3xl font-bold'><a href="/">L&F</a></h1>
                    <div className='md:hidden text-lg' onClick={() => setMenuOpen(!menuOpen)}>▼</div>
                </div>

                {/* Right Side: PostItem, Bell, Nav Links */}
                <div className='flex items-center gap-6'>

                    {/* Always visible: PostItem + Bell */}
                    <PostItem />

                    <div className='relative cursor-pointer hover:scale-110' onClick={() => setNotify(!notify)}>
                        {array.length !== 0 && (
                            <div className='absolute right-0 top-0 h-2 w-2 rounded-full bg-[#DC3545]'></div>
                        )}
                        <FaBell className='text-xl mt-1' />
                    </div>

                    {/* Desktop-only nav links */}
                    <div className='hidden md:flex gap-6 items-center'>
                        <div className="text-xl cursor-pointer hover:scale-110" onClick={() => navigate('/response')}>
                            myResponses
                        </div>
                        <div className="text-xl cursor-pointer hover:scale-110" onClick={() => setItem2(!item2)}>
                            yourProfile
                        </div>
                        <div className='text-xl text-[#DC3545] cursor-pointer hover:scale-110 mr-2' onClick={signout}>
                            signOut
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile dropdown menu */}
            {menuOpen && (
                <div className='flex flex-col items-start gap-4 px-6 py-4 md:hidden bg-[#E8E1B5]/20 backdrop-blur-md shadow-xl'>
                    {/* <PostItem /> */}
                    <div className="text-xl cursor-pointer" onClick={() => navigate('/response')}>
                        myResponses
                    </div>
                    <div className="text-xl cursor-pointer" onClick={() => setItem2(!item2)}>
                        yourProfile
                    </div>
                    {/* <div className="relative text-xl cursor-pointer" onClick={() => setNotify(!notify)}>
                        {array.length !== 0 && (
                            <div className='absolute right-0 top-0 h-2 w-2 rounded-full bg-[#DC3545]'></div>
                        )}
                        <FaBell />
                    </div> */}
                    <div className='text-xl text-[#DC3545] cursor-pointer' onClick={signout}>
                        signOut
                    </div>
                </div>
            )}

            {/* Notification dropdown */}
            {(array.length !== 0 && notify) && (
                <div className='absolute z-[999] w-[18rem] bg-[#754C24]/30 backdrop-blur-md rounded-xl right-4 top-[5rem] text-center cursor-pointer p-3 flex flex-col gap-2 shadow-xl'>
                    {array.map((item, index) => (
                        <div
                            key={index}
                            className='bg-[#754C24]/30 backdrop-blur-md rounded-xl hover:scale-105 p-2 transition text-sm'
                            onClick={() => navigate(`/chat/${item}`)}
                        >
                            {item.split(".")[0] === item.split(".")[1]
                                ? <h1>mychat</h1>
                                : <h1>{item[item.length - 1] === '*' ? `user ${index + 1} is matched with your items` : `user ${index + 1} waiting for u`}</h1>
                            }
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Navbar;
