import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Signup from '../components/signup.jsx'
import Login from '../components/Login.jsx'
import Home from '../components/Home.jsx'
import Auth from "./Auth.jsx"
import Project from '../components/Project.jsx'
import Response from '../components/Response.jsx'
import Chat from '../components/Chat.jsx'
import Listings from '../components/Listings.jsx'
const Approutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth><Home/></Auth>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/response" element={<Auth><Response/></Auth>} />
       <Route path='/project/:id' element={<Auth><Project/></Auth>}></Route>
       <Route path="/chat/:roomid" element={<Auth><Chat/></Auth>}></Route>
       <Route path="/listings" element={<Auth><Listings/></Auth>} />
        
      </Routes>
    </BrowserRouter>
  )
}

export default Approutes;