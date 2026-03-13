import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [pathname])
  return null
}
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Landing from './pages/Landing'
import Product from './pages/Product'
import HowItWorks from './pages/HowItWorks'
import UseCases from './pages/UseCases'
import Marketplace from './pages/Marketplace'
import Workers from './pages/Workers'
import Developers from './pages/Developers'
import Verification from './pages/Verification'
import Architecture from './pages/Architecture'
import Demo from './pages/Demo'
import FAQ from './pages/FAQ'

export default function App() {
  return (
    <BrowserRouter basename="/bitgrid">
      <ScrollToTop />
      <div className="min-h-screen bg-bg-dark flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/product" element={<Product />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/use-cases" element={<UseCases />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/workers" element={<Workers />} />
            <Route path="/developers" element={<Developers />} />
            <Route path="/verification" element={<Verification />} />
            <Route path="/architecture" element={<Architecture />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/faq" element={<FAQ />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
