'use client'

import React from 'react'
import Link from 'next/link'
import { useAuth } from '../contexts/AuthContext'
import { FiMenu } from 'react-icons/fi'
import Logout from '../components/Logout' // Adjust path if needed

export default function Navbar() {
  const { currentUser } = useAuth()
  const [menuOpen, setMenuOpen] = React.useState(false)

  const toggleMenu = () => setMenuOpen(!menuOpen)

  return (
    <nav className='bg-rose-900 text-white px-4 py-3'>
      {/* DESKTOP NAV (hidden on mobile) */}
      <div className='hidden md:grid grid-cols-3 items-center max-w-5xl mx-auto'>
        {/* Left column */}
        <div className='flex justify-start'>
          {currentUser && (
            <Link
              href='/upload'
              className='border border-white px-4 py-2 rounded hover:bg-white hover:text-rose-900 transition-colors'
            >
              Upload
            </Link>
          )}
        </div>

        {/* Center column (title always centered) */}
        <div className='flex justify-center'>
          <Link href='/'>
            <h1 className='text-3xl font-bold'>Snova &amp; Cooper</h1>
          </Link>
        </div>

        {/* Right column: Poems + Login/Logout */}
        <div className='flex justify-end items-center space-x-4'>
          {currentUser && (
            <Link
              href='/poems'
              className='border border-white px-4 py-2 rounded hover:bg-white hover:text-rose-900 transition-colors'
            >
              Poems
            </Link>
          )}

          {/* Condition for Login/Logout on the far right */}
          {!currentUser ? (
            <Link
              href='/login'
              className='border border-white px-4 py-2 rounded hover:bg-white hover:text-rose-900 transition-colors'
            >
              Login
            </Link>
          ) : (
            <Logout />
          )}
        </div>
      </div>

      {/* MOBILE NAV (md:hidden) */}
      <div className='flex items-center justify-between md:hidden'>
        <button onClick={toggleMenu} aria-label='Menu'>
          <FiMenu className='w-7 h-7' />
        </button>
        <Link href='/'>
          <h1 className='text-2xl font-bold'>Snova &amp; Cooper</h1>
        </Link>
      </div>

      {/* SIDE NAV OVERLAY (for mobile) */}
      {menuOpen && (
        <div
          className='fixed inset-0 bg-black/50 z-40'
          onClick={toggleMenu}
          aria-hidden='true'
        />
      )}

      {/* MOBILE SIDE MENU */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-rose-900 z-50 transform 
        ${menuOpen ? 'translate-x-0' : '-translate-x-full'} 
        transition-transform duration-300 md:hidden`}
      >
        <div className='p-4 mt-10 space-y-4'>
          {currentUser && (
            <Link
              href='/upload'
              className='block border border-white px-4 py-2 rounded hover:bg-white hover:text-rose-900 transition-colors'
              onClick={() => setMenuOpen(false)}
            >
              Upload
            </Link>
          )}
          {currentUser && (
            <Link
              href='/poems'
              className='block border border-white px-4 py-2 rounded hover:bg-white hover:text-rose-900 transition-colors'
              onClick={() => setMenuOpen(false)}
            >
              Poems
            </Link>
          )}

          {/* Mobile: Login or Logout */}
          {!currentUser ? (
            <Link
              href='/login'
              className='block border border-white px-4 py-2 rounded hover:bg-white hover:text-rose-900 transition-colors'
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
          ) : (
            <Logout />
          )}
        </div>
      </div>
    </nav>
  )
}
