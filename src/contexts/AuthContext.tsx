'use client'

import React, { useContext, useState, useEffect, createContext } from 'react'
import { auth } from '../firebase-config'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  User,
  UserCredential,
} from 'firebase/auth'

interface AuthContextType {
  currentUser: User | null
  login: (email: string, password: string) => Promise<UserCredential>
  signup: (email: string, password: string) => Promise<UserCredential>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
}

export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  login: () => Promise.resolve({} as UserCredential),
  signup: () => Promise.resolve({} as UserCredential),
  logout: () => Promise.resolve(),
  resetPassword: () => Promise.resolve(),
})

export function useAuth(): AuthContextType {
  return useContext(AuthContext)
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  function signup(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password)
  }

  function login(email: string, password: string) {
    console.log('it should be workign')
    return signInWithEmailAndPassword(auth, email, password)
  }

  function logout() {
    return signOut(auth)
  }

  function resetPassword(email: string) {
    return sendPasswordResetEmail(auth, email)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    login,
    signup,
    logout,
    resetPassword,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
