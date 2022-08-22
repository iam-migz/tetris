import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  onSnapshot,
  Timestamp,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';
import { formatDistance } from 'date-fns';
import Game from './Game';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDDOpqVOYyNZg1jfpVlHkmOTdB26C2o6Bg',
  authDomain: 'tetris-42db2.firebaseapp.com',
  projectId: 'tetris-42db2',
  storageBucket: 'tetris-42db2.appspot.com',
  messagingSenderId: '946992964471',
  appId: '1:946992964471:web:ee59687f2f59c52ca0f772',
  measurementId: 'G-CMS24Y7R0P',
};

initializeApp(firebaseConfig);
const db = getFirestore();
const colRef = collection(db, 'highscores');
type HighScoresType = {
  id: string;
  name: string;
  score: number;
  createdAt: Timestamp;
};
let scoresList = document.getElementById('scores-list') as HTMLUListElement;
const q = query(
  colRef,
  where('score', '>', 0),
  orderBy('score', 'desc'),
  limit(10)
);
let highscores: HighScoresType[] = [];
onSnapshot(q, (snapshot) => {
  highscores = [];
  snapshot.docs.map((doc, index) => {
    const data = doc.data();
    const id = doc.id;
    const name = data.name;
    const score = data.score;
    const createdAt = data.createdAt;
    highscores.push({ id, name, score, createdAt });
  });
  scoresList.innerHTML = '';
  highscores.map((score, index) => {
    const li = document.createElement('li');
    let date: string | Date = new Date();
    if (score.createdAt) {
      date = formatDistance(score.createdAt.toDate(), new Date(), {
        addSuffix: true,
      });
    }
    li.innerHTML = `${index + 1}. ${score.name}: ${
      score.score
    } <span class="date">${date}</span>`;
    scoresList.appendChild(li);
  });
});

let menu = document.querySelector('#overlay') as HTMLElement;
let heading = menu.querySelector('#overlay-heading') as HTMLElement;
let startButton = document.querySelector('#start') as HTMLButtonElement;

heading.innerText = 'Tetris';
startButton.style.display = 'block';

startButton.addEventListener('click', function (event: Event) {
  menu.style.display = 'none';
  new Game(highscores, colRef, db);
});

/*
TODO
--
1. how to have background in canvas
2. make borders/margin on each block of tetris
*/
