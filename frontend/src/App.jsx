import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import About from './pages/About'
import MainLayout from './components/MainLayout'
import SeekerProfile from './pages/SeekerProfile'
import MentorProfile from './pages/MentorProfile'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={

          <LandingPage />

        } />
        <Route path="/about" element={
          <MainLayout>
            <About />
          </MainLayout>
        } />

        <Route path='/register' element={
          <MainLayout>
            <RegisterPage />
          </MainLayout>
        }
        />

        <Route path='/login' element={
          <MainLayout>
            <LoginPage />
          </MainLayout>
        }
        />
        <Route
          path="/seeker-profile"
          element={
              <SeekerProfile />
          }
        />

        <Route
          path="/mentor-profile"
          element={
              <MentorProfile />
          }
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App
