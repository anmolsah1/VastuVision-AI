import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { DesignProvider } from './context/DesignContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <DesignProvider>
        <App />
      </DesignProvider>
    </BrowserRouter>
  </StrictMode>,
)
