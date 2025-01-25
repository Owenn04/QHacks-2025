import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Camera from './pages/Camera.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import AddMeal from './pages/AddMeal.jsx'
import Tracker from './pages/Tracker.jsx'
import Profile from './pages/Profile.jsx'
import Welcome from './pages/Welcome.jsx'

import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/camera" element={<Camera />} />
        <Route path="/addmeal" element={<AddMeal />} />
        <Route path="/tracker" element={<Tracker />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/welcome" element={<Welcome />} />
      </Routes>
    </Router>
  )
 }
 
 export default App
