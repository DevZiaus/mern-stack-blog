import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import DashboardSidebar from '../components/DashboardSidebar';
import DashboardProfile from '../components/DashboardProfile';
import UserAllPosts from '../components/UserAllPosts';

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState('');
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    // setTab(urlParams.get('tab'))
    if (tabFromUrl) {
      setTab(tabFromUrl)
    }
  },[location.search]);
  return (
    <div className='min-h-screen w-full flex flex-col md:flex-row'>
      <div className='md:w-56'>
        {/* {Sidebar} */}
        <DashboardSidebar />
      </div>
      {/* {Content Area} */}
      {tab === 'profile' && <DashboardProfile /> }
      {/* {Posts...} */}
      {tab === 'posts' && <UserAllPosts /> }
    </div>
  )
}
