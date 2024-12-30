'use client'

import React, { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage'
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { v4 as uuidv4 } from 'uuid'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { db } from '@/firebase-config' // if you have an exported 'db' from firebase-config
import { BackButton } from '@/components/BackButton'
// Otherwise, you can create 'db' inside this file using getFirestore()

export default function UploadPage() {
  const router = useRouter()

  const [file, setFile] = useState<File | null>(null)
  const [caption, setCaption] = useState('')
  const [isPetsPlus, setIsPetsPlus] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  // Main upload function
  const handleUpload = async (event: FormEvent) => {
    event.preventDefault()
    if (!file) return

    try {
      setUploading(true)
      setError(null)

      // Step 1: Get reference to Firebase Storage
      const storage = getStorage()
      const fileId = uuidv4()

      // We can try to keep the original extension if we like:
      // e.g. "myvideo.mp4" -> the substring after the last "."
      const splitName = file.name.split('.')
      const ext = splitName.length > 1 ? splitName[splitName.length - 1] : ''
      // The final filename in Firebase Storage
      const fileName = ext ? `${fileId}.${ext}` : fileId

      // Step 2: Create a storage reference
      const fileRef = ref(storage, fileName)

      const fileType = file.type // e.g. "image/png" or "video/mp4" etc.

      // Step 3: Start the upload
      const uploadTask = uploadBytesResumable(fileRef, file)

      // Step 4: Monitor progress
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          setUploadProgress(progress)
        },
        (error) => {
          console.error('Error uploading file: ', error)
          setError(error.message)
          setUploading(false)
        },
        // Step 5: On complete, get download URL
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            // Step 6: Write doc in Firestore
            try {
              const document = await addDoc(collection(db, 'images'), {
                url: downloadURL,
                createdAt: serverTimestamp(),
                caption,
                fileType,
                petsPlus: isPetsPlus,
              })
              // if (fileType.startsWith('video')) {
              //   // Make a request to your Next.js API to generate a thumbnail
              //   await fetch(`/api/video?id=${document.id}`, { method: 'POST' })
              // }

              setFile(null)
              setCaption('')
              setUploading(false)
              setUploadProgress(0)
              setIsPetsPlus(false)

              // Optionally navigate to the gallery
              router.push('/')
            } catch (firestoreError) {
              setError(`Firestore Error: ${firestoreError}`)
              setUploading(false)
              setUploadProgress(0)
            }
          })
        }
      )
    } catch (err: any) {
      console.error('Error uploading file: ', err)
      setError(err.message)
      setUploading(false)
      setUploadProgress(0)
    }
  }

  return (
    <div className='min-h-screen bg-rose-950'>
      <Navbar />
      <BackButton />

      <div className='max-w-xl mx-auto mt-10 mb-10 p-4 bg-white/10 rounded'>
        <h1 className='text-2xl text-white mb-6'>
          Upload Your Pics Or Videos Cutie
        </h1>

        {/* Error display */}
        {error && (
          <div className='bg-red-600 text-white p-2 rounded mb-4'>{error}</div>
        )}

        <form onSubmit={handleUpload}>
          {/* File Input */}
          <label className='text-white block mb-2'>Choose a pic or video</label>
          <input
            type='file'
            accept='image/*,video/*'
            onChange={handleFileChange}
            className='block w-full text-black mb-4 bg-pink-50 border border-rose-900 rounded p-2 focus:outline-none focus:ring-2 focus:ring-rose-500'
          />

          {/* Caption Input */}
          <label className='text-white block mb-2'>Caption (optional)</label>
          <input
            type='text'
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className='block w-full rounded p-2 mb-4 text-black bg-pink-50 border border-rose-900 focus:outline-none focus:ring-2 focus:ring-rose-500'
            placeholder='Say something about this file...'
          />

          {/* Checkbox for Pets Plus */}
          <div className='flex items-center mb-4'>
            <input
              type='checkbox'
              checked={isPetsPlus}
              onChange={(e) => setIsPetsPlus(e.target.checked)}
              className='mr-2 text-rose-900 focus:ring-2 focus:ring-rose-500'
            />
            <label className='text-white'>Not Snova or Cooper?</label>
          </div>

          {/* Upload Button */}
          <button
            type='submit'
            disabled={uploading}
            className='bg-rose-900 text-white w-full py-2 rounded hover:opacity-90'
          >
            {uploading ? (
              <div className='flex justify-center'>
                <div className='animate-spin h-5 w-5 border-4 border-white border-t-transparent rounded-full'></div>
              </div>
            ) : (
              'Upload'
            )}
          </button>

          {/* Progress Bar or Percentage */}
          {uploading && (
            <div className='mt-4 text-white'>
              Uploading: {uploadProgress.toFixed(0)}%
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
