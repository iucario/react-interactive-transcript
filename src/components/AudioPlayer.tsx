import { useEffect, useRef, useState } from 'react'

// import components
import Controls from './Controls'
import DisplayTrack from './DisplayTrack'
import FootBar from './FootBar'
import ProgressBar from './ProgressBar'
import Transcript from './Transcript'
import Upload from './Upload'

import { Track, Transcript as TranscriptType } from './types'

const AudioPlayer = () => {
  // states
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [timeProgress, setTimeProgress] = useState<number>(0)
  const [duration, setDuration] = useState<number>(0)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [volume, setVolume] = useState<number>(60)
  const [isMuted, setIsMuted] = useState<boolean>(false)

  // reference
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const progressBarRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const handleKeyDown = (event: KeyboardEvent) => {
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
      setIsMuted((prev) => !prev)
    }
  }

  const handleNext = () => {
    console.warn('Multiple tracks not supported yet')
  }

  const handleTranscriptUpload = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target === null || typeof e.target.result !== 'string') return
      const transcript = JSON.parse(e.target.result) as TranscriptType
      setCurrentTrack((prev) => ({ ...prev, transcript } as Track))
    }
    reader.readAsText(file)
  }

  const handleUpload = (audioFile: File, transcriptFile: File) => {
    console.log(audioFile, transcriptFile)
    const track = {
      title: audioFile.name,
      src: URL.createObjectURL(audioFile),
      author: 'Uploaded',
    }
    setCurrentTrack(track)
    handleTranscriptUpload(transcriptFile)
  }

  return (
    <>
      {!currentTrack && <Upload onUpload={handleUpload} />}
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
                isMuted,
                setIsMuted,
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
      <FootBar />
    </>
  )
}
export default AudioPlayer
