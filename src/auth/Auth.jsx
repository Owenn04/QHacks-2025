import { onAuthStateChanged, signInWithRedirect, GoogleAuthProvider, getRedirectResult } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, getFirestore } from 'firebase/firestore'; 
import { auth, db } from '../firebase';

const provider = new GoogleAuthProvider();

export const getCurrentUser = () => auth.currentUser;

export const initializeAuth = (callback) => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        // Only create a new document if the user doesn't already exist
        if (!userDoc.exists()) {
          await setDoc(userDocRef, {
            email: user.email,
            name: user.displayName,
            createdAt: new Date()
          });
        }

        callback?.(user);
      } else {
        callback?.(null);
      }
    });
};

export const loginWithGoogle = async () => {
  try {
    // Initiate the redirect sign-in
    await signInWithRedirect(auth, provider);
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

// Handle the redirect result after the user is redirected back to your app
export const handleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      // User is signed in, return the user object
      console.log("redirect result: ", result)
      return result.user;
    }
  } catch (error) {
    console.error("Error handling redirect result:", error);
    throw error;
  }
};