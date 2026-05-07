import React, { useState, useEffect } from 'react';
import './App.css';
import SavingCard from './components/savings/SavingCard'; 
import Login from './components/auth/Login'
import Signup from './components/auth/Signup';
import DashboardComponent from './components/dashboard/DashboardComponent';

// IMPORT YOUR NEW GOALS COMPONENTS
import Progress from './components/goals/Progress';
import GoalsCard from './components/goals/GoalsCard';
import GoalsForm from './components/goals/GoalsForm';
import GoalsList from './components/goals/GoalsList';
import { Route, BrowserRouter as Router, Routes, useNavigate } from 'react-router-dom';
import Home from './components/Home';



function App() {
  
  

  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Login/>}/>
        <Route path='/' element={<DashboardComponent/>} />
        <Route path='/signup' element={<Signup/>} />
        <Route path='/home' element={<Home/>} />

      </Routes>
    </Router>

  );
}


export default App;