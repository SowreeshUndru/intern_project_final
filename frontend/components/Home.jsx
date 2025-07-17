import React from 'react'
import Navbar from '../homecomponents/Navbar'
import { usercontext } from '../src/Userprovider'
import { useContext } from 'react'
import Scrollbar from '../homecomponents/Scrollbar'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'
const Home = () => {
const location=useLocation();
const navigate=useNavigate();
const roomid = location && location.state && location.state.roomid ? location.state.roomid : "";




    const {enable,setEnable}=useContext(usercontext);

    return (
        <div className={`overflow-x-hidden flex flex-col home min-h-screen w-[100vw] bg-[#012F49]  text-white  
 ${enable ? ' backdrop-blur-md shadow-2xl ' : ''}`}>
            <Navbar />
            <Scrollbar/>
            {/* {roomid!=""&&
            <button className='fixed z-[999] cursor-pointer w-30 h-5 -translate-x-[50%] left-[20%] mt-20 shadow-3xl right ' onClick={()=>{navigate(`/chat/${roomid}`)}} >notification : {roomid}</button>} */}
            
            <div className="flex justify-center  fixed -left-50">
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/8/8c/Man_Talking_on_the_Phone_Cartoon_Vector.svg"
                    alt="Man Talking on the Phone Cartoon"
                    className="  h-200 w-200 "
                />
                
            </div>
            <div className='flex justify-center  fixed left-0'>
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/5/5a/Black_Man_Talking_on_the_Phone_Cartoon_Vector.svg"
                    alt="Man Talking on the Phone Cartoon"
                    className=" h-200 w-200 "
                />
            </div>
            <div className='flex justify-center  fixed left-50 '>
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/3/3f/Black_Man_Looking_at_Phone_Cartoon_Vector.svg"
                    alt="Man Talking on the Phone Cartoon"
                    className=" h-200 w-200 "
                />
            </div>

        </div>
    )
}

export default Home