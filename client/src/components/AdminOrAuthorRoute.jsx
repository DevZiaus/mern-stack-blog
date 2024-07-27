import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

export default function AdminOrAuthorRoute() {
    const { currentUser } = useSelector((state) => state.user);
  return currentUser && (currentUser.role === 'admin' || currentUser.role === 'author')  ? <Outlet /> : <Navigate to='/sign-in' />;
}
