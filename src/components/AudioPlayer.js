import { useEffect, useRef, useState } from 'react'

// import components
import Controls from './Controls'
import DisplayTrack from './DisplayTrack'
import ProgressBar from './ProgressBar'
import TopBar from './TopBar'
import Transcript from './Transcript'
import Upload from './Upload'

const AudioPlayer = () => {
  // states
  const [currentTrack, setCurrentTrack] = useState(null)
  const [timeProgress, setTimeProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(60)
  const [muteVolume, setMuteVolume] = useState(false)

  // reference
  const audioRef = useRef()
  const progressBarRef = useRef()

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const handleKeyDown = (event) => {
    const availableKeys = [' ', 'ArrowUp', 'ArrowDown', 'm']
    if (availableKeys.includes(event.key)) event.preventDefault()

    if (event.key === ' ') {
      // toggle pause/play
      setIsPlaying((prev) => !prev)
    } else if (event.key === 'ArrowUp') {
      // increase volume
      setVolume((prev) => Math.min(100, prev + 10))
    } else if (event.key === 'ArrowDown') {
      // decrease volume
      setVolume((prev) => Math.max(0, prev - 10))
    } else if (event.key === 'm') {
      // toggle mute
      setMuteVolume((prev) => !prev)
    }
  }

  const handleNext = () => {
    console.warn('Multiple tracks not supported yet')
  }

  const handleTranscriptUpload = (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const transcript = JSON.parse(e.target.result)
      setCurrentTrack((prev) => ({ ...prev, transcript }))
    }
    reader.readAsText(file)
  }

  const handleUpload = (audioFile, transcriptFile) => {
    console.log(audioFile, transcriptFile)
    const track = {
      title: audioFile.name,
      src: URL.createObjectURL(audioFile),
      artist: 'Uploaded',
    }
    setCurrentTrack(track)
    handleTranscriptUpload(transcriptFile)
  }

  return (
    <>
      <TopBar />
      <Upload onUpload={handleUpload} />
      {currentTrack && (
        <div className="audio-player">
          <div className="inner">
            <DisplayTrack
              {...{
                currentTrack,
                audioRef,
                setDuration,
                progressBarRef,
                handleNext,
              }}
            />
            <Controls
              {...{
                audioRef,
                progressBarRef,
                duration,
                setTimeProgress,
                handleNext,
                isPlaying,
                setIsPlaying,
                volume,
                setVolume,
                muteVolume,
                setMuteVolume,
              }}
            />
            <ProgressBar
              {...{ progressBarRef, audioRef, timeProgress, duration }}
            />
            {currentTrack.transcript && (
              <Transcript
                audioRef={audioRef}
                transcript={currentTrack.transcript}
              />
            )}
          </div>
        </div>
      )}
    </>
  )
}
export default AudioPlayer
