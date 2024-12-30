export const BackButton = () => {
  return (
    <div className='flex justify-start mt-4 ml-4'>
      <button
        onClick={() => window.history.back()}
        className='bg-rose-900 text-white px-4 py-2 rounded hover:opacity-90'
      >
        Back
      </button>
    </div>
  )
}
