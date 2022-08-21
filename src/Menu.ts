class Menu {
  menu: HTMLElement;
  heading: HTMLElement;
  startButton: HTMLButtonElement;
  playButton: HTMLButtonElement;
  pauseButton: HTMLButtonElement;
  restartButton: HTMLButtonElement;
  submitScoreButton: HTMLButtonElement;
  nameInput: HTMLInputElement;
  message: HTMLParagraphElement;

  constructor() {
    this.menu = document.querySelector('#overlay') as HTMLElement;
    this.heading = this.menu.querySelector('#overlay-heading') as HTMLElement;
    this.startButton = document.querySelector('#start') as HTMLButtonElement;
    this.playButton = document.querySelector('#play') as HTMLButtonElement;
    this.pauseButton = document.querySelector('#pause') as HTMLButtonElement;
    this.submitScoreButton = document.querySelector(
      '#submitScore'
    ) as HTMLButtonElement;
    this.restartButton = document.querySelector(
      '#restart'
    ) as HTMLButtonElement;
    this.nameInput = document.querySelector('#name') as HTMLInputElement;
    this.message = document.querySelector('#message') as HTMLParagraphElement;
  }
  pauseMenu(
    isGamePaused: boolean,
    headingText: string,
    playButtonText: string
  ) {
    if (isGamePaused === true) {
      this.heading.innerText = headingText;
      this.playButton.innerText = playButtonText;
      this.menu.style.display = 'block';
      this.playButton.style.display = 'block';
      this.startButton.style.display = 'none';
    } else {
      this.menu.style.display = 'none';
    }
  }
  gameOverMenu(isHighScore: boolean, headingText: string, message: string) {
    this.menu.style.display = 'block';
    this.heading.innerText = headingText;
    this.startButton.style.display = 'none';
    this.restartButton.style.display = 'block';
    this.restartButton.innerText = 'Play Again';
    this.playButton.style.display = 'none';
    this.message.style.display = 'block';
    this.message.innerText = message;

    if (isHighScore === true) {
      this.nameInput.style.display = 'block';
      this.submitScoreButton.style.display = 'block';
    } else {
      this.nameInput.style.display = 'none';
      this.submitScoreButton.style.display = 'none';
    }
  }
}

export default Menu;
