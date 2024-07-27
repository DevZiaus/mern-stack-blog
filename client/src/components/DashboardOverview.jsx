import { useState, useEffect } from 'react';
import { HiAnnotation, HiArrowNarrowUp, HiDocumentText, HiOutlineUserGroup } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import { Button, Table } from 'flowbite-react';
import { Link } from 'react-router-dom';

export default function DashBoardOverView() {
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [lastMonthsUsers, setLastMonthsUsers] = useState(0);
  const [comments, setComments] = useState([]);
  const [totalComments, setTotalComments] = useState(0);
  const [lastMonthsComments, setLastMonthsComments] = useState(0);
  const [posts, setPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [lastMonthsPosts, setLastMonthsPosts] = useState(0);

  const { currentUser } = useSelector((state) => state.user);

  useEffect(()=>{
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/user/get-users?limit=5`);
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users)
          setTotalUsers(data.totalUsers)
          setLastMonthsUsers(data.lastMonthsUsers)
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comment/get-comments?limit=5`);
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments)
          setTotalComments(data.totalComments)
          setLastMonthsComments(data.lastMonthsComments)
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/get-posts?limit=5`);
        const data = await res.json();
        if (res.ok) {
          setPosts(data.posts)
          setTotalPosts(data.totalPosts)
          setLastMonthsPosts(data.lastMonthsPosts)
        }
      } catch (error) {
        console.log(error.message);
      }
    }

    if(currentUser.role === 'admin') {
      fetchUsers();
      fetchComments();
      fetchPosts();
    }
  },[currentUser]);

  return (
    <div className='p-3 mx-auto'>
      <div className='flex flex-wrap gap-4 justify-center'>
        <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 w-full md:w-72 rounded-md shadow-md'>
          <div className='flex justify-between'>
            <div className=''>
              <h3 className='text-gray-500 text-md uppercase'>Total Posts</h3>
              <p className='text-2xl'>{totalPosts}</p>
              
            </div>
            <HiDocumentText className='bg-lime-600 text-white rounded-full text-5xl p-3 shadow-lg'/>
          </div>
          <div className='flex gap-2 text-sm'>
              <span className='text-green-500 flex items-center'>
              <HiArrowNarrowUp />
                {lastMonthsPosts}
              </span>
              <span className='text-gray-500'>Last Month</span>
            </div>
        </div>
        <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 w-full md:w-72 rounded-md shadow-md'>
          <div className='flex justify-between'>
            <div className=''>
              <h3 className='text-gray-500 text-md uppercase'>Total Users</h3>
              <p className='text-2xl'>{totalUsers}</p>
              
            </div>
            <HiOutlineUserGroup className='bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg'/>
          </div>
          <div className='flex gap-2 text-sm'>
              <span className='text-green-500 flex items-center'>
              <HiArrowNarrowUp />
                {lastMonthsUsers}
              </span>
              <span className='text-gray-500'>Last Month</span>
            </div>
        </div>
        <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 w-full md:w-72 rounded-md shadow-md'>
          <div className='flex justify-between'>
            <div className=''>
              <h3 className='text-gray-500 text-md uppercase'>Total Comments</h3>
              <p className='text-2xl'>{totalComments}</p>
              
            </div>
            <HiAnnotation className='bg-indigo-600 text-white rounded-full text-5xl p-3 shadow-lg'/>
          </div>
          <div className='flex gap-2 text-sm'>
              <span className='text-green-500 flex items-center'>
              <HiArrowNarrowUp />
                {lastMonthsComments}
              </span>
              <span className='text-gray-500'>Last Month</span>
            </div>
        </div>
      </div>
      
      <div className='flex flex-col gap-4 py-3 mx-auto justify-center'>
        <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
          <div className='flex justify-between p-3 text-sm font-semibold'>
            <h3 className='text-center p-2'>Recent Posts</h3>
            <Button outline gradientDuoTone='purpleToPink'>
              <Link to='/dashboard?tab=posts'>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Post Image</Table.HeadCell>
              <Table.HeadCell>Title</Table.HeadCell>
              <Table.HeadCell>Author</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
            </Table.Head>
            {posts && posts.map((post) =>(
              <Table.Body key={post._id} className='divide-y'>
                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <Table.Cell>
                    <img src={post.image} alt={post.title} className='w-14 h-10 rounded-md' />
                  </Table.Cell>
                  <Table.Cell className='w-96'>
                    {post.title}
                  </Table.Cell>
                  <Table.Cell className='w-5'>
                    {post.author}
                  </Table.Cell>
                  <Table.Cell className='w-5'>
                    {post.category}
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
        </div>
        <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
          <div className='flex justify-between p-3 text-sm font-semibold'>
            <h3 className='text-center p-2'>Recent Comments</h3>
            <Button outline gradientDuoTone='purpleToPink'>
              <Link to='/dashboard?tab=comments'>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>User</Table.HeadCell>
              <Table.HeadCell>Post</Table.HeadCell>
              <Table.HeadCell>Comment</Table.HeadCell>
              <Table.HeadCell>Likes</Table.HeadCell>
            </Table.Head>
            {comments && comments.map((comment) =>(
              <Table.Body key={comment._id} className='divide-y'>
                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                <Table.Cell>
                    {/* {comment.user.username} */}
                  </Table.Cell>
                  <Table.Cell className='w-60'>
                    {/* <Link to='comment.post.slug'>{comment.post.title}</Link> */}
                  </Table.Cell>
                  <Table.Cell className='w-96'>
                    <p className='line-clamp-2'>{comment.content}</p>
                  </Table.Cell>
                  <Table.Cell>
                    {comment.numberOfLikes}
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
        </div>
        <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
          <div className='flex justify-between p-3 text-sm font-semibold'>
            <h3 className='text-center p-2'>Recent Users</h3>
            <Button outline gradientDuoTone='purpleToPink'>
              <Link to='/dashboard?tab=users'>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>User Image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Name</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Role</Table.HeadCell>
            </Table.Head>
            {users && users.map((user) =>(
              <Table.Body key={user._id} className='divide-y'>
                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <Table.Cell>
                    <img src={user.profilePicture} alt={user.username} className='w-10 h-10 rounded-full' />
                  </Table.Cell>
                  <Table.Cell>
                    {user.username}
                  </Table.Cell>
                  <Table.Cell>
                      {user.name || '--'}
                    </Table.Cell>
                    <Table.Cell>
                      {user.email || '--'}
                    </Table.Cell>
                    <Table.Cell>
                      {user.role}
                    </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
        </div>
      </div>
    </div>
  )
};