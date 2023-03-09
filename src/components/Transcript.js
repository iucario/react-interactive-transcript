import webvtt from 'node-webvtt'
import { useEffect, useState } from 'react'

const Transcript = ({ audioRef, transcript }) => {
  const [progress, setProgress] = useState(0)
  const [transcriptData, setTranscriptData] = useState(null)

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  useEffect(() => {
    parseTranscript(transcript).then((data) => {
      if (data !== null) {
        setTranscriptData(data.cues)
      } else {
        setTranscriptData(null)
      }
    })
  }, [transcript])

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      // Next cue
    } else if (event.key === 'ArrowLeft') {
      // Previous cue
    }
  }

  const handleSeek = () => {
    audioRef.current.currentTime = progress
  }

  const handleLineClick = (cue) => {
    audioRef.current.currentTime = cue.start
  }

  const handleProgressChange = (event) => {
    setProgress(event.target.value)
  }

  return (
    <div>
      <input
        type="number"
        value={progress}
        step={1}
        min={0}
        max={audioRef.current ? audioRef.current.duration : 0}
        onChange={handleProgressChange}
      />
      <button onClick={handleSeek}>Seek</button>

      <div className="transcript">
        <h1>Transcript</h1>
        {transcriptData !== null &&
          transcriptData.map((cue) => {
            return (
              <Line
                key={cue.start}
                cue={cue}
                handleClick={handleLineClick}
                currentTime={
                  audioRef.current ? audioRef.current.currentTime : 0
                }
              />
            )
          })}
      </div>
    </div>
  )
}

const Line = ({ cue, handleClick, currentTime }) => {
  const style =
    currentTime >= cue.start && currentTime <= cue.end ? 'line active' : 'line'

  return (
    <span className={style} onClick={() => handleClick(cue)}>
      {cue.text}&nbsp;
    </span>
  )
}

const parseTranscript = async (vttFile) => {
  if (!vttFile) return null
  const data = await fetch(vttFile)
  const text = await data.text()
  try {
    const parsed = webvtt.parse(text)
    if (parsed.valid) {
      return parsed
    }
  } catch (e) {
    console.log(e)
  }
  return null
}

function findInterval(intervals, time) {
  let start = 0
  let end = intervals.length - 1
  while (start <= end) {
    const mid = Math.floor((start + end) / 2)
    const [intervalStart, intervalEnd] = intervals[mid]
    if (time >= intervalStart && time <= intervalEnd) {
      return mid
    } else if (time < intervalStart) {
      end = mid - 1
    } else {
      start = mid + 1
    }
  }
  return -1 // interval not found
}

export default Transcript
