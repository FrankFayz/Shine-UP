import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AuthPage from './pages/AuthPage.jsx';

import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App/>
  </StrictMode>,
)
