import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { DesignProvider } from './context/DesignContext'
import { ThemeProvider } from './context/ThemeContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <DesignProvider>
          <App />
        </DesignProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
