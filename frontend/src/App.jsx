import React from 'react'
import Userprovider from './Userprovider'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Approutes from './Approutes'
import Auth from './Auth'

const App = () => {
  return (
    <Userprovider>
      <Approutes/>
    </Userprovider>
  )
}

export default App