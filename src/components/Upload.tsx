import React, { useRef, useState } from 'react'

function Upload({ onUpload }: { onUpload: Function }) {
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [transcriptFile, setTranscriptFile] = useState<File | null>(null)
  const audioFileRef = useRef<HTMLLabelElement | null>(null)
  const transcriptFileRef = useRef<HTMLLabelElement | null>(null)

  const handleAudioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files === null) return
    const file = event.target.files[0]
    setAudioFile(file)
    if (audioFileRef.current) audioFileRef.current.innerText = file.name
  }

  const handleTranscriptChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files === null) return
    const file = event.target.files[0]
    setTranscriptFile(file)
    if (transcriptFileRef.current)
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
