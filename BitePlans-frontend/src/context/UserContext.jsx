// context/UserContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';
import axios from 'axios';
import {
  browserLocalPersistence,
  setPersistence,
} from 'firebase/auth';

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [credits, setCredits] = useState(0);
  const [loadingUser, setLoadingUser] = useState(true);

  // 👇 Yahi function tumhe EditProfileModal me chahiye tha
  const refreshUser = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const token = await currentUser.getIdToken();
      const res = await axios.get('/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setUser(res.data.user);
        setCredits(res.data.user.totalCredits || 0);
      }
    } catch (err) {
      console.error("❌ Error refreshing user:", err);
    }
  };

  const fetchCredits = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const token = await currentUser.getIdToken();
      const res = await axios.get('/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setCredits(res.data.user.totalCredits || 0);
      }
    } catch (err) {
      console.error("❌ Error fetching credits:", err);
    }
  };

  const fetchUserAndCredits = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const token = await currentUser.getIdToken();
      const res = await axios.get('/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setUser(res.data.user);
        setCredits(res.data.user.totalCredits || 0);
      }
    } catch (err) {
      console.error("❌ Error fetching user & credits:", err);
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence).then(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          fetchUserAndCredits();
        } else {
          setUser(null);
          setCredits(0);
          setLoadingUser(false);
        }
      });
      return () => unsubscribe();
    });
  }, []);

  const login = async () => await fetchUserAndCredits();

  const logout = async () => {
    await auth.signOut();
    setUser(null);
    setCredits(0);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        credits,
        loadingUser,
        login,
        logout,
        fetchCredits,
        refreshUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
