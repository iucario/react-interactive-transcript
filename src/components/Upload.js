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
    <div>
      <div>
        <label htmlFor="audio-file">Upload audio file:</label>
        <input
          type="file"
          id="audio-file"
          accept="audio/*"
          onChange={handleAudioChange}
        />
      </div>
      <div>
        <label htmlFor="transcript-file">Upload transcript file:</label>
        <input
          type="file"
          id="transcript-file"
          accept=".json"
          onChange={handleTranscriptChange}
        />
      </div>
      <button onClick={handleUpload}>Upload</button>
    </div>
  )
}

export default Upload
