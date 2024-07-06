import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Alert, Button, Modal, Table } from 'flowbite-react'
import { HiOutlineExclamationCircle } from 'react-icons/hi'

export default function allUsers() {
    const { currentUser, error } = useSelector(state => state.user);
    const [users, setUsers] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [userIdToDelete, setUserIdToDelete] =useState('');
    const [deleteUserSuccess, setDeleteUserSuccess] = useState(null);
    const [deleteUserError, setDeleteUserError] = useState(null);

    useEffect(() => {
      const fetchUsers = async () => {
        try {
          const res = await fetch(`/api/user/get-users`);
          const data = await res.json();
          if (res.ok) {
            setUsers(data.users);
            if(data.users.length < 9) {
              setShowMore(false);
            }
          }
        } catch (error) {
          console.log(error.message);
        }
      };
      if (currentUser.role === 'admin' || currentUser.role === 'author') {
        fetchUsers();
      }
    }, [currentUser._id] );

    const handleShowMore = async() => {
      const startIndex = users.length;
      try {
        const res = await fetch(`/api/user/get-users?startIndex=${startIndex}`);
        const data = await res.json();
        if (res.ok) {
          setUsers((prev) => [...prev, ...data.users]);
          if(data.users.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    const handleDeleteUser = async() => {
      setShowModal(false);
      try {
        const res = await fetch(`/api/user/delete-user/${userIdToDelete}/${currentUser._id}`,
          {
            method: 'DELETE',
          }
        );
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
          setDeleteUserError(data.message);
        } else {
          setUsers((prev) => 
          prev.filter((user) => user._id !== userIdToDelete)
          );
          setDeleteUserSuccess(data.message);
        }
      } catch (error) {
        console.log(error.message);
        setDeleteUserError(error.message)
      }
    };

  return (
    <div className='flex flex-col md:mx-auto'>
      <div className='mt-5 mx-auto w-full md:w-96'>
          {
              (currentUser.role === 'admin') && (
                  <Link to={'/create-user'}>
                      <Button type='button' gradientDuoTone='purpleToPink' className='w-52 sm:w-64 md:w-full ml-5 md:mx-auto mr-2'>
                          Create a user
                      </Button>
                  </Link>
              )
          }
      </div>
      <div className='mt-5 table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
        {(currentUser.role === 'admin' || currentUser.role === 'author') && users.length > 0 ? (
          <>
            <Table hoverable className='shadow-md text-center'>
              <Table.Head>
                <Table.HeadCell>Date Created</Table.HeadCell>
                <Table.HeadCell>Picture</Table.HeadCell>
                <Table.HeadCell>User Name</Table.HeadCell>
                <Table.HeadCell>Name</Table.HeadCell>
                <Table.HeadCell>Role</Table.HeadCell>
                <Table.HeadCell>Email</Table.HeadCell>
                {currentUser.role === 'admin' && (
                <>
                  <Table.HeadCell>Delete</Table.HeadCell>
                  <Table.HeadCell>Edit</Table.HeadCell>
                </>
                )}
              </Table.Head>
              {users.map((user) =>(
                <Table.Body key={user._id} className='divide-y'>
                  <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                    <Table.Cell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>
                      <Link to={`/user/${user._id}`}>
                        <img 
                          src={user.profilePicture}
                          alt={user.username}
                          className='w-10 h-10 object-cover bg-gray-500 rounded-full justify-center'
                        />
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      <Link className='font-medium text-gray-900 dark:text-white' to={`/user/${user._id}`}>
                        {user.username}
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      {user.name || '--'}
                    </Table.Cell>
                    <Table.Cell>
                      {user.role}
                    </Table.Cell>
                    <Table.Cell>
                      {user.email || '--'}
                    </Table.Cell>
                    {currentUser.role === 'admin' && (
                      <>
                        <Table.Cell>
                          <span onClick={() => {
                            setShowModal(true);
                            setUserIdToDelete(user._id);
                          }} 
                          className='font-medium text-red-500 hover:underline cursor-pointer'>Delete</span>
                        </Table.Cell>
                        <Table.Cell>
                          <Link to={`/update-user/${user._id}`}>
                            <span className='text-teal-500 hover:underline cursor-pointer'>Edit</span>
                          </Link>
                        </Table.Cell>
                      </>
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
          <p>No users yet</p>
        )}

        {deleteUserSuccess && (
          <Alert color='success' className='mt-5'>
            {deleteUserSuccess}
          </Alert>
        )}
        {deleteUserError && (
          <Alert color='failure' className='mt-5'>
            {deleteUserError}
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
                    <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete this User?</h3>
                  <div className='flex justify-center gap-4'>
                      <Button color='failure' onClick={handleDeleteUser}>Yes, I'm sure</Button>
                      <Button color='gray' onClick={() => setShowModal(false)}>No, Cancel</Button>
                  </div>
                </div>
              </Modal.Body>
        </Modal>
      </div>
    </div>
  );
}
