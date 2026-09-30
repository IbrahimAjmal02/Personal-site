import ritaSkeeterImg from './assets/ritaSkeeter.png'
import bestEverImg from './assets/bestever.png'

const PROJECTS = [
  {
    title: 'Rita Skeeter',
    description:
      "My introduction to working with the OpenAI API. Named after the meddling journalist from the Harry Potter world, Rita Skeeter is a virtual interviewer that listens to a recorded interview session and, based on a given prompt, gives feedback on what went well and what could be improved. A video critiquing feature may be added soon.",
    link: 'https://voice-prompt-interview-mbkv.vercel.app/',
    side: 'left',
    photos: [ritaSkeeterImg],
  },
  {
    title: 'BestEver',
    description:
      'A website that will finally put an end to the age-old debate of what is the best ever. A free voting platform where people can express what they believe is the best ever in a given category, with results recorded and displayed as a running universal poll for each category.',
    link: 'https://www.bestever.live/',
    side: 'right',
    photos: [bestEverImg],
  },
  {
    title: 'PantherTech',
    comingSoon: true,
    description:
      'An upcoming project management tool built for drone companies, designed to reduce misplacement costs, increase efficiency, and boost productivity.',
    side: 'left',
    photos: [null],
  },
]

function ProjectsSection() {
  return (
    <ol className="projects-list">
      {PROJECTS.map((project, index) => {
        const rank = index + 1
        const smallClass = project.photos.length > 4 ? 'project-photo--small' : ''
        const groupClass = project.photos.length === 4 ? 'project-photo-group--grid2' : ''
        return (
          <li
            key={project.title}
            className={`project-entry project-entry--${project.side === 'right' ? 'right' : 'left'}`}
          >
            <div className={`project-photo-group ${groupClass}`}>
              {project.photos.map((photo, photoIndex) =>
                photo ? (
                  <img
                    key={photoIndex}
                    className={`project-photo ${smallClass}`}
                    src={photo}
                    alt={project.title}
                  />
                ) : (
                  <div key={photoIndex} className={`project-photo project-photo--placeholder ${smallClass}`}>
                    {project.comingSoon ? 'Coming Soon' : 'Photo'}
                  </div>
                ),
              )}
            </div>
            <div className="project-info">
              <h4>
                {rank}. {project.title}
                {project.comingSoon && <span className="project-badge">Coming Soon</span>}
              </h4>
              <p className="project-description">{project.description}</p>
              {project.link && (
                <a className="project-link" href={project.link} target="_blank" rel="noreferrer">
                  View Project
                </a>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

export default ProjectsSection
