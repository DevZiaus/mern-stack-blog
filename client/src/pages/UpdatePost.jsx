import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { app } from '../firebase'
import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
// import jwt_decode from 'jwt-decode'; // Import jwt-decode library

export default function UpdatePost() {
    const [file, setFile] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [formData, setFormData] = useState({});
    // const [formData, setFormData] = useState({
    //     title: '',
    //     category: 'Uncategorized',
    //     tags: '',
    //     content: '',
    //     image: ''
    //   });
    const [updateError, setUpdateError] = useState(null);
    const { currentUser } = useSelector((state) => state.user);
    const { postId } = useParams();
    
    const navigate = useNavigate();
    

    useEffect(() => {
        try {
          const fetchPost = async () => {
            const res = await fetch(`/api/post/get-posts?postId=${postId}`);
            const data = await res.json();
            if (!res.ok) {
              console.log(data.message);
              setUpdateError(data.message);
              return;
            }
            if (res.ok) {
              setUpdateError(null);
              setFormData(data.posts[0]);
            }
          };
    
          fetchPost();
        } catch (error) {
          console.log(error.message);
          setUpdateError(error.message);
        }
      }, [postId]);

    const handleUploadImage = async() => {
        try {
            if (!file) {
                setImageUploadError('Please select an image!');
                return;
            }
            setImageUploadError(null);
            const storage = getStorage(app);
            const fileName = new Date().getTime() + '-' + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setImageUploadProgress(progress.toFixed(0));
                },
                (error) => {
                    setImageUploadError('Image upload failed!');
                    setImageUploadProgress(null);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setImageUploadProgress(null);
                        setImageUploadError(null);
                        setFormData({ ...formData, image: downloadURL });
                    });
                }
            );
        } catch (error) {
            setImageUploadError('Image upload failed!');
            setImageUploadProgress(null);
            console.log(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
         // Extract username from JWT token
         // const token = localStorage.getItem('access_token');
         // const decodedToken = jwt_decode(token);
         // const username = decodedToken.username;

         // // Add username to formData
         // const updatedFormData = { ...formData, author: username };
        try {
            // console.log("Submitting formData:", formData); // Log formData
            const res = await fetch(`/api/post/update-post/${formData._id}/${currentUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
    
            const data = await res.json();
            // console.log("Response status:", res.status); // Log response status
            // console.log("Response data:", data); // Log response data
    
            if (!res.ok) {
                setUpdateError(data.message);
                return;
            }

            setUpdateError(null);
            navigate(`/post/${data.slug}`);
        } catch (error) {
            // console.error("Error during post update:", error); // Log error
            setUpdateError('Something went wrong!');
        }
    };
    

    

  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
        <h1 className='text-center text-3xl my-7 font-semibold'>Update post</h1>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit} >
            <div className='flex flex-col gap-4 sm:flex-row sm:justify-between'>
                <TextInput type='text' placeholder='Title' required id='title' className='flex-1' onChange={(e) => setFormData({ ...formData, title: e.target.value  })} value={formData.title} />
                <Select onChange={(e) => setFormData({ ...formData, category: e.target.value })} value={formData.category} >
                    |<option value='Uncategorzed'>Select A Category</option>
                    |<option value='javascript'>JavaScript</option>
                    |<option value='reactjs'>React.js</option>
                    |<option value='nextjs'>Next.js</option>
                    |<option value='nodejs'>Node.js</option>
                    |<option value='mongodb'>MongoDB</option>
                </Select>
            </div>
            <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
                <FileInput type='file' accept='image/*' onChange={(e) => setFile(e.target.files[0])} />
                <Button type='button' gradientDuoTone='purpleToBlue' size='sm' outline onClick={handleUploadImage} disabled={ imageUploadProgress } >
                    { imageUploadProgress ? 
                    <div className='w-16 h-16'>
                        <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}%`} />
                    </div> 
                    : 'Upload Image' }
                </Button>
            </div>
            {imageUploadError && (<Alert color='failure' >{imageUploadError}</Alert>)}
            {formData.image && (
                <img
                    src={formData.image}
                    alt= 'Uploaded Image'
                    className='w-full h-72 object-cover'
                />
            )}
            <TextInput
                type='text'
                placeholder='Tags (Comma "," separated)'
                id='tags'
                className='flex-1'
                onChange={(e) => {
                    const tagsArray = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
                    setFormData({ ...formData, tags: tagsArray });
                }}
                value={formData.tags}
            />
            <ReactQuill theme='snow' placeholder='Write down your idea' className='h-72 mb-12' required onChange={
                (value) => {
                    setFormData({ ...formData, content: value })
                }
            } value={formData.content} />
            <Button type='submit' gradientDuoTone='purpleToPink' >
                Update Post
            </Button>
            {
                updateError && <Alert className='mt-5' color='failure'>
                    {updateError}
                </Alert>
            }
        </form>
    </div>
  )
}
