import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';

export interface ScoreEntry {
  id: string;
  name: string;
  score: number;
  playMode: string;
  category: string;
  createdAt: any;
}

export interface FootballScoreEntry {
  id: string;
  name: string;
  score: number;
  aiScore: number;
  teamSize: number;
  createdAt: any;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
      emailVerified: null,
      isAnonymous: null,
      tenantId: null,
      providerInfo: []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

const SCORES_COLLECTION = 'scores';
const FOOTBALL_SCORES_COLLECTION = 'football_scores';

/**
 * Saves a new score to the Firestore database
 */
export async function saveScoreToFirestore(
  name: string, 
  score: number, 
  playMode: string, 
  category: string
): Promise<string | null> {
  try {
    const scoresRef = collection(db, SCORES_COLLECTION);
    const docRef = await addDoc(scoresRef, {
      name: name.trim() || 'Тоглогч',
      score: score,
      playMode: playMode,
      category: category,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, SCORES_COLLECTION);
    return null;
  }
}

/**
 * Retrieves the top 10 highest scores from Firestore
 */
export async function getTopScoresFromFirestore(): Promise<ScoreEntry[]> {
  try {
    const scoresRef = collection(db, SCORES_COLLECTION);
    const q = query(
      scoresRef, 
      orderBy('score', 'desc'), 
      limit(10)
    );
    const querySnapshot = await getDocs(q);
    const results: ScoreEntry[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      results.push({
        id: doc.id,
        name: data.name || 'Тоглогч',
        score: Number(data.score) || 0,
        playMode: data.playMode || 'options',
        category: data.category || 'emoji',
        createdAt: data.createdAt
      });
    });
    return results;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, SCORES_COLLECTION);
    return [];
  }
}

/**
 * Saves a football game score to Firestore
 */
export async function saveFootballScoreToFirestore(
  name: string,
  score: number,
  aiScore: number,
  teamSize: number
): Promise<string | null> {
  try {
    const fbRef = collection(db, FOOTBALL_SCORES_COLLECTION);
    const docRef = await addDoc(fbRef, {
      name: name.trim() || 'Тоглогч',
      score: score,
      aiScore: aiScore,
      teamSize: teamSize,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, FOOTBALL_SCORES_COLLECTION);
    return null;
  }
}

/**
 * Retrieves the top 10 football scores from Firestore
 */
export async function getTopFootballScoresFromFirestore(): Promise<FootballScoreEntry[]> {
  try {
    const fbRef = collection(db, FOOTBALL_SCORES_COLLECTION);
    const q = query(
      fbRef,
      orderBy('score', 'desc'),
      limit(10)
    );
    const querySnapshot = await getDocs(q);
    const results: FootballScoreEntry[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      results.push({
        id: doc.id,
        name: data.name || 'Тоглогч',
        score: Number(data.score) || 0,
        aiScore: Number(data.aiScore) || 0,
        teamSize: Number(data.teamSize) || 1,
        createdAt: data.createdAt
      });
    });
    return results;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, FOOTBALL_SCORES_COLLECTION);
    return [];
  }
}
