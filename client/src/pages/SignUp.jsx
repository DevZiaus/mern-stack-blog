import React from 'react'
import { Link } from 'react-router-dom'
import { Label, TextInput, Button } from 'flowbite-react'

export default function SignUp() {
  return (
    <div className='min-h-screen mt-20'>
      <div className='flex flex-col md:flex-row md:items-center p-3 max-w-3xl mx-auto gap-5'>
        <div className='flex-1'>
          <Link className='font-bold dark:text-white text-4xl' to="/">
              <span className='px-2 py-1 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>MERN</span>
              Blog
          </Link>
          <p className='text-sm mt-5'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi odio minima nemo quae ut, harum illum sunt, voluptates tenetur accusantium quos tempore quisquam magni non sed sapiente explicabo neque recusandae!
          </p>
        </div>
        <div className='flex-1'>
          <form className='flex flex-col gap-4'>
            <div className=''>
              <Label value='Your Username' />
              <TextInput 
                type='text'
                placeholder='devziaus'
                className='w-full'
                id='username' 
              />
            </div>
            <div className=''>
              <Label value='Your Email' />
              <TextInput 
                type='email'
                placeholder='name@company.com'
                className='w-full'
                id='email' 
              />
            </div>
            <div className=''>
              <Label value='Your Password' />
              <TextInput 
                type='text'
                placeholder='********'
                className='w-full'
                id='password' 
              />
            </div>
            <Button gradientDuoTone='purpleToPink' type='submit'>
              Sign Up
            </Button>
          </form>
          <div className='flex gap-2 text-sm mt-5'>
            <span>Have an account?</span>
            <Link to='/sign-in' className='text-blue-500'>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
