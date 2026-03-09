import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@knapsack-cloud/demo/styles';
import '@knapsack/sandbox-components/css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
