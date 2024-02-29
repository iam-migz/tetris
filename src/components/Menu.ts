import Game from '../game/Game';
import { create, get } from '../helpers';
import s from '../styles/menu.module.css';

export default function Menu() {
    const render = () => {
        const menu = create('div', { 'className': s.menu })
        menu.innerHTML = /*HTML*/`
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

        const start = get('#start', menu);
        start.addEventListener('click', function() {
            menu.style.display = 'none';
            new Game();
        })

        return menu;
    }

    return render()
}