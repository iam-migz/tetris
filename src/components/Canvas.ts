import { create } from '../helpers';
import s from '../styles/canvas.module.css';

export default function Canvas() {
    const render = () => {
        const canvas = create('div', { 'className': s.container })
        canvas.innerHTML = /*HTML*/`
            <div class="${s.side}">
                <div>
                    <h2>Hold</h2>
                    <canvas id="hold" class="${s.hold}" width="140" height="140"></canvas>
                </div>
                <div>
                    <h2>Score</h2>
                    <p id="score">0</p>
                </div>
            </div>  
    
            <div class="center">
                <canvas id="tetris" class="${s.tetris}" width="200" height="400"></canvas>
            </div>
    
            <div class="${s.side}">
                <div>
                    <h2>Next</h2>
                    <canvas id="next" width="140" height="140"></canvas>
                </div>
                <div style="align-self: flex-end;">
                    <svg id="pause" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM224 191.1v128C224 337.7 209.7 352 192 352S160 337.7 160 320V191.1C160 174.3 174.3 160 191.1 160S224 174.3 224 191.1zM352 191.1v128C352 337.7 337.7 352 320 352S288 337.7 288 320V191.1C288 174.3 302.3 160 319.1 160S352 174.3 352 191.1z"/>
                    </svg>
                </div>
            </div>
        `;
        return canvas;
    }

    return render();
}