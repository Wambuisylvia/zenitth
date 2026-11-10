import React from 'react';
import './App.css';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import DashboardComponent from './components/dashboard/DashboardComponent';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Home from './components/Home';
import AboutUs from './components/AboutUs';



function App() {
  
  

  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Login/>}/>
        <Route path='/' element={<DashboardComponent/>} />
        <Route path='/signup' element={<Signup/>} />
        <Route path='/home' element={<Home/>} />
        <Route path='/about' element={<AboutUs/>} />

      </Routes>
    </Router>

  );
}


export default App;