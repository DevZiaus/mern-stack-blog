import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardSidebar from '../components/DashboardSidebar';
import DashboardProfile from '../components/DashboardProfile';
import UserAllPosts from '../components/UserAllPosts';
import AllUsers from '../components/AllUsers';
import DashboardComments from '../components/DashboardComments';
import DashboardOverview from '../components/DashboardOverview';

export default function Dashboard() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tabParam = queryParams.get('tab') || 'dashboard'; // Default to 'dashboard'
  const [tab, setTab] = useState('tabParam');
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    // setTab(urlParams.get('tab'))
    if (tabFromUrl) {
      setTab(tabFromUrl);
    } else {
      setTab('dashboard');
    }
  }, [location.search]);
  return (
    <div className='min-h-screen w-full flex flex-col md:flex-row'>
      <div className='md:w-56'>
        {/* {Sidebar} */}
        <DashboardSidebar currentTab={tab} />
      </div>
      {/* {Content Area} */}
      {tab === 'profile' && <DashboardProfile /> }
      {/* {Posts...} */}
      {tab === 'posts' && <UserAllPosts /> }
      {/* {Users...} */}
      {tab === 'users' && <AllUsers /> }
      {/* Comments */}
      {tab === 'comments' && <DashboardComments />}
      {/* Dashboard Overview */}
      {tab === ('dashboard' || !tab) && <DashboardOverview />}
    </div>
  )
}
