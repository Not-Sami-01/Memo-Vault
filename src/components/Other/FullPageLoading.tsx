import React from 'react'

const FullPageLoading = () => {
  React.useEffect(()=> {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'auto'
    }
  },[])
  return (
    <div className='fixed overflow-hidden h-full w-full z-20 bg-black dark:bg-white top-0 left-0 !bg-opacity-30 flex items-center'>
      <div className='w-max h-max p-10 bg-white dark:bg-slate-900 flex items-center justify-center rounded shadow-lg mx-auto'>
        <div className="text-center mx-auto">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-yellow-500 mx-auto" />
          <h2 className="text-zinc-900 dark:text-white mt-4">Loading...</h2>  
          <p className="text-zinc-600 dark:text-zinc-400">
          The operation is still in progress. Please hold on...
          </p>
        </div>

      </div>
    </div>
  )
}

export default FullPageLoading
