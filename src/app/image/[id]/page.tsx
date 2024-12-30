'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useGetImageByIdQuery, useAddCommentMutation } from '@/services/api'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { BackButton } from '@/components/BackButton'

export default function SingleImagePage() {
  const { id } = useParams()
  const {
    data,
    isLoading: isFetchingImage,
    isError,
  } = useGetImageByIdQuery(id as string)
  const [addComment, { isLoading: isAddingComment }] = useAddCommentMutation()

  // Local state to capture comment text
  const [commentText, setCommentText] = useState('')

  const handleAddComment = async () => {
    if (!commentText.trim()) return
    try {
      await addComment({ imageId: id as string, comment: commentText }).unwrap()
      setCommentText('')
    } catch (error) {
      console.error('Error adding comment:', error)
    }
  }

  const getRelativeTime = (date: Date): string => {
    const now = new Date()

    // Ensure both `now` and `date` are valid Date objects
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      throw new Error('Invalid Date provided')
    }

    const secondsDiff = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (secondsDiff < 60) {
      return `${secondsDiff} seconds ago`
    } else if (secondsDiff < 3600) {
      const minutes = Math.floor(secondsDiff / 60)
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`
    } else if (secondsDiff < 86400) {
      const hours = Math.floor(secondsDiff / 3600)
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`
    } else {
      const days = Math.floor(secondsDiff / 86400)
      return `${days} day${days !== 1 ? 's' : ''} ago`
    }
  }

  if (isFetchingImage) {
    return (
      <div className='min-h-screen bg-rose-950'>
        <Navbar />
        <div className='flex justify-center mt-4 mb-4'>
          <div className='animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full'></div>
        </div>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className='min-h-screen bg-rose-950'>
        <Navbar />
        <div className='text-white text-center mt-10'>
          Error fetching image or no data.
        </div>
      </div>
    )
  }

  const { image, comments } = data.data

  const isVideo = image?.fileType?.startsWith('video')

  return (
    <div className='min-h-screen bg-rose-950'>
      <Navbar />

      <BackButton />

      <div className='flex flex-col items-center mb-5 my-3 p-4'>
        {isVideo ? (
          <div>
            <video
              src={image.url}
              controls
              className='max-w-full md:max-w-lg rounded shadow'
            />
          </div>
        ) : (
          <div>
            <img
              src={image.url}
              alt={image.caption || 'Image'}
              className='max-w-full md:max-w-lg rounded shadow'
            />
          </div>
        )}
        <h2 className='text-white text-lg mt-4'>{image.caption}</h2>
      </div>
      {/* Comments Section */}

      <div className='mx-4 md:mx-10 mb-10'>
        <h3 className='text-white text-xl mb-2'>Comments</h3>
        {comments?.length > 0 ? (
          <div className='space-y-4'>
            {comments.map((comment) => {
              // Get the timestamp from Firestore
              const createdAtDate = new Date(
                comment.createdAt?.seconds * 1000 +
                  comment.createdAt?.nanoseconds / 1_000_000
              )

              const relativeTime = getRelativeTime(createdAtDate)

              return (
                <div key={comment.id} className='bg-white/10 p-3 rounded'>
                  <div className='text-rose-200 text-sm mb-1'>
                    {comment.username}{' '}
                    <span className='text-xs'>({relativeTime})</span>
                  </div>
                  <div className='text-white'>{comment.comment}</div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className='text-white'>No comments yet... Add one!</div>
        )}
      </div>
      {/* Add Comment Form */}
      <div className='mx-4 md:mx-10 mb-10'>
        <label htmlFor='commentInput' className='text-white block mb-2'>
          Add your own comment :)
        </label>
        <textarea
          id='commentInput'
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className='w-full p-2 rounded text-black bg-pink-50 border border-rose-900 focus:outline-none focus:ring-2 focus:ring-rose-500'
          rows={3}
          placeholder='Type your comment here...'
        />
        <button
          onClick={handleAddComment}
          disabled={isAddingComment}
          className='bg-rose-900 text-white mt-2 px-4 py-2 rounded hover:opacity-90'
        >
          {isAddingComment ? (
            <div className='flex justify-center'>
              <div className='animate-spin h-5 w-5 border-4 border-white border-t-transparent rounded-full'></div>
            </div>
          ) : (
            'Add Comment'
          )}
        </button>
      </div>
    </div>
  )
}
