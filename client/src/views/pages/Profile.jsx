import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { selectUser } from '../../state/authSlice'
import JobSeekerProfile from './JobSeekerProfile'
import CompanyProfile from './CompanyProfile'

const Profile = () => {
  const user = useSelector(selectUser)

  if (!user) {
    return <Navigate to="/" replace />
  } 
  return user.role === 'jobSeeker' ? <JobSeekerProfile /> : <CompanyProfile />
}

export default Profile