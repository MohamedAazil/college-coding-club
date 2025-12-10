import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import { AppContextProvider } from './context/Context.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <AppContextProvider>
    <BrowserRouter>
        <App />
    </BrowserRouter>
  </AppContextProvider>
)
