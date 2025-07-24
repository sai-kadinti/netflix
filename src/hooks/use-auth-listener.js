import { useState, useEffect, useContext } from 'react';
import { FirebaseContext } from '../context/firebase';

export default function useAuthListener() {
  const { firebase } = useContext(FirebaseContext);
  const [user, setUser] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('authUser');
      return storedUser ? JSON.parse(storedUser) : null;
    }
    return null;
  });

  useEffect(() => {
    if (!firebase) return;

    const unsubscribe = firebase.auth().onAuthStateChanged((authUser) => {
      if (authUser) {
        localStorage.setItem('authUser', JSON.stringify(authUser));
        setUser(authUser);
      } else {
        localStorage.removeItem('authUser');
        setUser(null);
      }
    });

    return () => unsubscribe(); // Correct cleanup
  }, [firebase]); // ✅ FIXED: firebase is added as a dependency

  return { user };
}
