import { ImagesResponse, SingleImageResponse } from '@/models/Models'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Timestamp } from 'firebase/firestore'

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Images', 'SingleImage'],
  endpoints: (builder) => ({
    // Existing endpoint: multiple images for the gallery
    getImages: builder.query<ImagesResponse, string | undefined>({
      query: (param) => {
        if (!param) {
          return 'gallery' // no query params
        }
        // param might be something like "lastDoc=abcd&petsPlus=true"
        return `gallery?${param}`
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.newImages.map((img) => ({
                type: 'Images' as const,
                id: img.id,
              })),
              { type: 'Images', id: 'LIST' },
            ]
          : [{ type: 'Images', id: 'LIST' }],
    }),

    // New endpoint: single image + comments
    getImageById: builder.query<SingleImageResponse, string>({
      query: (imageId) => `image?image=${imageId}`,
      providesTags: (result, error, arg) => [{ type: 'SingleImage', id: arg }],
    }),

    // Mutation: add comment by ID
    addComment: builder.mutation<
      { message: string; docId: string },
      { imageId: string; comment: string }
    >({
      query: ({ imageId, comment }) => ({
        url: `image?image=${imageId}&comment=${encodeURIComponent(comment)}`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'SingleImage', id: arg.imageId },
      ],
    }),
  }),
})

export const {
  useLazyGetImagesQuery,
  useGetImageByIdQuery,
  useAddCommentMutation,
} = api
