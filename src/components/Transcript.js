import { useEffect } from 'react'

const Transcript = ({ audioRef, transcript }) => {
  const transcriptData = parseTranscript(transcript)
  const startTimes = transcriptData.flat().map((cue) => cue.start)

  useEffect(() => {
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  const handleKeyUp = (event) => {
    if (event.key === 'ArrowRight') {
      // Next cue
      event.preventDefault()
      if (startTimes === null) return
      const currentCue = bisect_right(startTimes, audioRef.current.currentTime)
      const nextCue = Math.min(startTimes.length - 1, currentCue + 1)
      audioRef.current.currentTime = startTimes[nextCue]
    } else if (event.key === 'ArrowLeft') {
      // Previous cue
      event.preventDefault()
      if (startTimes === null) return
      const currentCue = bisect_right(startTimes, audioRef.current.currentTime)
      const prevCue = Math.max(0, currentCue - 1)
      audioRef.current.currentTime = startTimes[prevCue]
    }
  }

  const handleLineClick = (cue) => {
    audioRef.current.currentTime = cue.start
  }

  return (
    <div className="transcript">
      <h1>Transcript</h1>
      <article>
        {transcriptData !== null &&
          transcriptData.map((paragraph, i) => {
            return (
              <Paragraph
                key={i}
                paragraph={paragraph}
                handleClick={handleLineClick}
                currentTime={
                  audioRef.current ? audioRef.current.currentTime : 0
                }
              />
            )
          })}
      </article>
    </div>
  )
}

const Paragraph = ({ paragraph, handleClick, currentTime }) => {
  return (
    <p>
      {paragraph.map((cue) => {
        return (
          <Line
            key={cue.start}
            cue={cue}
            handleClick={handleClick}
            currentTime={currentTime}
          />
        )
      })}
    </p>
  )
}

const Line = ({ cue, handleClick, currentTime }) => {
  const style =
    currentTime >= cue.start && currentTime < cue.end ? 'line active' : 'line'

  return (
    <span className={style} onClick={() => handleClick(cue)}>
      {cue.text}&nbsp;
    </span>
  )
}

/**Parse TED transcript data paragraphs JSON */
const parseTranscript = (transcriptData) => {
  const paragraphs = transcriptData.map((para) => {
    const cues = para.cues.map((cue) => {
      const millisec = cue.time
      return {
        start: millisec / 1000,
        text: cue.text,
      }
    })
    return cues
  })

  const startTimes = paragraphs.flat().map((cue) => cue.start)
  const endTimes = startTimes.concat([1e10])
  let i = 0 // I hate this but its easy
  const paragraphsWithEndTimes = paragraphs.map((para) => {
    return para.map((cue) => {
      i += 1
      return { ...cue, end: endTimes[i] }
    })
  })

  return paragraphsWithEndTimes
}

function bisect_right(startTimes, time) {
  let low = 0
  let high = startTimes.length - 1

  if (time < startTimes[low]) return -1

  while (low < high) {
    const mid = Math.floor((low + high) / 2)
    if (startTimes[mid] < time) {
      low = mid + 1
    } else {
      high = mid
    }
  }
  // FIXME: bisect_right but something is wrong. This is a hack.
  if (startTimes[low] > time) {
    low -= 1
  }
  return low
}

export default Transcript
