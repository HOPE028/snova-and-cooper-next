import React from 'react'
import { useAuth } from '../contexts/AuthContext'

const Logout: React.FC = () => {
  const { logout } = useAuth()

  const handleLogout = async () => {
    console.log('clicked ')
    await logout()
    // reload page
    window.location.reload()
  }

  return (
    <button
      className='block border border-white px-4 py-2 rounded hover:bg-white hover:text-rose-900 transition-colors '
      onClick={handleLogout}
    >
      Logout
    </button>
  )
}

export default Logout
