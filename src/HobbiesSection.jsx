import petraImg from './assets/Petra.jpg'
import portugal2Img from './assets/Portugal2.jpg'
import japImg from './assets/jap.jpg'
import japanImg from './assets/japan.jpg'
import portugalImg from './assets/portugal.jpg'
import saudiaImg from './assets/saudia.jpg'
import saudia2Img from './assets/saudia2.jpg'
import thaiImg from './assets/thai.jpg'
import stephKDBronImg from './assets/StephKDBron.jpg'
import kevinDurantImg from './assets/kevinDurant.webp'
import neymarImg from './assets/Neymar.jpeg'
import lolImg from './assets/LOL.jpeg'
import rdr2Img from './assets/RDR2.jpg'
import leagueImg from './assets/league.jpg'
import akCityImg from './assets/AKcity.jpg'

const HOBBIES = [
  {
    title: 'Travelling',
    lines: [
      'Countries visited: Japan, Portugal, Saudi Arabia, Pakistan, USA (NYC, LA, SF), Thailand, Dominican Republic, Turkey',
      'Want to go: Italy, Spain, England, France, China, Brazil, Kenya, Egypt, Maldives, Germany, and more',
    ],
    side: 'left',
    photos: [petraImg, portugalImg, portugal2Img, saudiaImg, saudia2Img, japImg, japanImg, thaiImg],
  },
  {
    title: 'Basketball & Soccer',
    lines: [
      '1x ROPSSAA Champion (Basketball)',
      '1x local Sunday league Soccer Champion (3x finals appearances)',
    ],
    side: 'right',
    photos: [stephKDBronImg, kevinDurantImg, neymarImg],
  },
  {
    title: 'Video Games',
    lines: [
      'Especially League of Legends!',
      'Also big on story games: GTA, RDR2, GOW, Arkham games.',
      'COD, FIFA, 2K, and other online casual games too.',
    ],
    side: 'left',
    photos: [lolImg, rdr2Img, leagueImg, akCityImg],
  },
]

function HobbiesSection() {
  return (
    <ol className="hobbies-list">
      {HOBBIES.map((hobby, index) => {
        const rank = index + 1
        const smallClass = hobby.photos.length > 4 ? 'hobby-photo--small' : ''
        const groupClass = hobby.photos.length === 4 ? 'hobby-photo-group--grid2' : ''
        return (
          <li
            key={hobby.title}
            className={`hobby-entry hobby-entry--${hobby.side === 'right' ? 'right' : 'left'}`}
          >
            <div className={`hobby-photo-group ${groupClass}`}>
              {hobby.photos.map((photo, photoIndex) =>
                photo ? (
                  <img
                    key={photoIndex}
                    className={`hobby-photo ${smallClass}`}
                    src={photo}
                    alt={hobby.title}
                  />
                ) : (
                  <div key={photoIndex} className={`hobby-photo hobby-photo--placeholder ${smallClass}`}>
                    Photo
                  </div>
                ),
              )}
            </div>
            <div className="hobby-info">
              <h4>
                {rank}. {hobby.title}
              </h4>
              {hobby.lines?.map((line) => (
                <p key={line} className="hobby-caption">
                  {line}
                </p>
              ))}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

export default HobbiesSection
