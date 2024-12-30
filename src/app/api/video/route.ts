import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/firebase-config'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'

// Example: using "fluent-ffmpeg"
import ffmpeg from 'fluent-ffmpeg'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'
import path from 'path'
import os from 'os'
import { promisify } from 'util'

const exec = promisify(require('child_process').exec)

// This example assumes you can run ffmpeg binary in your environment.
// You might need to set ffmpeg.setFfmpegPath('/path/to/your/ffmpeg')

export async function POST(req: NextRequest) {
  try {
    // 1. Grab ?id={docId}
    const { searchParams } = new URL(req.url)
    const docId = searchParams.get('id')
    if (!docId) {
      return NextResponse.json({ message: 'Missing doc ID' }, { status: 400 })
    }

    // 2. Fetch the doc from Firestore
    const docRef = doc(db, 'images', docId)
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) {
      return NextResponse.json({ message: 'No doc found' }, { status: 404 })
    }

    const data = docSnap.data()
    if (!data.url) {
      return NextResponse.json(
        { message: 'No video URL in doc' },
        { status: 400 }
      )
    }

    // 3. Download the video file locally so we can run ffmpeg on it
    const videoURL = data.url as string
    const tmpdir = os.tmpdir()
    const localVideoPath = path.join(tmpdir, `${uuidv4()}.mp4`)

    // Download the video from Storage or a public URL
    // If the url is publicly accessible (i.e. a normal https storage URL), we can do:
    const response = await fetch(videoURL)
    if (!response.ok) {
      return NextResponse.json(
        { message: 'Failed to download video' },
        { status: 500 }
      )
    }
    const arrayBuffer = await response.arrayBuffer()
    fs.writeFileSync(localVideoPath, Buffer.from(arrayBuffer))

    // 4. Generate a thumbnail. For example, let's do the first frame at 1 second mark
    const localThumbPath = path.join(tmpdir, `${uuidv4()}.png`)

    // We'll use fluent-ffmpeg to generate the thumbnail
    // "fluent-ffmpeg" uses ffmpeg under the hood, so you need to ensure ffmpeg is accessible

    console.log('GOT HERE', ffmpeg)
    await new Promise<void>((resolve, reject) => {
      ffmpeg(localVideoPath)
        .on('end', () => resolve())
        .on('error', (err: any) => reject(err))
        .screenshots({
          // Take 1 screenshot at 1 second in
          timestamps: ['1'],
          filename: path.basename(localThumbPath), // e.g. "some-random.png"
          folder: path.dirname(localThumbPath), // e.g. /tmp
        })
    })

    // 5. Upload that thumbnail to Firebase Storage
    const storage = getStorage()
    const thumbnailBytes = fs.readFileSync(localThumbPath)
    const thumbStorageRef = ref(storage, `thumbnails/${uuidv4()}.png`)
    await uploadBytes(thumbStorageRef, thumbnailBytes, {
      contentType: 'image/png',
    })

    const thumbnailURL = await getDownloadURL(thumbStorageRef)

    // 6. Update Firestore doc to store the thumbnail URL
    await updateDoc(docRef, {
      thumbnail: thumbnailURL,
    })

    // 7. Cleanup local files (optional, in serverless this might be ephemeral anyway)
    fs.unlinkSync(localVideoPath)
    fs.unlinkSync(localThumbPath)

    return NextResponse.json(
      { message: 'Thumbnail generated successfully', thumbnailURL },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error generating thumbnail:', error)
    return NextResponse.json({ message: 'Server Error' }, { status: 500 })
  }
}
