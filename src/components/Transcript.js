import webvtt from 'node-webvtt'
import { useEffect, useState, useRef } from 'react'

const Transcript = ({ audioRef, transcript }) => {
  const [transcriptData, setTranscriptData] = useState(null)
  const intervalsRef = useRef(null)

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  useEffect(() => {
    parseTranscript(transcript).then((data) => {
      if (data !== null) {
        const intervals = data.cues.map((cue) => [cue.start, cue.end])
        setTranscriptData(data.cues)
        intervalsRef.current = intervals
      } else {
        setTranscriptData(null)
      }
    })
  }, [transcript])

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowRight') {
      // Next cue
      event.preventDefault()
      if (intervalsRef.current === null) return
      const currentCue = findInterval(
        intervalsRef.current,
        audioRef.current.currentTime
      )
      const nextCue = Math.min(intervalsRef.current.length - 1, currentCue + 1)
      audioRef.current.currentTime = intervalsRef.current[nextCue][0]
    } else if (event.key === 'ArrowLeft') {
      // Previous cue
      event.preventDefault()
      if (intervalsRef.current === null) return
      const currentCue = findInterval(
        intervalsRef.current,
        audioRef.current.currentTime
      )
      const prevCue = Math.max(0, currentCue - 1)
      audioRef.current.currentTime = intervalsRef.current[prevCue][0]
    }
  }

  const handleLineClick = (cue) => {
    audioRef.current.currentTime = cue.start
  }

  return (
    <div className="transcript">
      <h1>Transcript</h1>
      {transcriptData !== null &&
        transcriptData.map((cue) => {
          return (
            <Line
              key={cue.start}
              cue={cue}
              handleClick={handleLineClick}
              currentTime={audioRef.current ? audioRef.current.currentTime : 0}
            />
          )
        })}
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
