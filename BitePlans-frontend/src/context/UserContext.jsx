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

  const fetchUserData = async () => {
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
      console.error("Error fetching user & credits:", err.response?.data || err.message);
    }
  };

  const refreshUser = async () => {
    await fetchUserData(); 
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
      console.error("Error fetching credits:", err.response?.data || err.message);
    }
  };

  const fetchUserAndCredits = async () => {
    try {
      await fetchUserData();
    } catch (err) {
      console.error("Error in fetchUserAndCredits:", err.response?.data || err.message);
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
