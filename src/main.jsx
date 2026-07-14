import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Development: handle Back-Forward Cache (bfcache) restores which
// can cause the Vite HMR WebSocket to fail with "Page entered Back-Forward Cache".
// When a page is restored from bfcache (`event.persisted === true`), reload
// so the dev client re-establishes the HMR WebSocket cleanly.
if (typeof window !== 'undefined') {
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      window.location.reload();
    }
  });
}