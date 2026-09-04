import { useState } from 'react'
import profilePicture from './assets/ProfilePicture.jpeg'
import pictureFrame from './assets/pictureFrame_2.png'
import CandleCursor from './CandleCursor'
import GithubContributionCalendar from './GithubContributionCalendar'
import ChessRatingPanel from './ChessRatingPanel'
import LeetCodeActivityPanel from './LeetCodeActivityPanel'
import TodoList from './TodoList'
import MoviesSection from './MoviesSection'
import HobbiesSection from './HobbiesSection'
import ProjectsSection from './ProjectsSection'
import { supabase } from './supabaseClient'

const CONTACT_LINKS = [
  { key: 'resume', label: 'Resume', href: '/Ibrahim_Resume_New_Grad.pdf', external: true },
  { key: 'github', label: 'GitHub', href: 'https://github.com/IbrahimAjmal02', external: true },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/ibrahim-ajmal-a54714207/',
    external: true,
  },
  { key: 'email', label: 'IbrahimAjmal02@gmail.com' },
  { key: 'phone', label: '647-686-4743' },
  { key: 'location', label: 'Toronto, ON, Canada' },
]

const SHOWCASE_ITEMS = [
  { key: 'projects', label: 'Personal Projects', detail: <ProjectsSection /> },
  { key: 'hobbies', label: 'Hobbies', detail: <HobbiesSection /> },
  { key: 'movies', label: 'Movies', detail: <MoviesSection /> },
]

function App() {
  const [activeShowcase, setActiveShowcase] = useState(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [passphrase, setPassphrase] = useState('')
  const [verifyError, setVerifyError] = useState(null)

  function handleShowcaseClick(key) {
    setActiveShowcase((current) => (current === key ? null : key))
  }

  async function handleUnlock(event) {
    event.preventDefault()
    setVerifyError(null)

    const { data, error } = await supabase.rpc('check_passphrase', { input: passphrase })

    if (error || !data) {
      setVerifyError('Incorrect passphrase.')
      return
    }

    setIsUnlocked(true)
    setShowPrompt(false)
  }

  function handleLock() {
    setIsUnlocked(false)
    setShowPrompt(false)
    setPassphrase('')
  }

  const activeItem = SHOWCASE_ITEMS.find((item) => item.key === activeShowcase)

  return (
    <>
      <CandleCursor />

      {!isUnlocked && showPrompt && (
        <div className="modal-backdrop" onClick={() => setShowPrompt(false)}>
          <form
            onSubmit={handleUnlock}
            className="hero-passphrase-form"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close"
              onClick={() => setShowPrompt(false)}
              aria-label="Close"
            >
              ✕
            </button>
            <input
              type="password"
              placeholder="Password"
              value={passphrase}
              onChange={(event) => setPassphrase(event.target.value)}
              autoFocus
            />
            <button type="submit">Unlock</button>
            {verifyError && <p className="todo-error">{verifyError}</p>}
          </form>
        </div>
      )}

      <div className="hallway">
      <div className="carpet" />

      <section className="hero-frame">
        <div className="hero-body">
          <div className="hero-photo-frame">
            <img src={profilePicture} alt="Portrait of [your name]" className="hero-photo" />
            <img src={pictureFrame} alt="" className="hero-photo-border" />

            {!isUnlocked && !showPrompt && (
              <button
                type="button"
                className="hero-secret-button"
                onClick={() => setShowPrompt(true)}
                aria-label="Unlock editing"
              />
            )}

          </div>

          <div className="hero-text">
            <h1>Muhammad Ibrahim Ajmal</h1>
            <nav className="hero-links">
              {CONTACT_LINKS.map((item, index) => (
                <span key={item.key} className="hero-links-item">
                  {index > 0 && (
                    <span className="hero-links-divider" aria-hidden="true">
                      |
                    </span>
                  )}
                  {item.href ? (
                    <a
                      href={item.href}
                      target={item.external ? '_blank' : undefined}
                      rel={item.external ? 'noopener noreferrer' : undefined}
                    >
                      {item.label}
                    </a>
                  ) : (
                    item.label
                  )}
                </span>
              ))}
            </nav>
            <p className="hero-bio">
              I graduated from the University of Waterloo with a degree in Mathematics and a
              minor in Computing. Ambitious, curious, and hard-working, I'm looking for a
              full-time role where I can grow as a software developer and keep sharpening my
              skills. Outside of that, I'm a calm, easygoing person who enjoys meeting
              like-minded people.
            </p>

            <hr className="hero-divider" />
          </div>
        </div>

        <div className="stats-row">
          <div className="stat-panel">
            <h3>GitHub Activity</h3>
            <GithubContributionCalendar />
          </div>

          <div className="stat-panel">
            <h3>Chess.com Rating</h3>
            <ChessRatingPanel />
          </div>

          <div className="stat-panel">
            <h3>LeetCode Activity</h3>
            <LeetCodeActivityPanel />
          </div>
        </div>
      </section>

      <section className="frame frame--wide frame--thin">
        <h3>To-Do</h3>
        <TodoList isUnlocked={isUnlocked} passphrase={passphrase} onLock={handleLock} />
      </section>

      <section className="frame frame--wide frame--thin">
        <div className="showcase-row">
          {SHOWCASE_ITEMS.map((item) => (
            <button
              key={item.key}
              type="button"
              className="showcase-item"
              onClick={() => handleShowcaseClick(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>

        {activeItem && <div className="showcase-detail">{activeItem.detail}</div>}
      </section>
      </div>
    </>
  )
}

export default App
