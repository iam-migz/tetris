import Game from "./game/Game";
import Home from './pages/Home';
import { create } from './helpers';
import DatabaseService from "./game/DatabaseService";

export const databaseService = new DatabaseService()

document.body.appendChild(create('div', { id: 'root' }))
Home()
