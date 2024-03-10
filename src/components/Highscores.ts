import { create, get } from '../utils';
import s from '../styles/highscores.module.css';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import DatabaseService, { mockData } from '../utils/DatabaseService';

export const renderTopScores = async (parent?: HTMLElement) => {
  const scores = await DatabaseService.fetchHighScores();
  // const scores = await mockData();

  const scoresList = get<HTMLUListElement>('#scores-list', parent);
  scoresList.innerHTML = '';
  scores.forEach((score, index) => {
    const li = create('li');
    li.innerHTML = /* HTML */`
      <span class="${s.small}">${index + 1}.</span> 
      ${score.name}: <span class="${s.score}">${score.score}</span>
      <span class="${s.date}">${score.createdAt}</span>
    `;
    scoresList.appendChild(li);
  });
};

export default function Highscores() {
  const render = () => {
    const highscores = create('div', { className: s.highscores });
    highscores.innerHTML = /* HTML */`
			<div class="${s.highscores}">
				<h3>Top Scorers</h3>
				<ul id="scores-list"></ul>
			</div>
		`;
    renderTopScores(highscores);
    return highscores;
  };

  return render();
}
