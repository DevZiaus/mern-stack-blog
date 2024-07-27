import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Alert, Button, Modal, Table } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function UserAllPosts() {
    const { currentUser, error } = useSelector(state => state.user);
    const [userPosts, setUserPosts] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [postIdToDelete, setPostIdToDelete] =useState('');
    // const [deletePostSuccess, setDeletPostSucces] = useState(null);
    // const [deletePostError, setDeletPostError] = useState(null);
    const [deletePostSuccess, setDeletePostSuccess] = useState(null);
    const [deletePostError, setDeletePostError] = useState(null);

    useEffect(() => {
      const fetchPosts = async () => {
        try {
          const res = await fetch(`/api/post/get-posts?userId=${currentUser._id}`);
          const data = await res.json();
          if (res.ok) {
            setUserPosts(data.posts);
            if(data.posts.length < 9) {
              setShowMore(false);
            }
          }
        } catch (error) {
          console.log(error.message);
        }
      };
      if (currentUser.role === 'admin' || currentUser.role === 'author') {
        fetchPosts();
      }
    }, [currentUser._id] );

    const handleShowMore = async() => {
      const startIndex = userPosts.length;
      try {
        const res = await fetch(`/api/post/get-posts?userID=${currentUser._id}&startIndex=${startIndex}`);
        const data = await res.json();
        if (res.ok) {
          setUserPosts((prev) => [...prev, ...data.posts]);
          if(data.posts.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    const handleDeletePost = async() => {
      setShowModal(false);
      try {
        const res = await fetch(`/api/post/delete-post/${postIdToDelete}/${currentUser._id}`,
          {
            method: 'DELETE',
          }
        );
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
          setDeletePostError(data.message);
        } else {
          setUserPosts((prev) => 
          prev.filter((post) => post._id !== postIdToDelete)
          );
          setDeletePostSuccess(data.message);
        }
      } catch (error) {
        console.log(error.message);
        setDeletePostError(error.message)
      }
    };

  return (
    <div className='flex flex-col md:mx-auto'>
      <div className='mt-5 mx-auto w-full md:w-96'>
          {
              (currentUser.role === 'admin' || currentUser.role === 'author') && (
                  <Link to={'/create-post'}>
                      <Button type='button' gradientDuoTone='purpleToPink' className='w-52 sm:w-64 md:w-full ml-5 md:mx-auto mr-2'>
                          Create a post
                      </Button>
                  </Link>
              )
          }
      </div>
      <div className='mt-5 table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
        {(currentUser.role === 'admin' || currentUser.role === 'author') && userPosts.length > 0 ? (
          <>
            <Table hoverable className='shadow-md'>
              <Table.Head>
                <Table.HeadCell>Date Updated</Table.HeadCell>
                <Table.HeadCell>Post Image</Table.HeadCell>
                <Table.HeadCell>Post Title</Table.HeadCell>
                <Table.HeadCell>Category</Table.HeadCell>
                <Table.HeadCell>Delete</Table.HeadCell>
                <Table.HeadCell> <span>Edit</span> </Table.HeadCell>
              </Table.Head>
              {userPosts.map((post) =>(
                <Table.Body key={post._id} className='divide-y'>
                  <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                    <Table.Cell>
                      {new Date(post.updatedAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>
                      <Link to={`/post/${post.slug}`}>
                        <img 
                          src={post.image}
                          alt={post.title}
                          className='w-20 h-10 object-cover bg-gray-500'
                        />
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      <Link className='font-medium text-gray-900 dark:text-white' to={`/post/${post.slug}`}>
                        {post.title}
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      {post.category}
                    </Table.Cell>
                    <Table.Cell>
                      <span onClick={() => {
                        setShowModal(true);
                        setPostIdToDelete(post._id);
                      }} 
                      className='font-medium text-red-500 hover:underline cursor-pointer'>Delete</span>
                    </Table.Cell>
                    <Table.Cell>
                      <Link  to={`/update-post/${post._id}`}>
                        <span className='text-teal-500 hover:underline cursor-pointer'>Edit</span>
                      </Link>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
            </Table>
            {
              showMore && (
                <button onClick={handleShowMore} className='w-full text-teal-500 self-center text-sm py-7'>Show More</button>
              )
            }
          </>
        ) : (
          <p>You have no posts yet</p>
        )}

        {deletePostSuccess && (
          <Alert color='success' className='mt-5'>
            {deletePostSuccess}
          </Alert>
        )}
        {deletePostError && (
          <Alert color='failure' className='mt-5'>
            {deletePostError}
          </Alert>
        )}
        {error && (
          <Alert color='failure' className='mt-5'>
            {error}
          </Alert>
        )}

        <Modal 
          show={showModal} 
          onClose={() => setShowModal(false)} 
          popup size='md' >
          <Modal.Header 
        />
            <Modal.Body>
                <div className='text-cnter'>
                  <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                    <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete this post?</h3>
                  <div className='flex justify-center gap-4'>
                      <Button color='failure' onClick={handleDeletePost}>Yes, I'm sure</Button>
                      <Button color='gray' onClick={() => setShowModal(false)}>No, Cancel</Button>
                  </div>
                </div>
              </Modal.Body>
        </Modal>
      </div>
    </div>
  );
}
