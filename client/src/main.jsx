import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const isDevMode = !PUBLISHABLE_KEY || PUBLISHABLE_KEY === 'pk_test_xxxx' || PUBLISHABLE_KEY === 'pk_test_placeholder'

if (isDevMode) {
  console.warn('⚡ AlgoZen running in DEV MODE — Clerk auth bypassed. Use dev login.')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isDevMode ? (
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ style: { background: '#1a1a2e', color: '#e2e8f0' } }} />
        <App />
      </BrowserRouter>
    ) : (
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <BrowserRouter>
          <Toaster position="top-right" toastOptions={{ style: { background: '#1a1a2e', color: '#e2e8f0' } }} />
          <App />
        </BrowserRouter>
      </ClerkProvider>
    )}
  </StrictMode>
)
