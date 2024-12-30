'use server'

import { NextRequest, NextResponse } from 'next/server'

import {
  collection,
  query,
  getDocs,
  orderBy,
  limit,
  DocumentData,
  startAfter,
  doc,
  getDoc,
  where,
} from 'firebase/firestore'

import { db } from '../../../firebase-config'
import { ImageDoc } from '@/models/Models'
import { updateDoc } from 'firebase/firestore'

// Get all objections
export const GET = async (req: NextRequest) => {
  // get param lastDoc
  const { searchParams } = new URL(req.url)
  const lastDocId = searchParams.get('lastDoc')
  const lastDoc = lastDocId

  // PETS+
  const petsPlus = searchParams.get('petsPlus') || ''
  let fetchAllPets = false
  if (petsPlus === 'true') {
    fetchAllPets = true
  }

  // get param category

  try {
    const imagesCollection = collection(db, 'images')

    let imagesQuery

    if (lastDoc) {
      const lastImageDocRef = doc(db, 'images', lastDoc)
      const lastImageDoc = await getDoc(lastImageDocRef)

      imagesQuery = query(
        imagesCollection,
        orderBy('createdAt', 'desc'),
        startAfter(lastImageDoc),
        limit(10)
      )
    } else {
      imagesQuery = query(
        imagesCollection,
        orderBy('createdAt', 'desc'),
        limit(10)
      )
    }

    if (!fetchAllPets) {
      // add condition to imagesQuery that petsPlus must be false
      imagesQuery = query(imagesQuery, where('petsPlus', '==', false))
    }

    const imageDocs = await getDocs(imagesQuery)
    const newImages = imageDocs.docs.map((doc) => {
      const data = doc.data() as ImageDoc
      return {
        ...data,
        id: doc.id,
      }
    }) as ImageDoc[]

    return NextResponse.json(
      {
        message: 'Success',
        data: {
          newImages,
          lastDoc: imageDocs.docs[imageDocs.docs.length - 1].id,
        },
      },
      { status: 200 }
    )
  } catch (e) {
    console.error('Error getting further images: ', e)
    return NextResponse.json(
      { message: 'Error getting further images' },
      { status: 500 }
    )
  }
}

// Make a PUT request that takes every image document and adds a field called petsPlus and sets it to false

export const PUT = async (req: NextRequest) => {
  try {
    const imagesCollection = collection(db, 'images')
    const imageDocs = await getDocs(imagesCollection)

    imageDocs.docs.forEach(async (doc) => {
      await updateDoc(doc.ref, { petsPlus: false })
    })

    return NextResponse.json({ message: 'Success' }, { status: 200 })
  } catch (e) {
    console.error('Error updating images: ', e)
    return NextResponse.json(
      { message: 'Error updating images' },
      { status: 500 }
    )
  }
}

// Make a new transcript
// export const POST = async (req: NextRequest) => {
//   try {
//     const { name } = await req.json()

//     if (!name) {
//       return NextResponse.json(
//         { message: 'Missing required parameter: name' },
//         { status: 400 }
//       )
//     }

//     await db.collection('Category-Of-Sale').add({
//       Name: name,
//       Count: 0,
//     })

//     return NextResponse.json({ message: 'Success' }, { status: 200 })
//   } catch (e) {
//     console.error('Error adding ideal objection: ', e)
//     return NextResponse.json(
//       { message: 'Error adding ideal objection' },
//       { status: 500 }
//     )
//   }
// }
