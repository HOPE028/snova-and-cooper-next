'use client'

import React, { useEffect, useState } from 'react'
// import { useAuth } from '../../contexts/AuthContext'
import { useAuth } from '@/contexts/AuthContext'
import Navbar from '@/components/Navbar'
import { useRouter } from 'next/navigation'
import Footer from '@/components/Footer'

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuth()
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // console.log(currentUser)

    try {
      const result = await login(email, password)
      console.log('User logged in:', result)
      router.push('/')
    } catch (error) {
      setError('Error signing in with password and email')
      console.error('Error signing in with password and email', error)
    }
  }

  // useEffect(() => {
  //   if (currentUser) {
  //     console.log('User is logged in:', currentUser.email)
  //     // Move to gallery
  //     router.push('/gallery')
  //   }
  // })

  return (
    <div className='bg-pink-950 min-h-screen'>
      <Navbar />
      <div className='flex justify-center items-center min-h-screen p-4'>
        <div className='bg-pink-900 p-8 rounded-lg shadow-lg text-white w-full max-w-md'>
          <h1 className='text-3xl font-bold text-center mb-6'>Login</h1>
          {error && <p className='text-red-400 text-center mb-4'>{error}</p>}
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='flex flex-col'>
              <label className='mb-2'>Email:</label>
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className='p-2 rounded bg-white text-black border border-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500'
              />
            </div>
            <div className='flex flex-col'>
              <label className='mb-2'>Password:</label>
              <input
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className='p-2 rounded bg-white text-black border border-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500'
              />
            </div>
            <button
              type='submit'
              className='w-full bg-white text-pink-900 font-bold py-2 rounded shadow-md hover:bg-pink-100 transition-all'
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
