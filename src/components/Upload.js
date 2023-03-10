import { useState } from 'react'

function Upload({ onUpload }) {
  const [audioFile, setAudioFile] = useState(null)
  const [transcriptFile, setTranscriptFile] = useState(null)

  const handleAudioChange = (event) => {
    const file = event.target.files[0]
    setAudioFile(file)
  }

  const handleTranscriptChange = (event) => {
    const file = event.target.files[0]
    setTranscriptFile(file)
  }

  const handleUpload = () => {
    onUpload(audioFile, transcriptFile)
  }

  return (
    <div className="upload-container">
      <div className="upload-audio">
        <label htmlFor="audio-file">
          Upload audio file
          <input
            type="file"
            id="audio-file"
            accept="audio/*"
            onChange={handleAudioChange}
          />
        </label>
      </div>
      <div className="upload-transcript">
        <label htmlFor="transcript-file">
          Upload transcript file
          <input
            type="file"
            id="transcript-file"
            accept=".json"
            onChange={handleTranscriptChange}
          />
        </label>
      </div>
      <button onClick={handleUpload} className="btn">
        Upload
      </button>
    </div>
  )
}

export default Upload
