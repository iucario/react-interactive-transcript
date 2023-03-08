import { useState, useEffect } from 'react'
import webvtt from 'node-webvtt'

const Transcript = ({ audioRef, transcript }) => {
  const [progress, setProgress] = useState(0)
  const [transcriptData, setTranscriptData] = useState(null)

  useEffect(() => {
    parseTranscript(transcript).then((data) => {
      if (data !== null) {
        setTranscriptData(data.cues)
      }
    })
  }, [transcript])

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

  const handleSeek = () => {
    audioRef.current.currentTime = progress
  }

  const handleLineClick = (cue) => {
    audioRef.current.currentTime = cue.start
  }

  return (
    <div>
      <input
        type="number"
        value={progress}
        step={1}
        min={0}
        max={audioRef.current ? audioRef.current.duration : 0}
        onChange={(e) => setProgress(e.target.value)}
      />
      <button onClick={handleSeek}>Seek</button>

      <div className="transcript">
        <h1>Transcript</h1>
        {transcriptData &&
          transcriptData.map((cue) => {
            return (
              <Line
                key={cue.start}
                cue={cue}
                handleClick={handleLineClick}
                currentLine={
                  audioRef.current ? audioRef.current.currentTime : 0
                }
              />
            )
          })}
      </div>
    </div>
  )
}

const Line = ({ cue, handleClick, currentLine: currentTime }) => {
  const style =
    currentTime >= cue.start && currentTime <= cue.end ? 'line active' : 'line'

  return (
    <span className={style} onClick={() => handleClick(cue)}>
      {cue.text}&nbsp;
    </span>
  )
}

export default Transcript
