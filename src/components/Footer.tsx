import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (

    <footer className="bg-black bg-opacity-30 w-full shadow border-t-2 dark:border-transparent dark:border-t-gray-100">
      <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
        <span className="text-sm sm:text-center dark:text-gray-400">&copy; 2024 <a href="https://flowbite.com/" className="hover:underline">MemoVaults</a>&nbsp;| All Rights Reserved.
        </span>
        <ul className="flex flex-wrap items-center mt-3 text-sm font-medium dark:text-gray-400 sm:mt-0">
          <li>
            <Link href="/about" className="hover:underline me-4 md:me-6">About</Link>
          </li>
          <li>
            <Link href="/about#services" className="hover:underline me-4 md:me-6">Services</Link>
          </li>
          <li>
            <Link href="/about#contact" className="hover:underline">Contact</Link>
          </li>
        </ul>
      </div>
    </footer>
  )
}

export default Footer