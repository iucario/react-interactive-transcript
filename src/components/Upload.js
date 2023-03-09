import { useState } from 'react'

function Upload({ onAudioUpload, onTranscriptUpload }) {
  const [audioFile, setAudioFile] = useState(null)
  const [transcriptFile, setTranscriptFile] = useState(null)

  const handleAudioChange = (event) => {
    const file = event.target.files[0]
    setAudioFile(file)
    onAudioUpload(file)
  }

  const handleTranscriptChange = (event) => {
    const file = event.target.files[0]
    setTranscriptFile(file)
    onTranscriptUpload(file)
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
    </div>
  )
}

export default Upload
