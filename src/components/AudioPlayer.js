import { useRef, useState, useEffect } from 'react'
import { tracks } from '../data/tracks'

// import components
import DisplayTrack from './DisplayTrack'
import Controls from './Controls'
import ProgressBar from './ProgressBar'
import TopBar from './TopBar'
import Transcript from './Transcript'

const AudioPlayer = () => {
  // states
  const [trackIndex, setTrackIndex] = useState(0)
  const [currentTrack, setCurrentTrack] = useState(tracks[trackIndex])
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
    event.preventDefault()
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
    } else if (event.key === 'ArrowRight') {
      // Next sentence
    } else if (event.key === 'ArrowLeft') {
      // Previous sentence
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

  return (
    <>
      <TopBar />
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
          <Transcript
            audioRef={audioRef}
            transcript={currentTrack.transcript}
          />
        </div>
      </div>
    </>
  )
}
export default AudioPlayer
