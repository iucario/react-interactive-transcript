import { useState, useRef } from 'react'

function Upload({ onUpload }) {
  const [audioFile, setAudioFile] = useState(null)
  const [transcriptFile, setTranscriptFile] = useState(null)
  const audioFileRef = useRef(null)
  const transcriptFileRef = useRef(null)

  const handleAudioChange = (event) => {
    const file = event.target.files[0]
    setAudioFile(file)
    audioFileRef.current.innerText = file.name
  }

  const handleTranscriptChange = (event) => {
    const file = event.target.files[0]
    setTranscriptFile(file)
    transcriptFileRef.current.innerText = file.name
  }

  const handleUpload = () => {
    onUpload(audioFile, transcriptFile)
  }

  return (
    <div className="upload-container">
      <div className="upload-audio">
        <label htmlFor="audio-file" ref={audioFileRef}>
          Upload audio file. (*.mp3, *.wav, ...)
        </label>
        <input
          type="file"
          id="audio-file"
          accept="audio/*"
          onChange={handleAudioChange}
        />
      </div>
      <div className="upload-transcript">
        <label htmlFor="transcript-file" ref={transcriptFileRef}>
          Upload transcript file. (*.json)
        </label>
        <input
          type="file"
          id="transcript-file"
          accept=".json"
          onChange={handleTranscriptChange}
        />
      </div>
      <button onClick={handleUpload} className="btn">
        Upload
      </button>
    </div>
  )
}

export default Upload
