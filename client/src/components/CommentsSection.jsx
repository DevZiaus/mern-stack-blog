import { Alert, Button, Textarea } from 'flowbite-react';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function CommentsSection({postId}) {
    const { currentUser } = useSelector( state => state.user );
    const [comment, setComment] = useState('');
    const [commentError, setCommentError] =useState(null);

    // const handleSubmit = async(e) => {
    //     e.preventDefault();
    //     if(comment.length > 200) {
    //         return;
    //     };
    //     try {
    //         const res = await fetch('/api/comment/create', {
    //             method: 'POST',
    //             headers:{
    //                 'content-type': 'application/json',
    //             },
    //             body: JSON.stringify({ content:comment, postId, userId: currentUser._id }),
    //         });
    //         const data = await res.json();
    //         if (res.ok) {
    //             setComment('');
    //             setCommentError(null);
    //         };
    //     } catch (error) {
    //         setCommentError(error.message);
    //     }
    // }
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
            console.log('Raw response:', res);
            const data = await res.json();
            if (res.ok) {
                setComment('');
                setCommentError(null);
                console.log('Comment successfully submitted:', data);
            } else {
                setCommentError(data.message || 'An error occurred while submitting the comment.');
                console.log('Error response from server:', data);
            }
        } catch (error) {
            setCommentError(error.message);
            console.log('Fetch error:', error);
        }
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
    </div>
  )
}
