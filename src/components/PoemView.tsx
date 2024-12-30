// components/PoemView.tsx
import React from 'react'

interface PoemViewProps {
  img?: string
  text: string
}

const PoemView: React.FC<PoemViewProps> = ({ img, text }) => {
  return (
    <div className='max-w-2xl mx-auto'>
      {img && (
        <div className='mb-4 flex justify-center'>
          <img
            src={img}
            alt='Poem illustration'
            className='rounded shadow max-h-80 object-cover'
          />
        </div>
      )}

      {/* We use <pre> or <p> to display the poem text. 
          <pre> preserves line breaks, while <p> might require <br> for new lines. 
      */}
      <pre className='whitespace-pre-wrap leading-relaxed'>{text}</pre>
    </div>
  )
}

export default PoemView
