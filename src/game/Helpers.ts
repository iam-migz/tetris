import { formatDistance } from "date-fns";
import { HighScoresType } from "../types";

export function renderTopScores(highscores: HighScoresType[]) {
    const scoresList = document.getElementById("scores-list") as HTMLUListElement;
    scoresList.innerHTML = "";
    highscores.forEach((score, index) => {
        const li = document.createElement("li");
        const date = formatDistance(score.createdAt.toDate(), new Date(), {
                addSuffix: true,
            });
        li.innerHTML = `${index + 1}. ${score.name}: ${score.score} <span class="date">${date}</span>`;
        scoresList.appendChild(li);
    });
}