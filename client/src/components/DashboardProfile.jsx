import { Alert, Button, Modal, TextInput,Textarea } from 'flowbite-react'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase'
import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { updateStart, updateSuccess, updateFailure, deleteStart, deleteSuccess, deleteFailure, signOutSuccess, } from '../redux/user/userSlice'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { Link } from 'react-router-dom'

export default function DashboardProfile() {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImagefileUrl] =useState(null);
  const [imagefileUploadProgress, setImageFileUploadProgress] =useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imagefileUploading, setImageFileUploading] =useState(false);
  const [formData, setFormData] = useState({});
  
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const filePickerRef = useRef();
  const dispatch = useDispatch();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagefileUrl(URL.createObjectURL(file));  
    }
  };

  useEffect( ()=> {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile] );

  const uploadImage = async () => {
    setImageFileUploading(true);
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const filename = new Date().getTime() + imageFile.name;
    const storageRef = ref( storage, filename );
    const uploadTask = uploadBytesResumable( storageRef, imageFile );
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError('Could not upload Image (File Must be Under 2 MB)');
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImagefileUrl(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImagefileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUploading(false);
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  // const handleChange = (e) => {
  //   const { id, value } = e.target;
  //   // Checking if the field belongs to the 'links' object
  //   if (Object.keys(currentUser.links).includes(id)) {
  //       setFormData({
  //           ...formData,
  //           links: {
  //               ...formData.links,
  //               [id]: value, // Update the specific link
  //           },
  //       });
  //   } else {
  //       // For non-link fields, update the form data as before
  //       setFormData({ ...formData, [id]: value });
  //   }
  //   console.log(formData.links);
  // };


  const handleSubmit = async(e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    if (Object.keys(formData).length === 0) {
      setUpdateUserError('No changes made!');
      return;
    }
    if (imagefileUploading) {
      setUpdateUserError('Please wait for image to upload!');
      return;
    }
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess('Profile updated successfully!');
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };

  const handleDeleteUser = async() => {
    setShowModal(false);
    try {
      dispatch(deleteStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteFailure(error.message));
      } else {
        dispatch(deleteSuccess(data));
      }
    } catch (error) {
      dispatch(deleteFailure(error.message));
    }
  };

  const handleSignOut = async() => {
    try {
      const res = await fetch('/api/user/signout', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signOutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className=' my-7 text-center font-semibold text-3xl'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input 
          type='file' 
          accept='image/*' 
          onChange={handleImageChange} 
          ref={filePickerRef} hidden 
        />
        <div className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full' onClick={ () => filePickerRef.current.click() }>
          { imagefileUploadProgress && (
            <CircularProgressbar value={imagefileUploadProgress || 0} 
            text={`${imagefileUploadProgress}%`} 
            strokeWidth={5}
            styles={{
              root: {
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0
              },
              path: {
                stroke: `rgba(62, 152, 199, ${imagefileUploadProgress / 100})`,
              },
            }}
            />
          )}
          <img src={ imageFileUrl || currentUser.profilePicture } alt="User" className= {`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${imagefileUploadProgress && imagefileUploadProgress < 100 && 'opacity-60'}`}  />
        </div>
        { imageFileUploadError && <Alert color='failure'>
          { imageFileUploadError }
        </Alert> }
        
        <TextInput type='text' id='username' placeholder='@devziaus' defaultValue={currentUser.username} onChange={handleChange}
        />
        <TextInput type='text' id='name' placeholder='John Doe' defaultValue={currentUser.name} onChange={handleChange} />
        <TextInput type='email' id='email' placeholder='username@company.com' defaultValue={currentUser.email} onChange={handleChange}
        />
        <TextInput type='password' id='password' placeholder='********' onChange={handleChange}
        />
        <Textarea
          id='bio'
          placeholder='About you'
          rows='5'
          onChange={handleChange}
          defaultValue={currentUser.bio} // Use defaultValue to set initial value
        />
        {/* <TextInput type="text" id="github" placeholder="https://github.com/username" defaultValue={currentUser.links.github || ''} onChange={handleChange} />
        <TextInput type="text" id="website" placeholder="https://www.example.com" defaultValue={currentUser.links.website || ''} onChange={handleChange} />
        <TextInput type="text" id="facebook" placeholder="https://facebook.com/username" defaultValue={currentUser.links.facebook || ''} onChange={handleChange} />
        <TextInput type="text" id="twitter" placeholder="https://twitter.com/username" defaultValue={currentUser.links.twitter || ''} onChange={handleChange} />
        <TextInput type="text" id="instagram" placeholder="https://instagram.com/username" defaultValue={currentUser.links.instagram || ''} onChange={handleChange} />
        <TextInput type="text" id="linkedin" placeholder="https://linkedin.com/in/username" defaultValue={currentUser.links.linkedin || ''} onChange={handleChange} />
        <TextInput type="text" id="youtube" placeholder="https://youtube.com/@yourhandle" defaultValue={currentUser.links.youtube || ''} onChange={handleChange} /> */}

        <Button type='submit' gradientDuoTone='purpleToBlue' outline disabled={loading || imagefileUploading }>
          { loading? 'Loading...' : 'Update'}
        </Button>
        {
          (currentUser.role === 'admin' || currentUser.role === 'author') && (
            <Link to={'/create-post'}>
              <Button type='button' gradientDuoTone='purpleToPink' className='w-full'>
                Create a post
              </Button>
            </Link>
          )
        }
      </form>
      <div className='text-red-500 flex justify-between mt-5'>
        <span onClick={() => setShowModal(true)} className='cursor-pointer'>Delete Account</span>
        <span onClick={handleSignOut} className='cursor-pointer'>Sign Out</span>
      </div>
      {updateUserSuccess && (
        <Alert color='success' className='mt-5'>
          {updateUserSuccess}
        </Alert>
      )}
      {updateUserError && (
        <Alert color='failure' className='mt-5'>
          {updateUserError}
        </Alert>
      )}
      {error && (
        <Alert color='failure' className='mt-5'>
          {error}
        </Alert>
      )}

      <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md' >
        <Modal.Header />
        <Modal.Body>
          <div className='text-cnter'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete your account?</h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteUser}>Yes, I'm sure</Button>
              <Button color='gray' onClick={() => setShowModal(false)}>No, Cancel</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}
