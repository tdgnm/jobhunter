import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../state/authSlice'

const Logout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  useEffect(() => {
    dispatch(logout())
    navigate('/', { replace: true })
  })

  return <></>
}
  
export default Logout