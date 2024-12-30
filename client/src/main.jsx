import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './components/App'
import './index.css'
import Navbar from './components/navbar'

createRoot(document.getElementById('root')).render(
  
  <StrictMode>
    <Navbar />
    <App />
  </StrictMode>,
)
