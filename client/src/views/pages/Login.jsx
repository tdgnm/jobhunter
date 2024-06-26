import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useLoginMutation } from '../../state/authApiSlice'
import { login } from '../../state/authSlice'
import { IoEye, IoEyeOff } from 'react-icons/io5'

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState({})

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [authLogin] = useLoginMutation()

  const [show, setShow] = useState(false)

  const showPassword = () => {
    setShow(!show)
  }

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { email, password } = credentials
    const newErrors = {}
    if (!email) {
      newErrors.email = 'Az e-mail cím megadása kötelező!'
    }
    if (!password) {
      newErrors.password = 'A jelszó megadása kötelező!'
    }
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    try {
      const data = await authLogin({
        email,
        password,
      }).unwrap()

      dispatch(
        login({
          user: data.user,
          token: data.accessToken,
        })
      )

      navigate('/', { replace: true })
    } catch (error) {
      newErrors.fail = 'Hibás felhasználónév vagy jelszó!'
      setErrors(newErrors)
    }
  }

  return (
    <div className="flex justify-center">
      <form onSubmit={handleSubmit} className="w-[min(24rem,95%)]">
        <label htmlFor="email" className="form-control mt-10 mb-2 text-xl font-medium text-gray-500">E-mail</label>
        <input
          type="email"
          id="email"
          name="email"
          onChange={handleChange}
          className="input input-bordered w-full h-14 text-xl"
        />
        {errors.email && <span className="text-red-500 font-bold">{errors.email}</span>}
        <label htmlFor="password" className="form-control mt-5 mb-2 text-xl font-medium text-gray-500">Jelszó</label>
        <div className="relative">
          <input
            type={show ? 'text' : 'password'}
            id="password"
            name="password"
            onChange={handleChange}
            className="input input-bordered w-full h-14 text-xl"
          />
          <button type="button" onClick={showPassword} className="h-14 w-10 absolute right-0" tabIndex={-1}>
            {show ? <IoEyeOff size={25} /> : <IoEye size={25} />}
          </button>
        </div>
        {errors.password && <span className="text-red-500 font-bold">{errors.password}</span>}
        {errors.fail && <span className="text-red-500 font-bold mt-5 inline-block">{errors.fail}</span>}
        <div className="flex justify-center">
          <button type="submit" className="btn btn-primary mt-5 w-72 text-xl">Bejelentkezés</button>
        </div>
      </form>
    </div>
  )
}

export default Login