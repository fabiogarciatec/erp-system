import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { ColorModeScript } from '@chakra-ui/react'
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ColorModeScript initialColorMode="light" />
    <App />
  </React.StrictMode>,
)
