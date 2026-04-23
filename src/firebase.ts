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
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';

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

// Handle redirect result on page load (for when popup fails and we fall back to redirect)
getRedirectResult(auth).catch((error) => {
  console.error('Redirect result error:', error);
});

export async function signInWithGoogle() {
  try {
    // Try popup first
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string };
    console.error('Popup sign-in failed, trying redirect:', err.code);
    
    // If popup blocked or COOP error, fall back to redirect
    if (
      err.code === 'auth/popup-blocked' ||
      err.code === 'auth/popup-closed-by-user' ||
      err.code === 'auth/cancelled-popup-request' ||
      err.message?.includes('Cross-Origin-Opener-Policy')
    ) {
      await signInWithRedirect(auth, googleProvider);
      return null; // Redirect will reload the page
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
