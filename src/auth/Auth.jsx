import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc, collection, getFirestore } from 'firebase/firestore'; 
import { auth, db } from '../firebase';

const provider = new GoogleAuthProvider();

export const getCurrentUser = () => auth.currentUser;

export const initializeAuth = (callback) => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          name: user.displayName,
          createdAt: new Date()
        }, { merge: true });
  
        callback?.(user);
      } else {
        callback?.(null);
      }
    });
  };

export const loginWithGoogle = async () => {
 try {
   const result = await signInWithPopup(auth, provider);
   return result.user;
 } catch (error) {
   console.error("Login failed:", error);
   throw error;
 }
};