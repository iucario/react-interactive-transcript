import { BsMusicNoteBeamed } from 'react-icons/bs'
import { Track } from './types'

const DisplayTrack = ({
  currentTrack,
  audioRef,
  setDuration,
  progressBarRef,
  handleNext,
}: {
  currentTrack: Track
  audioRef: React.MutableRefObject<HTMLAudioElement | null>
  setDuration: (duration: number) => void
  progressBarRef: React.MutableRefObject<HTMLInputElement | null>
  handleNext: () => void
}) => {
  const onLoadedMetadata = () => {
    if (audioRef.current === null || progressBarRef.current === null) return
    const seconds = audioRef.current.duration
    setDuration(seconds)
    progressBarRef.current.max = seconds.toString()
  }

  return (
    <div>
      <audio
        src={currentTrack.src}
        ref={audioRef}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={handleNext}
      />
      <div className="audio-info">
        <div className="audio-image">
          {currentTrack.thumbnail ? (
            <img src={currentTrack.thumbnail} alt="audio avatar" />
          ) : (
            <div className="icon-wrapper">
              <span className="audio-icon">
                <BsMusicNoteBeamed />
              </span>
            </div>
          )}
        </div>
        <div className="text">
          <p className="title">{currentTrack.title}</p>
          <p>{currentTrack.author}</p>
        </div>
      </div>
    </div>
  )
}
export default DisplayTrack
