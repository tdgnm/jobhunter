import PropTypes from 'prop-types'
import { jwtDecode } from 'jwt-decode'
import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { selectUser, selectToken } from '../../state/authSlice'
import { logout } from '../../state/authSlice'

const Authenticate = ({ type, children, noRedirect }) => {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const token = useSelector(selectToken)
  const isJobSeeker = user?.role === 'jobSeeker'
  const isCompany = user?.role === 'company'

  useEffect(() => {
    if (token) {
      const { exp } = jwtDecode(token)
      if (exp * 1000 < Date.now()) {
        dispatch(logout())
      }
    }
  }, [token, dispatch])

  if ((type === 'none' && !isJobSeeker && !isCompany)
    || (type === 'either' && (isJobSeeker || isCompany))
    || (type === 'jobSeeker' && isJobSeeker)
    || (type === 'company' && isCompany)) {
    return children || <></>
  } else {
    return noRedirect ? <></> : <Navigate to="/" replace />
  }
}

Authenticate.propTypes = {
  type: PropTypes.string.isRequired,
  children: PropTypes.node,
  noRedirect: PropTypes.bool,
}

export default Authenticate