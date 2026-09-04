import odysseyImg from './assets/TheOdyssey.jpeg'
import godfather1Img from './assets/theGodFather.jpeg'
import godfather2Img from './assets/Thegodfather2.jpg'
import darkKnightImg from './assets/thedarkknight.jpg'
import ingloriousImg from './assets/inglorious.jpg'
import djangoImg from './assets/django.jpg'
import hateful8Img from './assets/hateful8.jpeg'
import madagascarImg from './assets/madagascar.jpg'
import lionKingImg from './assets/lionking.jpg'
import aladdinImg from './assets/alladin.jpg'
import crownImg from './assets/crown.png'

const MOVIES = [
  {
    type: 'single',
    title: 'The Odyssey',
    rating: '9.8/10',
    review: "This might have some recency bias. The story of Odysseus has always intrigued me, along with other Greek heroes like Achilles, Hercules, and Perseus. Genuinely one of my favourite watches in a theatre. I was forced to watch it twice. Nolan's magnum opus. Matt Damon, amazing. The monologue with Penelope, amazing. The massacre of Troy, amazing. So much to feel: humility, fate, guilt, greed, desperation, loss, love.",
    side: 'left',
    poster: odysseyImg,
  },
  {
    type: 'group',
    title: 'The Godfather 1 & 2',
    rating: '9.7/10',
    review: "The two together are arguably the greatest pieces of fiction ever made. Michael Corleone is the best-written character to have graced the screen. I could make another whole list of Mafia movies because I want to include Scorsese as well, but my top 5 can't be riddled with the same genre. I must show diversity. A timeless piece. Not much more to say: the movies speak for themselves. 7 hours of my life I wish I could forget, just so I could relive them for the first time.",
    side: 'right',
    posters: [
      { src: godfather1Img, alt: 'The Godfather' },
      { src: godfather2Img, alt: 'The Godfather Part II' },
    ],
  },
  {
    type: 'single',
    title: 'The Dark Knight',
    rating: '9.5/10',
    review: "The pinnacle of superhero movies. This may not be the hope-inspiring Spider-Man or Superman movie you expect from superheroes, but a dive into the realities and twisted minds of criminals and good people alike. Phenomenal characters all around: Jim Gordon, Harvey Dent, the Joker, and of course Batman. Every moment felt intense. The mind of the Joker really leaves an impression on the viewer.",
    side: 'left',
    poster: darkKnightImg,
  },
  {
    type: 'group',
    title: 'Favorite Tarantino Film (too close to call)',
    rating: '9.5/10',
    review: "Tarantino is my personal favourite director of all time. I could provide you with a list of just his movies if need be. I cannot single one out, but this three-movie run is probably the best run I have ever seen: the comedy, the tragedy, the intensity, the action, the characters, the acting, the dialogue, the screenplay. The perfect mixture of ingredients to make movies that immerse you in a scene. You feel as though you are with these characters in this room, waiting for events to unfold. Tarantino is simply magic.",
    side: 'right',
    posters: [
      { src: ingloriousImg, alt: 'Inglourious Basterds' },
      { src: djangoImg, alt: 'Django Unchained' },
      { src: hateful8Img, alt: 'The Hateful Eight' },
    ],
  },
  {
    type: 'group',
    title: 'Childhood Animated Movies',
    rating: '9.3/10',
    review: "I could go on for days about animated movies and how they formed me as a child and a grown-up. I sadly cannot pick one movie, but I can pick companies (DreamWorks, Pixar, and Disney) that have formed my humor, personality, and taste from the moment I could comprehend what was happening. Timeless magic in the nostalgia-filled Disney movies (the drawn animation paired with the music) is still unmatched to this day. The DreamWorks humor was top notch; no children's movie has come close since. I will continue the tradition. If I have kids one day, they too will experience this joy.",
    side: 'left',
    posters: [
      { src: madagascarImg, alt: 'Madagascar' },
      { src: lionKingImg, alt: 'The Lion King' },
      { src: aladdinImg, alt: 'Aladdin' },
    ],
  },
]

function MoviesSection() {
  return (
    <ol className="movies-list">
      {MOVIES.map((movie, index) => {
        const rank = index + 1

        if (movie.type === 'group') {
          const posterSizeClass = movie.posters.length > 2 ? 'movie-poster--small' : ''
          return (
            <li
              key={movie.title}
              className={`movie-entry movie-entry--group movie-entry--${movie.side === 'right' ? 'right' : 'left'}`}
            >
              <div className="movie-poster-group">
                {movie.posters.map((poster, posterIndex) => (
                  <div key={poster.alt} className="movie-poster-wrap">
                    {rank === 1 && posterIndex === 0 && (
                      <img className="movie-poster-crown" src={crownImg} alt="" />
                    )}
                    <img className={`movie-poster ${posterSizeClass}`} src={poster.src} alt={poster.alt} />
                  </div>
                ))}
              </div>
              <div className="movie-info">
                <h4>
                  {rank}. {movie.title}
                </h4>
                <p className="movie-rating">Rating: {movie.rating}</p>
                <p className="movie-review">{movie.review}</p>
              </div>
            </li>
          )
        }

        return (
          <li
            key={movie.title}
            className={`movie-entry movie-entry--single movie-entry--${movie.side === 'right' ? 'right' : 'left'}`}
          >
            <div className="movie-poster-wrap">
              {rank === 1 && <img className="movie-poster-crown" src={crownImg} alt="" />}
              <img className="movie-poster" src={movie.poster} alt={movie.title} />
            </div>
            <div className="movie-info">
              <h4>
                {rank}. {movie.title}
              </h4>
              <p className="movie-rating">Rating: {movie.rating}</p>
              <p className="movie-review">{movie.review}</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

export default MoviesSection
