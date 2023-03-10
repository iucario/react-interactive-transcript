import { useCallback, useEffect, useRef } from 'react'

// icons
import {
  IoPauseSharp,
  IoPlayBackSharp,
  IoPlayForwardSharp,
  IoPlaySharp,
  IoPlaySkipBackSharp,
  IoPlaySkipForwardSharp,
} from 'react-icons/io5'

import { IoMdVolumeHigh, IoMdVolumeLow, IoMdVolumeOff } from 'react-icons/io'

const Controls = ({
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
}: {
  audioRef: React.MutableRefObject<HTMLAudioElement | null>
  progressBarRef: React.MutableRefObject<HTMLInputElement | null>
  duration: number
  setTimeProgress: (timeProgress: number) => void
  handleNext: () => void
  isPlaying: boolean
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>
  volume: number
  setVolume: (volume: number) => void
  isMuted: boolean
  setIsMuted: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const playAnimationRef = useRef<number | null>(null)

  const togglePlayPause = () => {
    setIsPlaying((prev: boolean) => !prev)
  }

  const repeat = useCallback(() => {
    if (audioRef.current === null || progressBarRef.current === null) return
    const currentTime = audioRef.current.currentTime
    setTimeProgress(currentTime)
    progressBarRef.current.value = currentTime.toString()
    progressBarRef.current.style.setProperty(
      '--range-progress',
      `${(parseFloat(progressBarRef.current.value) / duration) * 100}%`
    )

    if (playAnimationRef.current !== null)
      playAnimationRef.current = requestAnimationFrame(repeat)
  }, [audioRef, duration, progressBarRef, setTimeProgress])

  useEffect(() => {
    if (audioRef.current === null) return
    if (isPlaying) {
      audioRef.current.play()
    } else {
      audioRef.current.pause()
    }
    playAnimationRef.current = requestAnimationFrame(repeat)
  }, [isPlaying, audioRef, repeat])

  const skipForward = () => {
    if (audioRef.current === null) return
    audioRef.current.currentTime += 15
  }

  const skipBackward = () => {
    if (audioRef.current === null) return
    audioRef.current.currentTime -= 15
  }

  const handlePrevious = () => {
    console.warn('Multiple tracks not supported yet')
  }

  useEffect(() => {
    if (audioRef.current === null) return
    audioRef.current.volume = volume / 100
    audioRef.current.muted = isMuted
  }, [volume, audioRef, isMuted])

  return (
    <div className="controls-wrapper">
      <div className="controls">
        <button onClick={handlePrevious}>
          <IoPlaySkipBackSharp />
        </button>
        <button onClick={skipBackward}>
          <IoPlayBackSharp />
        </button>

        <button onClick={togglePlayPause}>
          {isPlaying ? <IoPauseSharp /> : <IoPlaySharp />}
        </button>
        <button onClick={skipForward}>
          <IoPlayForwardSharp />
        </button>
        <button onClick={handleNext}>
          <IoPlaySkipForwardSharp />
        </button>
      </div>
      <div className="volume">
        <button onClick={() => setIsMuted((prev: boolean) => !prev)}>
          {isMuted || volume < 5 ? (
            <IoMdVolumeOff />
          ) : volume < 40 ? (
            <IoMdVolumeLow />
          ) : (
            <IoMdVolumeHigh />
          )}
        </button>
        <input
          type="range"
          min={0}
          max={100}
          value={volume}
          onChange={(e) => setVolume(parseInt(e.target.value))}
          style={{
            background: `linear-gradient(to right, #f50 ${volume}%, #ccc ${volume}%)`,
          }}
        />
      </div>
    </div>
  )
}

export default Controls
