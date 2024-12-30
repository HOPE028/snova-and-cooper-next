'use server'

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/firebase-config'
import {
  doc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore'
import { ImageDoc, CommentDoc } from '@/models/Models'
import { cuteUsernames } from './cuteUsernames'

export const GET = async (req: NextRequest) => {
  try {
    // Parse the ?image={id} query param
    const { searchParams } = new URL(req.url)
    const imageId = searchParams.get('image')

    if (!imageId) {
      return NextResponse.json({ message: 'Missing image ID' }, { status: 400 })
    }

    // 1) Fetch the main image doc
    const docRef = doc(db, 'images', imageId)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      return NextResponse.json({ message: 'Image not found' }, { status: 404 })
    }

    const imageData = docSnap.data() as ImageDoc

    // 2) Fetch the comments subcollection
    const commentsRef = collection(db, 'images', imageId, 'comments')
    const commentsQuery = query(commentsRef, orderBy('createdAt', 'asc'))
    const commentsSnap = await getDocs(commentsQuery)

    const commentsData: CommentDoc[] = commentsSnap.docs.map((doc) => {
      return {
        ...(doc.data() as CommentDoc),
        id: doc.id,
      }
    })

    // Return the combined result
    return NextResponse.json(
      {
        message: 'Success',
        data: {
          image: {
            ...imageData,
            id: docSnap.id,
          },
          comments: commentsData,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching image by ID:', error)
    return NextResponse.json(
      { message: 'Error fetching image by ID' },
      { status: 500 }
    )
  }
}

export const PUT = async (req: NextRequest) => {
  try {
    // Parse the ?image={id}&comment={comment} query params
    const { searchParams } = new URL(req.url)
    const imageId = searchParams.get('image')
    const comment = searchParams.get('comment')

    if (!imageId || !comment) {
      return NextResponse.json(
        { message: 'Missing image ID or comment' },
        { status: 400 }
      )
    }

    // Create a random username from cuteUsernames
    const randomUsername =
      cuteUsernames[Math.floor(Math.random() * cuteUsernames.length)]

    // Insert into subcollection 'comments'
    const commentsRef = collection(db, 'images', imageId, 'comments')
    const newCommentRef = await addDoc(commentsRef, {
      username: randomUsername,
      comment: comment,
      createdAt: serverTimestamp(),
    })

    // Return success
    return NextResponse.json(
      { message: 'Comment added successfully', docId: newCommentRef.id },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error adding comment:', error)
    return NextResponse.json(
      { message: 'Error adding comment' },
      { status: 500 }
    )
  }
}
