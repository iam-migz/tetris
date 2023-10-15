import Game from "./Game";
import DatabaseService from "./DatabaseService";
import * as Helpers from "./Helpers";

const databaseService = new DatabaseService();

databaseService.fetchHighScores().then((highscores) => {
    Helpers.renderTopScores(highscores);
});

let menu = document.querySelector("#overlay") as HTMLElement;
let heading = menu.querySelector("#overlay-heading") as HTMLElement;
let startButton = document.querySelector("#start") as HTMLButtonElement;

heading.innerText = "Tetris";
startButton.style.display = "block";

startButton.addEventListener("click", async function (event: Event) {
    menu.style.display = "none";
    new Game(databaseService);
});
