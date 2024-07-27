import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Alert, Button, Modal, Table } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function DashboardComments() {
    const { currentUser, error} = useSelector(state => state.user);
    const [comments, setComments] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [commentIdToDelete, setCommentIdToDelete] =useState('');
    const [deleteCommentSuccess, setDeleteCommentSuccess] = useState(null);
    const [deleteCommentError, setDeleteCommentError] = useState(null);

    useEffect(() => {
      const fetchComments = async () => {
        try {
          const res = await fetch(`/api/comment/get-comments`);
          const data = await res.json();
          if (res.ok) {
            setComments(data.comments);
            if(data.comments.length < 9) {
              setShowMore(false);
            }
          }
        } catch (error) {
          console.log(error.message);
        }
      };
      if (currentUser.role === 'admin' || currentUser.role === 'author') {
        fetchComments();
      }
    }, [currentUser._id] );

    const handleShowMore = async() => {
      const startIndex = comments.length;
      try {
        const res = await fetch(`/api/comment/get-comments?startIndex=${startIndex}`);
        const data = await res.json();
        if (res.ok) {
          setComments((prev) => [...prev, ...data.comments]);
          if(data.comments.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    const handleDeleteComment = async() => {
      setShowModal(false);
      try {
        const res = await fetch(`/api/comment/deleteComment/${commentIdToDelete}`,
          {
            method: 'DELETE',
          }
        );
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
          setDeleteCommentError(data.message);
        } else {
          setComments((prev) => 
          prev.filter((comment) => comment._id !== commentIdToDelete)
          );
          setDeleteCommentSuccess(data.message);
        }
      } catch (error) {
        console.log(error.message);
        setDeleteCommentError(error.message)
      }
    };

  return (
    <div className='flex flex-col md:mx-auto'>
      <div className='mt-5 table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
        {(currentUser.role === 'admin' || currentUser.role === 'author') && comments.length > 0 ? (
          <>
            <Table hoverable className='shadow-md text-center'>
              <Table.Head>
                <Table.HeadCell>Date Updated</Table.HeadCell>
                {/* <Table.HeadCell>User Picture</Table.HeadCell>
                <Table.HeadCell>User Name</Table.HeadCell> */}
                <Table.HeadCell>Comment Content</Table.HeadCell>
                <Table.HeadCell>No. of Likes</Table.HeadCell>
                <Table.HeadCell>Post ID</Table.HeadCell>
                <Table.HeadCell>User ID</Table.HeadCell>
                <Table.HeadCell>Delete</Table.HeadCell>
              </Table.Head>
              {comments.map((comment) =>(
                <Table.Body key={comment._id} className='divide-y'>
                  <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                    <Table.Cell>
                      {new Date(comment.updatedAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>
                      {comment.content}
                    </Table.Cell>
                    <Table.Cell>
                      {comment.numberOfLikes}
                    </Table.Cell>
                    <Table.Cell>
                      {comment.postId}
                    </Table.Cell>
                    <Table.Cell>
                      {comment.userId}
                    </Table.Cell>
                    {/* <Table.Cell>
                      {user.role}
                    </Table.Cell> */}
                    {(currentUser.role === 'admin' || currentUser.role === 'author') && (
                        <Table.Cell>
                          <span onClick={() => {
                            setShowModal(true);
                            setCommentIdToDelete(comment._id);
                          }} 
                          className='font-medium text-red-500 hover:underline cursor-pointer'>Delete</span>
                        </Table.Cell>
                    )}
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
          <p>No Comments yet</p>
        )}

        {deleteCommentSuccess && (
          <Alert color='success' className='mt-5'>
            {deleteCommentSuccess}
          </Alert>
        )}
        {deleteCommentError && (
          <Alert color='failure' className='mt-5'>
            {deleteCommentError}
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
                    <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete this Comment?</h3>
                  <div className='flex justify-center gap-4'>
                      <Button color='failure' onClick={handleDeleteComment}>Yes, I'm sure</Button>
                      <Button color='gray' onClick={() => setShowModal(false)}>No, Cancel</Button>
                  </div>
                </div>
              </Modal.Body>
        </Modal>
      </div>
    </div>
  );
}
