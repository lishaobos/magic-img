import React from 'react'
import ReactDOM from 'react-dom/client'
import installMagicImg from 'magic-img'
import App from './App'
import './index.css'
import 'magic-img/dist/index.css'

installMagicImg()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
)
