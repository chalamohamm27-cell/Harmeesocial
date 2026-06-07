import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseAppConfig from './firebase-applet-config.json';

// Simple local simulation store for authentication when Firebase config isn't available
const SIMULATED_USERS_KEY = 'harmee_simulated_users';
const CURRENT_USER_KEY = 'harmee_current_user';

interface SimulatedUser {
  uid: string;
  email: string;
  username: string;
  displayName: string;
  avatar: string;
}

export function getSimulatedUsers(): SimulatedUser[] {
  try {
    const list = localStorage.getItem(SIMULATED_USERS_KEY);
    return list ? JSON.parse(list) : [];
  } catch {
    return [];
  }
}

export function saveSimulatedUser(user: SimulatedUser) {
  const users = getSimulatedUsers();
  users.push(user);
  localStorage.setItem(SIMULATED_USERS_KEY, JSON.stringify(users));
}

// Check if Firebase is actually configured
export function isFirebaseConfigured(): boolean {
  return firebaseAppConfig && 
    firebaseAppConfig.apiKey && 
    firebaseAppConfig.apiKey !== 'YOUR_API_KEY' &&
    firebaseAppConfig.apiKey !== '';
}

// Global Firebase initialization
const app = getApps().length === 0 ? initializeApp(firebaseAppConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseAppConfig.firestoreDatabaseId); // CRITICAL line for applet

// Get initialized auth instance
export function getFirebaseAuth() {
  if (isFirebaseConfigured()) {
    return auth;
  }
  return null;
}

// Unified Authenticated User shape of our app
export interface HarmeeUser {
  uid: string;
  email: string;
  displayName: string;
  username: string;
  avatar: string;
  bio?: string;
}

// Mock users database to fetch pre-made high-quality profile avatars
export const MOCK_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop"
];

// Firestore error boundary support
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
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null
    },
    operationType,
    path
  };
  console.error('Firestore Error details: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Connection test assertion helper
async function testConnection() {
  if (isFirebaseConfigured()) {
    try {
      await getDocFromServer(doc(db, 'test', 'connection'));
      console.log("Firebase Firestore connected successfully!");
    } catch (error) {
      if (error instanceof Error && error.message.includes('the client is offline')) {
        console.error("Please check your Firebase configuration or network.");
      }
    }
  }
}
testConnection();

// Seed basic simulated user
function seedSimulatedDb() {
  const users = getSimulatedUsers();
  if (users.length === 0) {
    saveSimulatedUser({
      uid: 'demo_user_id',
      email: 'demo@harmee.social',
      username: 'harmee_demo',
      displayName: 'Demo User',
      avatar: MOCK_AVATARS[0]
    });
  }
}
seedSimulatedDb();
