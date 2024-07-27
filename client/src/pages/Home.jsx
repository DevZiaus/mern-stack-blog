import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import PostCard from '../components/PostCard';


export default function Home() {
  const [posts, setPosts] =useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/get-posts`);
        const data = await res.json();
        if(res.ok) {
          setPosts(data.posts);
        }

      } catch (error) {
        console.log(error.message);
      }
    }
    fetchPosts();
  }, []);

  return (
    <div>
      <div className='flex flex-col gap-6 px-3 lg:p-28 max-w-6xl mx-auto'>
        <h1 className='text-3xl font-bold lg:text-6xl'>Welcome to my blog!</h1>
        <p className='text-gray-500 text-xs sm:text-sm'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Laborum incidunt aperiam odit corporis ad. Rerum quas nisi deserunt optio illum pariatur nemo asperiores a neque cupiditate, quis, aliquam sunt tenetur.</p>
        <Link to='/search' className='text-xs sm:text-sm text-teal-500 font-bold hover:underline'>View all posts</Link>
      </div>
      <div className='p-3 bg-amber-100 dark:bg-slate-700'>
        <CallToAction />
      </div>
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7'>
          {
            (posts && posts.length >0) &&
            <div className='flex flex-col gap-6'>
              <h2 className='text-2xl font-semibold text-center'>Recent Posts</h2>
              <div className='flex flex-wrap gap-6 mx-auto'>
                {posts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
              <Link to='/search' className='text-xl text-teal-500 font-bold hover:underline text-center'>View all posts</Link>
            </div>
          }
      </div>
    </div>

  )
}
