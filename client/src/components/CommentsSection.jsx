import { Alert, Button, Textarea } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Comment from './Comment';

export default function CommentsSection({postId}) {
    const { currentUser } = useSelector( state => state.user );
    const [comment, setComment] = useState('');
    const [commentError, setCommentError] = useState(null);
    const [comments, setComments] = useState([]);
    const navigate = useNavigate()
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (comment.length > 200) {
            setCommentError('Comment is too long. Maximum length is 200 characters.');
            return;
        }
        try {
            const res = await fetch('/api/comment/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: comment, postId, userId: currentUser._id }),
            });
            const data = await res.json();
            if (res.ok) {
                setComment('');
                setCommentError(null);
                setComments([data, ...comments]);
            } else {
                setCommentError(data.message || 'An error occurred while submitting the comment.');
            }
        } catch (error) {
            setCommentError(error.message);
        }
    };

    useEffect(() => {
        const getComments = async () => {
            try {
                const res = await fetch(`/api/comment/getPostComments/${postId}`);
                if(res.ok){
                    const data = await res.json();
                    setComments(data);
                } else {
                    console.error(`Failed to fetch comments: ${res.statusText}`);
                }
            } catch (error) {
                console.error(`Error fetching comments: ${error.message}`);
            }
        }
        getComments();
    }, [postId]);

    const handleLike = async (commentId) => {
        try {
            if (!currentUser) {
                navigate('/sign-in');
                return;
            }
            const res = await fetch(`/api/comment/likeComment/${commentId}`,
                {
                    method: 'PUT',
                }
            );
            const data = await res.json();
            setComments(comments.map((comment) => 
                comment._id === commentId ? {
                    ...comment,
                    likes: data.likes,
                    numberOfLikes: data.numberOfLikes
                } : comment
                )
            )
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleEdit = (commentId, editedContent) => {
        setComments(comments.map(c =>
            c._id === commentId ? { ...c, content: editedContent } : c
        ));
    };

  return (
    <div className='max-w-2xl mx-auto p-3 w-full'>
        { 
            currentUser ?
            (
                <div className='flex items-center gap-1 text-gray-500 text-sm py-3'>
                    <p>Signed in as: </p>
                    <img className='h-5 w-5 object-cover rounded-full' src={currentUser.profilePicture} alt={currentUser.username} />
                    <Link to={'/dashboard?tab=profile'} className='text-sm transition-all text-cyan-600 hover:underline'>
                        @{currentUser.username}
                    </Link>
                </div>
            ):
            (
                <div className='text-sm my-5'>
                    You must be <Link className='text-sm transition-all text-cyan-600 hover:underline' to={'/sign-in'}> Logged In</Link> in to comment.
                </div>
            ) 
        
        }
        {
            currentUser && (
                <form onSubmit={handleSubmit} className='border border-teal-500 rounded-md p-3'>
                    <Textarea
                        placeholder = 'Write your comment'
                        rows = '3'
                        maxLength = '200'
                        onChange ={(e)=> 
                            setComment(e.target.value)
                        }
                        value = {comment}
                    />
                    <div className='flex justify-between items-center mt-5'>
                        <p className='text-gray-500 text-xs'>{ 200 - comment.length } Characters remaining</p>
                        <Button outline gradientDuoTone='purpleToBlue' type='sybmit'>
                            Submit
                        </Button>
                    </div>
                    {commentError &&
                        <Alert color= 'failure' className='mt-5'>
                            {commentError}
                        </Alert>
                    }
                </form>
            )
        }
        {
            comments.length === 0 ? 
            ( <p className='text-sm py-3'>No Comments yet!</p> ) :
            (
                <>
                    <div className='flex my-3 gap-1 text-sm items-center'>
                        <p>Comments</p>
                        <div className='border border-gray-400 py-1 px-2 rounded-sm'>
                            <p>{comments.length}</p>

                        </div>
                    </div>
                    {
                        comments.map((comment) => (
                            <Comment
                                key={comment._id}
                                comment={comment}
                                onLike={handleLike}
                                onEdit={handleEdit}
                            />
                        ))
                    }
                </>
            )
        }
    </div>
  );
}
