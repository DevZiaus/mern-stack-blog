import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button, Spinner } from 'flowbite-react'
import CallToAction from '../components/CallToAction';
import CommentsSection from '../components/CommentsSection';
import PostCard from '../components/PostCard';

export default function singlePost() {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState(null);
  const [error, setError] = useState(false);
  const [recentPosts, setRecentPosts] =useState(null);
    
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/get-posts?slug=${slug}`);
        const data = await res.json();
        if(!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        if(res.ok) {
          setPost(data.posts[0]);
          setLoading(false);
          setError(fasle);
        }

      } catch (error) {
        setError(true);
        setLoading(false);
      }
    }
    fetchPost();
  }, [slug]);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const res = await fetch(`/api/post/get-posts?limit=3`);
        const data = await res.json();
        if(res.ok) {
          setRecentPosts(data.posts);
        }

      } catch (error) {
        console.log(error.message);
      }
    }
    fetchRecentPosts();
  }, []);

  if(loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <Spinner size='xl' />
    </div>
  );

  return (
    <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
      <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>{post && post.title}</h1>
      <Link to={`/search?category=${post&& post.category}`} className='self-center mt-5'>
        <Button color='gray' pill size='xs'>{post&& post.category}</Button>
      </Link>
      <img src={post&& post.image} alt={post && post.title} className='mt-10 p-3 max-h-[600px] w-full object-cover'/>
      <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
        <span>{post && new Date(post.updatedAt).toLocaleDateString()}</span>
        <span className='font-bold'>
          <Link to={`/search?category=${post&& post.author}`} className='self-center mt-5'>
            By: {post&& post.author}
          </Link>
        </span>
        <span className='italic'>{post && (post.content.length/1000).toFixed()} Mins Read</span>
      </div>
      <div className='p-3 max-w-2xl mx-auto w-full post-content' dangerouslySetInnerHTML={{__html: post && post.content}}>
      </div>
      <div className='max-w-4xl mx-auto w-full'>
        <CallToAction />
      </div>
      <CommentsSection postId={post._id} />

      <div className='flex flex-col justify-center items-center mb-5'>
        <h1 className='text-xl mt-5'>Recent Articles</h1>
        <div className='flex gap-5 flex-wrap mt-5 justify-center items-center'>
          {
            recentPosts && 
            recentPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))
          }
        </div>
      </div>
    </main>
  )
}
