import React from 'react'

const Alert = ({ success, message }: { success: boolean, message: string }) => {
  return (
    <div className="space-y-2 scale-90 md:scale-100 p-4 fixed w-max h-max z-40 top-4 -right-3 md:right-0 max-w-[300px] md:max-w-max cursor-pointer">
      {success && <div
        role="alert"
        className="bg-green-100 dark:bg-green-900 border-l-4 border-green-500 dark:border-green-700 text-green-900 dark:text-green-100 p-4 rounded-lg flex items-center transition duration-300 ease-in-out hover:bg-green-200 dark:hover:bg-green-800 transform hover:scale-105"
      >
        <svg
          stroke="currentColor"
          viewBox="0 0 24 24"
          fill="none"
          className="h-5 w-5 flex-shrink-0 mr-2 text-green-600"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          ></path>
        </svg>
        <p className="text-sm font-semibold">Success - {message}!</p>
      </div>}
      {!success && <div
        role="alert"
        className="bg-red-100 dark:bg-red-900 border-l-4 border-red-500 dark:border-red-700 text-red-900 dark:text-red-100 p-4 rounded-lg flex items-center transition duration-300 ease-in-out hover:bg-red-200 dark:hover:bg-red-800 transform hover:scale-105"
      >
        <svg
          stroke="currentColor"
          viewBox="0 0 24 24"
          fill="none"
          className="h-5 w-5 flex-shrink-0 mr-2 text-red-600"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          ></path>
        </svg>
        <p className="text-sm font-semibold">Error - {message}</p>
      </div>}
    </div>
  )
}

export default Alert