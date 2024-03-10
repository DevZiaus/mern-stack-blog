import { Alert, Button, TextInput } from 'flowbite-react';
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function DashboardProfile() {
  const { currentUser } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImagefileUrl] =useState(null);
  const [imagefileUploadProgress, setImageFileUploadProgress] =useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const filePickerRef = useRef();

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
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImagefileUrl(downloadURL);
        });
      }
    );
  };

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className=' my-7 text-center font-semibold text-3xl'>Profile</h1>
      <form className='flex flex-col gap-4'>
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
        
        <TextInput type='text' id='username' placeholder='@devziaus' defaultValue={currentUser.username}/>
        <TextInput type='email' id='email' placeholder='username@company.com' defaultValue={currentUser.email}/>
        <TextInput type='password' id='password' placeholder='********'/>
        <Button type='submit' gradientDuoTone='purpleToBlue' outline>
          Update
        </Button>
      </form>
      <div className='text-red-500 flex justify-between mt-5'>
        <span className='cursor-pointer'>Delete Account</span>
        <span className='cursor-pointer'>Sign Out</span>
      </div>
    </div>
  )
}
