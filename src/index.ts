import Game from './Game';

let menu = document.querySelector('#overlay') as HTMLElement;
let heading = menu.querySelector('#overlay-heading') as HTMLElement;
let startButton = document.querySelector('#start') as HTMLButtonElement;

heading.innerText = 'Tetris';
startButton.style.display = 'block';

startButton.addEventListener('click', function (event: Event) {
  menu.style.display = 'none';
  new Game();
});
