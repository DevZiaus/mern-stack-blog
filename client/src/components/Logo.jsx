import React from 'react'
import { Link } from 'react-router-dom'

export default function Logo() {
  return (
    <Link className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white' to="/">
            <span className='px-2 py-1 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>MERN</span>
            Blog
        </Link>
  )
}
