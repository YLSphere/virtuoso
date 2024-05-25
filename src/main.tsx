import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './pages/App'


// import Virtuoso from './pages/Virtuoso'

import './index.css'
console.log(window.location.hash)
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
