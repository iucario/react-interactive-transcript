import React from 'react'
import ReactDOM from 'react-dom/client'
import AudioPlayer from './components/AudioPlayer'

// css
import './styles/index.css'
import './styles/customize-progress-bar.css'

const rootElement = document.getElementById('root') as HTMLElement | null

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <React.StrictMode>
      <AudioPlayer />
    </React.StrictMode>
  )
}
