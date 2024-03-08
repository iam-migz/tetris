import DatabaseService from '../utils/DatabaseService';
import { create, get } from '../utils';
import s from '../styles/menu.module.css';
import { renderTopScores } from './Highscores';

export default function Menu() {
  const render = () => {
    const menu = create('div', { className: s.menu, id: 'menu' });
    menu.innerHTML = /* HTML */`
			<div class="${s.content}">
				<h2 id="heading">Play Game</h2>
				<p id="message" class="${s.message}"></p>
				<input
					type="text"
					name="name"
					id="name"
					class="${s.name}"
					placeholder="Enter Your Name"
				/>
				<button id="submitScore">Submit</button>
				<button id="start" style="display: block;">Start Game</button>
				<button id="play">Resume</button>
				<button id="restart">Restart</button>
			</div>
		`;
    return menu;
  };
  return render();
}

export const pauseMenu = (
  isGamePaused: boolean,
  headingText: string = 'Paused',
  playButtonText: string = 'Resume',
) => {
  const menu = get('#menu');
  const heading = get('#heading', menu);
  const startButton = get('#start', menu);
  const playButton = get('#play', menu);
  if (isGamePaused) {
    heading.innerText = headingText;
    playButton.innerText = playButtonText;
    menu.style.display = 'block';
    playButton.style.display = 'block';
    startButton.style.display = 'none';
  } else {
    menu.style.display = 'none';
  }
};

export const gameOverMenu = (
  isHighScore: boolean,
  headingText: string,
  msg: string,
) => {
  const menu = get('#menu');
  const startButton = get('#start', menu);
  const playButton = get('#play', menu);
  const restartButton = get('#restart', menu);
  const heading = get('#heading', menu);
  const message = get('#message', menu);
  const nameInput = get('#name', menu);
  const submitScoreButton = get('#submitScore', menu);

  menu.style.display = 'block';
  heading.innerText = headingText;
  startButton.style.display = 'none';
  restartButton.style.display = 'block';
  restartButton.innerText = 'Play Again';
  playButton.style.display = 'none';
  message.style.display = 'block';
  message.innerText = msg;

  if (isHighScore) {
    nameInput.style.display = 'block';
    submitScoreButton.style.display = 'block';
  } else {
    nameInput.style.display = 'none';
    submitScoreButton.style.display = 'none';
  }
};

export const submitNewScore = (score: number) => {
  const menu = get('#menu');
  const message = get('#message', menu);
  const nameInput = get<HTMLInputElement>('#name', menu);
  const submitScoreButton = get('#submitScore', menu);

  message.style.color = 'red';

  if (nameInput.value === '') {
    message.innerText = 'name input empty';
    return;
  } if (nameInput.value.length <= 3) {
    message.innerText = 'name too small';
    return;
  } if (nameInput.value.length > 10) {
    message.innerText = 'name too big';
    return;
  }
  message.style.color = 'white';
  message.style.display = 'none';

  DatabaseService.storeHighScore(nameInput.value, score);
  renderTopScores();

  nameInput.style.display = 'none';
  submitScoreButton.style.display = 'none';
};
