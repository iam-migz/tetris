import { create, get } from '../helpers';
import s from '../styles/highscores.module.css';
import { formatDistance } from 'date-fns';
import { databaseService } from '..';


export const renderTopScores = async (parent?: HTMLElement) => {
    const scores = await databaseService.fetchHighScores()
    
    const scoresList = get<HTMLUListElement>("#scores-list", parent);
    scoresList.innerHTML = "";
    scores.forEach((score, index) => {
        const li = create("li");
        const date = formatDistance(score.createdAt.toDate(), new Date(), {
                addSuffix: true,
            });
        li.innerHTML = `${index + 1}. ${score.name}: ${score.score} <span class="date">${date}</span>`;
        scoresList.appendChild(li);
    });
}

export default function Highscores() {
    const render = () => {
        const highscores = create('div', { 'className': s.highscores })
        highscores.innerHTML = /*HTML*/`
            <div class="${s.highscores}">
                <h3>Top Scorers</h3>
                <ul id="scores-list"></ul>
            </div>
        `;
        renderTopScores(highscores)
        return highscores;
    }

    return render()
}