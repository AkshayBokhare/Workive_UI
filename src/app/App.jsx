import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from '../components/layout/AppShell'
import { ProtectedRoute } from '../components/layout/ProtectedRoute'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Home from '../pages/Home'
import Search from '../pages/Search'
import Profile from '../pages/Profile'
import EditProfile from '../pages/EditProfile'
import AssignmentsCalendar from '../pages/AssignmentsCalendar'
import CreateAssignment from '../pages/CreateAssignment'
import AssignmentDetail from '../pages/AssignmentDetail'
import Chats from '../pages/Chats'
import ChatDetail from '../pages/ChatDetail'
import CreatePost from '../pages/CreatePost'
import PostDetail from '../pages/PostDetail'
import MyPosts from '../pages/MyPosts'
import Notifications from '../pages/Notifications'
import { useAuthStore } from '../store/authStore'

function PublicOnly({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  if (isAuthenticated) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
        <Route path="/register" element={<PublicOnly><Register /></PublicOnly>} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/chats" element={<Chats />} />
            <Route path="/assignments" element={<AssignmentsCalendar />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:userId" element={<Profile />} />
          </Route>

          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/assignments/new" element={<CreateAssignment />} />
          <Route path="/assignments/:assignmentId" element={<AssignmentDetail />} />
          <Route path="/chats/:conversationId" element={<ChatDetail />} />
          <Route path="/posts/new" element={<CreatePost />} />
          <Route path="/posts/mine" element={<MyPosts />} />
          <Route path="/posts/:postId" element={<PostDetail />} />
          <Route path="/notifications" element={<Notifications />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
