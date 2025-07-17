import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/base.scss'

createRoot(document.getElementById('root')!).render(
    <App />
)
