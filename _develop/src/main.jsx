import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppSora from './AppSora.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppSora />
  </StrictMode>
)
