import { useEffect, useState } from 'react';
import moment from 'moment';
import { FaThumbsUp } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Button, Textarea } from 'flowbite-react';

export default function Comment({ comment, onLike, onEdit, onDelete }) {
    const [user, setUser] = useState({});
    // const [isEditing, setIsEditing] = useState(false);
    // const [editedContent, setEditedContent] = useState(comment.content);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);
    const { currentUser } = useSelector((state)=> state.user);
    
    useEffect(() => {
        const getUser = async() => {
            try {
                const res = await fetch(`/api/user/${comment.userId}`);
                const data = await res.json();
                if(res.ok){
                    setUser(data);
                }
            } catch (error) {
                console.log(error.message);
            }
        }
        getUser();
    },[comment]);

    const handleEdit = () => {
        setIsEditing(true);
        setEditedContent(comment.content);
    };

    const handleSave = async () => {
        try {
            const res = await fetch(`/api/comment/editComment/${comment._id}`, 
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type' : 'application/json'
                    },
                    body: JSON.stringify({
                            content: editedContent
                        })
                });
            if (res.ok) {
                setIsEditing(false);
                onEdit(comment._id, editedContent);
            };
        } catch (error) {
            console.log(error);
        }
    };

  return (
    <div className='flex items-center p-4 border-b dark:border-gray-600 text-sm'>
        <div className='flex shrink-0 mr-3'>
            <img className='w-10 h-10 rounded-full bg-gray-200' src={user.profilePicture} alt={user.username}/>
        </div>
        <div className='flex-1'>
            <div className='flex items-center mb-1'>
                <span className='font-bold mr-1 text-xs truncate'>{user ? `@${user.username}` : 'Anonymous User'}</span>
                <span className='text-gray-500 text-xs'>
                    {moment(comment.updatedAt).fromNow()}
                </span>
            </div>
            {
                isEditing ?
                (
                    <>
                        <Textarea
                            className='mb-2'
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                        />
                        <div className='flex items-center justify-end gap-2 text-xs'>
                            <Button
                                type='button'
                                size='sm'
                                gradientDuoTone='purpleToBlue'
                                onClick={handleSave}
                            >
                                Save
                            </Button>
                            <Button
                                type='button'
                                size='sm'
                                gradientDuoTone='purpleToBlue'
                                outline
                                onClick={() => setIsEditing(false)}
                            >
                                Cancel
                            </Button>
                        </div>
                    </>
                    
                ): 
                (
                    <>
                        <p className='text-gray-500 mb-3'>{comment.content}</p>
                        <div className='flex items-center gap-2 pt-2 text-sm border-t dark:border-gray-700 max-w-fit'>
                        <button type='button' 
                            onClick={() => onLike(comment._id)} 
                            className={`text-gray-400 hover:text-blue-500 
                            ${currentUser && comment.likes.includes(currentUser._id) && '!text-blue-500'}`
                            }>
                            <FaThumbsUp className='text-sm'/>
                        </button>
                        <p className='text-gray-400'>
                            {
                            comment.numberOfLikes > 0 &&
                            comment.numberOfLikes + ' ' + 
                            (comment.numberOfLikes === 1 ? 'Like' : 'Likes' )
                            }
                        </p>
                            {
                            currentUser && (currentUser._id === comment.userId || (currentUser.role === 'admin' || currentUser.role === 'author')) &&
                            <>
                                <button
                                    type='button'
                                    onClick={handleEdit}
                                    className='text-gray-400 hover:text-blue-500'
                                >
                                    Edit
                                </button>
                                <button
                                    type='button'
                                    onClick={ () => onDelete(comment._id) }
                                    className='text-gray-400 hover:text-red-500'
                                >
                                    Delete
                                </button>
                            </>
                            
                            
                            }
                        </div>
                    </>
                )
            }   
        </div>

    </div>
  );
}
