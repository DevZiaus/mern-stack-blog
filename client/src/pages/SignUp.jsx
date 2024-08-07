import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Label, TextInput, Button, Alert, Spinner } from 'flowbite-react';
import OAuth from '../components/OAuth';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value.trim()});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.username || !formData.email || !formData.password) {
      return setErrorMessage('Please fill out all fields');
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch('/api/auth/signup', {
        method:'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'An error occurred'); // Throw an error if response not ok
      }
  
      // If no error and res.ok is true, navigate to sign-in
      navigate('/sign-in');
    } catch (error) {
      setErrorMessage(error.message || 'Failed to sign up');
    } finally {
      setLoading(false); // This will run regardless of try/catch outcome
    }
  };
  //     if (data.success === false) {
  //       return setErrorMessage(data.message);
  //     }
  //     setLoading(false);
  //     if (res.ok) {
  //       navigate('/sign-in');
  //     }
  //   } catch (error) {
  //     setErrorMessage(error.message);
  //     setLoading(false);
  //   }
  // };
  return (
    <div className='min-h-screen mt-20'>
      <div className='flex flex-col md:flex-row md:items-center p-3 max-w-3xl mx-auto gap-5'>
        <div className='flex-1'>
          <Link className='font-bold dark:text-white text-4xl' to="/">
              <span className='px-2 py-1 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>MERN</span>
              Blog
          </Link>
          <p className='text-sm mt-5'>
          Welcome to our most awesome Blog! You can Sign Up with Your email and password or with Google. 
          </p>
        </div>
        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div className=''>
              <Label value='Your Username' />
              <TextInput 
                type='text'
                placeholder='devziaus'
                className='w-full'
                id='username'
                onChange={handleChange}
              />
            </div>
            <div className=''>
              <Label value='Your Email' />
              <TextInput 
                type='email'
                placeholder='name@company.com'
                className='w-full'
                id='email'
                onChange={handleChange}
              />
            </div>
            <div className=''>
              <Label value='Your Password' />
              <TextInput 
                type='password'
                placeholder='********'
                className='w-full'
                id='password'
                onChange={handleChange}
              />
            </div>
            <Button gradientDuoTone='purpleToPink' type='submit' disabled={loading}>
              {
                loading ? (
                  <>
                    <Spinner size='sm' />
                    <span className='pl-3'>Loading...</span>
                  </>
                ) : 'Sign Up'
              }
            </Button>
            <OAuth />
          </form>
          <div className='flex gap-2 text-sm mt-5'>
            <span>Have an account?</span>
            <Link to='/sign-in' className='text-blue-500'>
              Sign In
            </Link>
          </div>
          {
            errorMessage && (
              <Alert className='mt-5' color='failure'>
                {errorMessage}
              </Alert>
            )
          }
        </div>
      </div>
    </div>
  )
}
