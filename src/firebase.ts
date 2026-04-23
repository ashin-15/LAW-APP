import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged as _onAuthStateChanged,
  type User,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
  query,
  orderBy,
  serverTimestamp,
  limit,
} from 'firebase/firestore';
import type { Message, ChatSession } from './types';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();

// Handle redirect result on page load
getRedirectResult(auth).catch((error) => {
  console.error('Redirect result error:', error);
});

export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string };
    console.error('Popup sign-in failed, trying redirect:', err.code);

    if (
      err.code === 'auth/popup-blocked' ||
      err.code === 'auth/popup-closed-by-user' ||
      err.code === 'auth/cancelled-popup-request' ||
      err.message?.includes('Cross-Origin-Opener-Policy')
    ) {
      await signInWithRedirect(auth, googleProvider);
      return null;
    }
    throw error;
  }
}

export async function signOutUser() {
  await signOut(auth);
}

export function onAuthStateChanged(callback: (user: User | null) => void) {
  return _onAuthStateChanged(auth, callback);
}

// ============ Firestore Document Operations ============

export interface FirestoreDoc {
  id: string;
  title: string;
  content: string;
  sections: string[];
  type: 'file' | 'text';
  createdAt: unknown;
}

export async function saveDocument(
  uid: string,
  doc_data: { title: string; content: string; sections: string[]; type: 'file' | 'text' }
) {
  const colRef = collection(db, 'users', uid, 'documents');
  const docRef = await addDoc(colRef, {
    ...doc_data,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getDocuments(uid: string): Promise<FirestoreDoc[]> {
  const colRef = collection(db, 'users', uid, 'documents');
  const q = query(colRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as FirestoreDoc[];
}

export async function deleteDocument(uid: string, docId: string) {
  const docRef = doc(db, 'users', uid, 'documents', docId);
  await deleteDoc(docRef);
}

// ============ Chat History Operations ============

interface FirestoreChatSession {
  title: string;
  messages: Array<{
    id: string;
    role: 'user' | 'assistant';
    content: string;
    sources?: string[];
    timestamp: string;
  }>;
  createdAt: unknown;
  updatedAt: unknown;
}

export async function saveChatSession(
  uid: string,
  session: ChatSession
): Promise<string> {
  const docRef = doc(db, 'users', uid, 'chats', session.id);
  const data: FirestoreChatSession = {
    title: session.title,
    messages: session.messages.map((m) => ({
      id: m.id,
      role: m.role,
      content: m.content,
      sources: m.sources,
      timestamp: m.timestamp.toISOString(),
    })),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  await setDoc(docRef, data, { merge: true });
  return session.id;
}

export async function getChatSessions(uid: string): Promise<ChatSession[]> {
  const colRef = collection(db, 'users', uid, 'chats');
  const q = query(colRef, orderBy('updatedAt', 'desc'), limit(30));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => {
    const data = d.data() as FirestoreChatSession;
    return {
      id: d.id,
      title: data.title || 'Untitled Chat',
      messages: (data.messages || []).map((m) => ({
        ...m,
        timestamp: new Date(m.timestamp),
      })),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });
}

export async function deleteChatSession(uid: string, chatId: string) {
  const docRef = doc(db, 'users', uid, 'chats', chatId);
  await deleteDoc(docRef);
}
