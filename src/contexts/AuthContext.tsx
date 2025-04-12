import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink
} from 'firebase/auth';
import { auth } from '../config/firebase';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  sendMagicLink: (email: string) => Promise<void>;
  signInWithMagicLink: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Action code settings for email link sign-in
const actionCodeSettings = {
  url: window.location.origin + '/signin',
  handleCodeInApp: true,
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const sendMagicLink = async (email: string) => {
    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      // Save the email for later use
      window.localStorage.setItem('emailForSignIn', email);
    } catch (error) {
      console.error('Error sending magic link:', error);
      throw error;
    }
  };

  const signInWithMagicLink = async (email: string) => {
    try {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        await signInWithEmailLink(auth, email, window.location.href);
        // Clear the saved email
        window.localStorage.removeItem('emailForSignIn');
      }
    } catch (error) {
      console.error('Error signing in with magic link:', error);
      throw error;
    }
  };

  const value = {
    currentUser,
    loading,
    sendMagicLink,
    signInWithMagicLink,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 