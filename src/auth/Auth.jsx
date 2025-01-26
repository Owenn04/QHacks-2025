import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export const registerUser = async (email, password) => {
  try {
    // Create auth user with email
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      email,
      displayName,
      createdAt: new Date().toISOString(),
      // Add any additional user fields you want to store
    });

    return {
      uid: user.uid,
      email,
      displayName
    };
  } catch (error) {
    console.error('Error in registration:', error);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    // Sign in with email (username@yourdomain.com) and password
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.data();

    return {
      uid: user.uid,
      username: userData.email,
      displayName: userData.displayName || '',
      // Add any other user data you want to return
    };
  } catch (error) {
    console.error('Error in login:', error);
    throw error;
  }
};

export const updateDisplayName = async (uid, displayName) => {
  try {
    await updateDoc(doc(db, 'users', uid), {
      displayName
    });
  } catch (error) {
    console.error('Error updating display name:', error);
    throw error;
  }
};

export const getCurrentUser = () => {
  return auth.currentUser;
};

export const signOutUser = async () => {
  try {
    await auth.signOut();
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};