import Canvas from '../components/Canvas';
import Highscores from '../components/Highscores';
import Menu from '../components/Menu';
import { get } from '../helpers';
import '../styles/index.module.css';

export default function Home() {
    
  const root = get("#root");
  root.appendChild(Canvas());
  root.appendChild(Highscores());
  root.appendChild(Menu());
}