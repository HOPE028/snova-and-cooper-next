'use client'

import React, { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { poemsData } from '@/app/data/poemsData'
import PoemView from '@/components/PoemView'
import Navbar from '@/components/Navbar'
import { useAuth } from '@/contexts/AuthContext'
import { BackButton } from '@/components/BackButton'

export default function SinglePoemPage() {
  const { id } = useParams()

  const { currentUser } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!currentUser) {
      router.push('/login')
    }
  }, [])

  // Find the poem by matching 'id'
  const poem = poemsData.find((p) => p.id === id)

  if (!poem) {
    return (
      <div>
        <Navbar />
        <BackButton />
        <div className='min-h-screen bg-rose-950 text-white flex items-center justify-center'>
          <h2 className='text-xl'>Poem not found</h2>
          <button onClick={() => console.log(poemsData)}></button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Navbar />
      <BackButton />
      <div className='min-h-screen bg-rose-950 text-white p-4'>
        <h1 className='text-3xl font-bold text-center my-6'>{poem.title}</h1>
        {/* Pass the poem data to PoemView */}
        <PoemView img={poem.img} text={poem.text} />
      </div>
    </div>
  )
}
