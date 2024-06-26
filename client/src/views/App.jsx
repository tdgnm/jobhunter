import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './layouts/Layout'
import Authenticate from './auth/Authenticate'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import Logout from './pages/Logout'
import Profile from './pages/Profile'
import AddEditJob from './pages/AddEditJob'
import JobDetails from './pages/JobDetails'
import JobSeekerDetails from './pages/JobSeekerDetails'


const App = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/register" element={<Authenticate type="none"><Register /></Authenticate>} />
          <Route path="/login" element={<Authenticate type="none"><Login /></Authenticate>} />
          <Route path="/logout" element={<Authenticate type="either"><Logout /></Authenticate>} />
          <Route path="/profile" element={<Authenticate type="either"><Profile /></Authenticate>} />
          <Route path="/add-job" element={<Authenticate type="company"><AddEditJob edit={false} /></Authenticate>} />
          <Route path="/edit-job/:id" element={<Authenticate type="company"><AddEditJob edit={true} /></Authenticate>} />
          <Route path="/job-details/:id" element={<JobDetails />} />
          <Route path="/job/:jobId/applicant/:userId" element={<Authenticate type="company"><JobSeekerDetails /></Authenticate>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App