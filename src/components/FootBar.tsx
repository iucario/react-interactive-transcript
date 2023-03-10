import { IoLogoGithub } from 'react-icons/io5'

const FootBar = () => {
  return (
    <div className="top__bar">
      <p>
        This project is based on{' '}
        <a
          href="https://github.com/Ibaslogic/react-audio-player"
          target="_blank"
          rel="noopener noreferrer"
          title="github"
        >
          <IoLogoGithub />
          Ibaslogic/react-audio-player
        </a>
      </p>
    </div>
  )
}

export default FootBar
