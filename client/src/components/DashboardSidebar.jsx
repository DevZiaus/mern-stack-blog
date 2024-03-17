import React, { useEffect, useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { Sidebar } from 'flowbite-react'
import { HiArrowSmRight, HiDocumentText, HiUser } from 'react-icons/hi'
import { signOutSuccess } from '../redux/user/userSlice'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'

export default function DashboardSidebar() {
    const location = useLocation();
    const [tab, setTab] = useState('');
    const dispatch = useDispatch();
    const { currentUser } = useSelector(state => state.user);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get('tab');
        
    if (tabFromUrl) {
      setTab(tabFromUrl)
    }
  },[location.search]);

  const handleSignOut = async() => {
    try {
      const res = await fetch('/api/user/signout', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signOutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const findUserType = () => {
    if (currentUser.role === 'admin') {
      return 'Admin';
    } else if (currentUser.role === 'author') {
      return 'Author';
    } else {
      return 'User';
    }
  }

  return (
    <Sidebar className='w-full md:w-56'>
        <Sidebar.Items>
            <Sidebar.ItemGroup className='flex flex-col gap-1'>
                <Link to='/dashboard?tab=profile'>
                    <Sidebar.Item 
                      active={tab === 'profile'} 
                      icon={HiUser} 
                      label={findUserType()} 
                      labelColor='dark' 
                      as='div'
                    >
                        Profile
                    </Sidebar.Item>
                </Link>
                {(currentUser.role === 'admin' || currentUser.role === 'author') && (
                  <Link to='/dashboard?tab=posts'>
                    <Sidebar.Item 
                      active={ tab === 'posts' }
                      icon={HiDocumentText}
                      as='div'
                    >
                      Posts
                    </Sidebar.Item>
                </Link>
                )}
                <Sidebar.Item onClick={handleSignOut} icon={HiArrowSmRight} className='cursor-pointer'>
                    Sign Out
                </Sidebar.Item>
            </Sidebar.ItemGroup>
        </Sidebar.Items>
    </Sidebar>
  )
}
