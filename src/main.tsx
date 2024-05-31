import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './pages/App'
import {NextUIProvider} from '@nextui-org/react'
import { SpotifyTokenProvider } from './components/SpotifyToken';

import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
    <SpotifyTokenProvider>
      <NextUIProvider>
        <App />
      </NextUIProvider>
    </SpotifyTokenProvider>,
)
