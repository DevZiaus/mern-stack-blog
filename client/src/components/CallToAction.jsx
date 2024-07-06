import { Button } from 'flowbite-react'
import React from 'react'

export default function CallToAction() {
  return (
    <div className='flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center'>
        <div className='flex flex-1 flex-col justify-center'>
            <h2 className='text-2xl'>Want to build your dream website?</h2>
            <p className='text-gray-500 my-3'>Contact me for all kinds of web development projects.</p>
            <Button gradientDuoTone='purpleToPink' className='rounded-tl-xl rounded-bl-none'><a href="https://devziaus.xyz" target="_blank" rel="noopener noreferrer">DevZiaus</a></Button>
        </div>
        <div className='flex flex-col p-7 flex-1 justify-center items-center'>
            <img className='max-h-[150px] w-full' src="https://devziaus.xyz/images/logo.png" alt="devziaus.xyz" />
        </div>
    </div>
  )
}
