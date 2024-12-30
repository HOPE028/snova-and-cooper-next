'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import { useAuth } from '../contexts/AuthContext'
import { useLazyGetImagesQuery } from '../services/api'
import Footer from '@/components/Footer'
import { ImageDoc } from '@/models/Models'

export default function Gallery() {
  const [images, setImages] = useState<ImageDoc[]>([])
  const [lastDoc, setLastDoc] = useState<string | undefined>(undefined)
  const [getImages, { isLoading, isError }] = useLazyGetImagesQuery()
  const [loading, setLoading] = useState(false)

  // 1) New local state for FurryFriends+
  const [furryFriendsPlus, setFurryFriendsPlus] = useState(false)

  const fetchImages = async (petsPlusJustEnabled: boolean = false) => {
    setLoading(true)

    // 2) Build a param string. If we have lastDoc, append it.
    //    If furryFriendsPlus is true, also add petsPlus=true.
    let param = ''
    if (lastDoc && !petsPlusJustEnabled) {
      param = `lastDoc=${encodeURIComponent(lastDoc)}`
    }
    if (furryFriendsPlus || petsPlusJustEnabled) {
      // If we already have lastDoc in `param`, append with '&'.
      if (param) {
        param += '&petsPlus=true'
      } else {
        param = 'petsPlus=true'
      }
    }

    // 3) Fire off the RTK Query with this param
    const result = await getImages(param)

    if (result.isSuccess && result.data) {
      const fetchedImages = result.data.data.newImages
      setImages((prevImages) => {
        // Filter out duplicates by ID
        const uniqueNew = fetchedImages.filter(
          (img) => !prevImages.some((existing) => existing.id === img.id)
        )
        return [...prevImages, ...uniqueNew]
      })
      setLastDoc(result.data.data.lastDoc)
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchImages()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 4) Whenever user toggles FurryFriends+, reset and refetch from scratch
  const handleToggleFurryFriends = (checked: boolean) => {
    setFurryFriendsPlus(checked)

    if (checked) {
      // Reset images & pagination
      setImages([])
      setLastDoc(undefined)

      fetchImages(true)
    }
  }

  return (
    <div className='min-h-screen bg-rose-950'>
      <Navbar />

      <h1 className='text-center my-4 text-white text-3xl font-bold'>
        GALLERY
      </h1>

      {/* FurryFriends+ Toggle */}
      {/* FurryFriends+ Toggle */}
      <div className='flex justify-center mb-4 px-4'>
        <div
          onClick={() => handleToggleFurryFriends(!furryFriendsPlus)}
          className={`border px-4 py-2 rounded cursor-pointer transition-colors duration-300
      ${
        furryFriendsPlus
          ? 'bg-rose-700 border-rose-300 text-white'
          : 'bg-rose-950 border-gray-700 text-gray-400'
      }
    `}
        >
          FurryFriends+
        </div>
      </div>

      {isError ? (
        <div className='text-center text-red-600'>
          Error fetching images. Please try again.
        </div>
      ) : (
        <>
          <div className='columns-1 sm:columns-2 lg:columns-3 gap-4 mb-4 px-4'>
            {images
              .filter((image) => !image.petsPlus || furryFriendsPlus)
              .map((image) => {
                const isVideo = image?.fileType?.startsWith('video')
                return (
                  <div
                    key={image.id}
                    className='break-inside-avoid p-1 box-border w-full bg-pink-400 rounded-lg overflow-hidden shadow-lg mt-4'
                  >
                    <Link href={`/image/${image.id}`}>
                      {isVideo ? (
                        <div className='relative'>
                          <video
                            src={image.url}
                            muted
                            className='w-full transition-opacity duration-200 hover:opacity-80'
                          />
                          <div className='absolute top-2 left-2 bg-black/50 text-white text-sm px-2 py-1 rounded'>
                            VIDEO
                          </div>
                        </div>
                      ) : (
                        <img
                          src={image.url}
                          alt={image.caption || 'Image'}
                          className='w-full transition-opacity duration-200 hover:opacity-80'
                        />
                      )}
                      <h2>{image.caption}</h2>
                    </Link>
                  </div>
                )
              })}
          </div>

          {loading && (
            <div className='flex justify-center mt-4 mb-4'>
              <div className='animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full'></div>
            </div>
          )}

          {!isLoading && (
            <button
              onClick={() => fetchImages()}
              className='block mx-auto mb-5 px-4 py-2 rounded bg-rose-900 text-white text-2xl hover:opacity-90'
            >
              Show More
            </button>
          )}
        </>
      )}
    </div>
  )
}
