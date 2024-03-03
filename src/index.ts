import { create, get } from './utils';
import './styles/index.module.css';
import Canvas from './components/Canvas';
import Highscores from './components/Highscores';
import Menu from './components/Menu';
// import Game from './game/Game';

document.body.appendChild(create('div', { id: 'root' }));
const root = get('#root');
root.appendChild(Canvas());
root.appendChild(Highscores());

root.appendChild(Menu());

const start = get('#start');
const menu = get('#menu');

// const startGame = () => new Game();

start.addEventListener('click', () => {
  menu.style.display = 'none';
  // startGame();
});
