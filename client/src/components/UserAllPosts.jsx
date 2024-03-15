import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button } from 'flowbite-react'

export default function UserAllPosts() {
    const { currentUser } = useSelector(state => state.user)

  return (
    <div>
        {
          currentUser.isAdmin && (
            <Link to={'/create-post'}>
              <Button type='button' gradientDuoTone='purpleToPink' className='w-full'>
                Create a post
              </Button>
            </Link>
          )
        }
    </div>
  )
}
