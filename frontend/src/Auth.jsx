import React, { use } from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosinstance from '../config/axios'
import axios from 'axios'
import { usercontext } from '../src/Userprovider'
import { useContext } from 'react'


const Auth = ({ children }) => {
    const { email, setEmail,myid,setMyid,array,setArray,img,setImg } = useContext(usercontext);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        axiosinstance.get('/auth/verify')
            .then((res) => {
                if (res.status === 200) {
                    console.log(res.data.array);
                    setArray(res.data.array);
                    setMyid(res.data.data._id);
                    console.log('User is authenticated');
                    setImg(res.data.data.profilepic);
                    console.log(img);
                   // console.log(res.data.data.profilepic);
                    setEmail(res.data.email);
                    setIsAuthenticated(true);
                    setIsLoading(false);
                }
            })
            .catch((err) => {
                console.log('User is not authenticated')
                if (err.response.status === 401) {
                    navigate('/login');
                }
            })
    },[])

    return (
        <div>
          {isLoading ? (
            <div className="flex justify-center items-center h-screen w-screen bg-gradient-to-br from-[#012F49] via-[#014A6B] to-[#012F49]">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                <h1 className="text-xl sm:text-2xl text-white font-semibold tracking-wider">Loading...</h1>
              </div>
            </div>
          ) : (
            <div>{isAuthenticated && children}</div>
          )}
        </div>
      );
}

export default Auth