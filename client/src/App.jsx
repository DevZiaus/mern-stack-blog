import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Projects from './pages/Projects'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'
import Header from './components/Header'
import FooterCom from './components/Footer'
import PrivateRoute from './components/PrivateRoute'
import OnlyAdminRoute from './components/OnlyAdminRoute'
import CreatePost from './pages/CreatePost'
import AdminOrAuthorRoute from './components/AdminOrAuthorRoute'
import UpdatePost from './pages/UpdatePost'
import SinglePost from './pages/SinglePost'


export default function App() {
  return (
    <BrowserRouter>
      <Header />
      
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route element={<PrivateRoute />}>
          <Route path='/dashboard' element={<Dashboard />} />
        </Route>
        <Route element={<AdminOrAuthorRoute />}>
          <Route path='/create-post' element={<CreatePost />} />
          <Route path='/update-post/:postId' element={<UpdatePost />} />
        </Route>
        <Route path='/projects' element={<Projects />} />
        <Route path='/post/:slug' element={<SinglePost />} />
      </Routes>

      <FooterCom />
    </BrowserRouter>
  )
}
