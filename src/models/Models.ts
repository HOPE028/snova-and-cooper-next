import { Timestamp } from 'firebase/firestore'

export interface ImageDoc {
  url: string
  caption: string
  createdAt: Timestamp
  id?: string
  fileType?: string
  thumbnail?: string
  petsPlus: boolean
}

export interface ImagesResponse {
  message: string
  data: {
    newImages: ImageDoc[]
    lastDoc: string
  }
}

export interface SingleImageResponse {
  message: string
  data: {
    image: ImageDoc
    comments: CommentDoc[]
  }
}

/**
 * Representation of a comment object for each image
 */
export interface CommentDoc {
  username: string
  comment: string
  createdAt: {
    seconds: number
    nanoseconds: number
  }
  id?: string
}
