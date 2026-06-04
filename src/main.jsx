import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './styles/index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3800,
            style: {
              borderRadius: '14px',
              border: '1px solid #e8dfd2',
              background: '#ffffff',
              color: '#0f172a',
              boxShadow: '0 18px 45px rgba(15,23,42,0.12)',
              fontSize: '14px',
              maxWidth: '420px',
            },
          }}
        />
      </HelmetProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
