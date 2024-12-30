'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { poemsData } from '../data/poemsData'
import Navbar from '@/components/Navbar'
import { useAuth } from '@/contexts/AuthContext'
import router, { useRouter } from 'next/navigation'
import { BackButton } from '@/components/BackButton'

export default function PoemsPage() {
  const { currentUser } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!currentUser) {
      router.push('/login')
    }
  }, [])

  return (
    <div className='min-h-screen bg-rose-950 text-white'>
      <Navbar />
      <BackButton />
      <h1 className='text-center text-3xl font-bold py-6'>Poems</h1>
      <div className='max-w-xl mx-auto px-4'>
        {poemsData.map((poem) => (
          <div key={poem.id} className='mb-4'>
            {/* Link to /Poem/[id] */}
            <Link href={`/poems/${poem.id}`}>
              {/* We’ll just display the poem’s title. Style as desired. */}
              <div className='cursor-pointer bg-rose-900 p-4 rounded hover:opacity-90'>
                <h2 className='text-xl font-semibold'>{poem.title}</h2>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
