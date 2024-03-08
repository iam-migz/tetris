import { formatDistanceToNow } from 'date-fns';
import { initializeApp } from 'firebase/app';
import {
  getFirestore, collection, query, where, orderBy, limit,
  getDocs, CollectionReference, Timestamp, Firestore, addDoc, serverTimestamp, deleteDoc, doc,
} from 'firebase/firestore';

type HighScoresType = {
  id: string;
  name: string;
  score: number;
  createdAt: string;
};

class DatabaseService {
  db: Firestore;

  colRef: CollectionReference;

  constructor() {
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
    this.db = getFirestore();
    this.colRef = collection(this.db, 'highscores');
  }

  async fetchHighScores(): Promise<HighScoresType[]> {
    try {
      const q = query(this.colRef, where('score', '>', 0), orderBy('score', 'desc'), limit(10));
      const querySnapshot = await getDocs(q);
      const highscores = querySnapshot.docs.map((document) => {
        const data = document.data();
        const { id } = document;
        const { name, score, createdAt } = data;
        let date = '..';
        if (createdAt instanceof Timestamp) {
          date = formatDistanceToNow(createdAt.toDate(), {
            addSuffix: true,
          });
        }
        return {
          id, name, score, createdAt: date,
        };
      });
      return highscores;
    } catch (error) {
      console.error('Error getting highscores:', error);
      throw error;
    }
  }

  async storeHighScore(name: string, score: number) {
    try {
      const docData = { name, score, createdAt: serverTimestamp() };
      await addDoc(this.colRef, docData);
      const highscores = await this.fetchHighScores();
      if (highscores.length >= 10) {
        const lastItem = highscores[highscores.length - 1];
        const docRef = doc(this.db, 'highscores', lastItem.id);
        await deleteDoc(docRef);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
}

export default new DatabaseService();

export function mockData(): Promise<HighScoresType[]> {
  return new Promise((resolve) => {
    resolve([
      {
        id: 'Xv3XaXjOBd9CUa0uk7Sw',
        name: 'Player 1',
        score: 999,
        createdAt: new Date().toLocaleDateString(),
      },
    ]);
  });
}
