import { useRef, useState, useEffect } from 'react'
import { tracks } from '../data/tracks'

// import components
import DisplayTrack from './DisplayTrack'
import Controls from './Controls'
import ProgressBar from './ProgressBar'
import TopBar from './TopBar'
import Transcript from './Transcript'
import Upload from './Upload'

const AudioPlayer = () => {
  // states
  const [trackIndex, setTrackIndex] = useState(0)
  const [currentTrack, setCurrentTrack] = useState(tracks[trackIndex])
  const [timeProgress, setTimeProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(60)
  const [muteVolume, setMuteVolume] = useState(false)
  const [audioFile, setAudioFile] = useState(null)
  const [transcriptFile, setTranscriptFile] = useState(null)

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
    if (trackIndex >= tracks.length - 1) {
      setTrackIndex(0)
      setCurrentTrack(tracks[0])
    } else {
      setTrackIndex((prev) => prev + 1)
      setCurrentTrack(tracks[trackIndex + 1])
    }
  }

  const handleAudioUpload = (file) => {
    setAudioFile(file)
    const track = {
      title: file.name,
      src: URL.createObjectURL(file),
      artist: 'Uploaded',
    }
    setCurrentTrack(track)
    setTrackIndex(0)
  }

  const handleTranscriptUpload = (file) => {
    setTranscriptFile(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      const transcript = JSON.parse(e.target.result)
      setCurrentTrack((prev) => ({ ...prev, transcript }))
    }
  }

  return (
    <>
      <TopBar />
      <Upload
        onAudioUpload={handleAudioUpload}
        onTranscriptUpload={handleTranscriptUpload}
      />
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
              tracks,
              trackIndex,
              setTrackIndex,
              setCurrentTrack,
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
    </>
  )
}
export default AudioPlayer
