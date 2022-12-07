import React from 'react'
import ReactDOM from 'react-dom/client'
import installMagicImg from 'magic-img'
installMagicImg()
import App from './App'
import './index.css'
import 'magic-img/css'


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
