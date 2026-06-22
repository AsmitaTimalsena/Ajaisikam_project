import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import About from './pages/About'
import MainLayout from './components/MainLayout'

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

      </Routes>
    </BrowserRouter>
  )
}

export default App
